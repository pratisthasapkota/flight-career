import passport from "passport";
import jwt from "jsonwebtoken";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import type { Profile, VerifyCallback } from "passport-google-oauth20";
import { db } from "../db/index.js";
import { users } from "../db/schema.js";
import { eq } from "drizzle-orm";
import type { Request, Response } from "express";

const JWT_SECRET = process.env.JWT_SECRET || "dev_jwt_secret_change_me";

export default function initializePassport(): void {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj as Express.User);
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID || "",
        clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "/auth/google/callback",
      },
      async (
        _accessToken: string,
        _refreshToken: string,
        profile: Profile,
        done: VerifyCallback
      ): Promise<void> => {
        try {
          const email = profile.emails?.[0]?.value ?? null;
          if (!email) {
            return done(new Error("Google did not return an email address"));
          }

          const name = profile.displayName;

          const existing = await db
            .select()
            .from(users)
            .where(eq(users.email, email));

          if (existing.length > 0) {
            await db
              .update(users)
              .set({ name, provider: "google", completed: true })
              .where(eq(users.email, email));
          } else {
            await db.insert(users).values({
              email,
              name,
              provider: "google",
              completed: true,
            });
          }

          return done(null, { name, email } as Express.User);
        } catch (err) {
          return done(err as Error);
        }
      }
    )
  );
}

interface TokenData {
  access_token: string;
  refresh_token?: string;
  [key: string]: unknown;
}

interface GoogleUserInfo {
  sub?: string;
  email?: string;
  name?: string;
}

export const handleGoogleCallback = async (
  req: Request,
  res: Response
): Promise<Response | void> => {
  try {
    const { code } = req.body as { code?: string };
    if (!code) {
      return res.status(400).json({ error: "Missing authorization code" });
    }

    const tokenEndpoint = "https://oauth2.googleapis.com/token";

    const params = new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID || "",
      client_secret: process.env.GOOGLE_CLIENT_SECRET || "",
      redirect_uri: "postmessage",
      grant_type: "authorization_code",
      access_type: "offline",
    });

    const tokenResp = await fetch(tokenEndpoint, {
      method: "POST",
      body: params,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    let tokenData: TokenData;
    try {
      tokenData = (await tokenResp.json()) as TokenData;
    } catch (parseErr) {
      const text = await tokenResp.text().catch(() => "<no-body>");
      return res
        .status(500)
        .json({ error: "Failed to parse token response", details: text });
    }

    if (!tokenResp.ok) {
      return res
        .status(500)
        .json({ error: "Failed to exchange code", details: tokenData });
    }

    const userInfoResp = await fetch(
      "https://www.googleapis.com/oauth2/v3/userinfo",
      {
        headers: { Authorization: `Bearer ${tokenData.access_token}` },
      }
    );
    const profile = (await userInfoResp.json()) as GoogleUserInfo;

    if (!profile.email) {
      return res.status(500).json({ error: "No email returned from Google" });
    }

    let user;
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(users.email, profile.email));

    if (existingUser.length > 0) {
      user = existingUser[0];
      if (tokenData.refresh_token) {
        await db
          .update(users)
          .set({ googleRefreshToken: tokenData.refresh_token })
          .where(eq(users.email, profile.email));
      }
    } else {
      const result = await db
        .insert(users)
        .values({
          email: profile.email,
          name: profile.name || "",
          provider: "google",
          completed: true,
          googleRefreshToken: tokenData.refresh_token || null,
        })
        .returning();
      user = result[0];
    }

    const localToken = jwt.sign(
      { sub: profile.sub, email: user.email, name: user.name },
      JWT_SECRET,
      { expiresIn: "12h" }
    );

    res.cookie("session_token", localToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 12 * 60 * 60 * 1000,
      path: "/",
    });

    return res.json({
      success: true,
      token: localToken,
      user: { email: user.email, name: user.name },
    });
  } catch (err) {
    console.error("[auth-server] unexpected error", err);
    return res.status(500).json({ error: "internal_error" });
  }
};