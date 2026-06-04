import passport from "passport";
import jwt from "jsonwebtoken";
import GoogleStrategy from "passport-google-oauth20";
import pg from 'pg';

import dotenv from "dotenv";

dotenv.config();
const pool = new pg.Pool({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'your_new_password',
  database: process.env.DB_NAME || 'login',
  port: process.env.DB_PORT || 5432,
});

export default function initializePassport() {
  passport.serializeUser((user, done) => {
    done(null, user);
  });

  passport.deserializeUser((obj, done) => {
    done(null, obj);
  });

  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL || "http://localhost:5001/auth/google/callback",
      },
      async (accessToken, refreshToken, profile, done) => {
        const email = profile.emails[0].value;
        const name = profile.displayName;

        await pool.query(
          `INSERT INTO users(email, name, provider, completed)
           VALUES ($1, $2, $3, $4)
           ON CONFLICT (email) DO UPDATE SET
             name = EXCLUDED.name,
             provider = EXCLUDED.provider,
             completed = EXCLUDED.completed`,
          [email, name, 'google', true]
        );
        return done(null, { name, email });
      }
    )
  );
}

export const handleGoogleCallback = async (req, res) => {
  try {
    const { code } = req.body;
    if (!code) return res.status(400).json({ error: 'Missing authorization code' });

    const tokenEndpoint = 'https://oauth2.googleapis.com/token';

    // IMPORTANT: Use 'postmessage' for popup-based OAuth flows
    // This is required when using initCodeClient with ux_mode: 'popup'
    console.log('[auth-server] Received auth code. Preparing token exchange...');
    console.log('[auth-server] Using Client ID:', process.env.GOOGLE_CLIENT_ID ? process.env.GOOGLE_CLIENT_ID.substring(0, 10) + '...' : 'UNDEFINED');

    const params = new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID,
      client_secret: process.env.GOOGLE_CLIENT_SECRET,
      redirect_uri: 'postmessage',
      grant_type: 'authorization_code',
      access_type: 'offline', // Request refresh token
    });

    const redirectUsed = params.get('redirect_uri');
    console.log('[auth-server] token exchange will use redirect_uri:', redirectUsed);
    console.log('[auth-server] token exchange token endpoint:', tokenEndpoint);

    // Mask client_secret before logging to avoid leaking secrets in logs
    try {
      const pairs = Array.from(params.entries());
      const masked = pairs.map(([k, v]) => [k, k === 'client_secret' ? '[REDACTED]' : v]);
      const maskedParams = new URLSearchParams(masked);
      console.log('[auth-server] token request body (urlencoded, masked):', maskedParams.toString());
    } catch (logErr) {
      console.warn('[auth-server] failed to mask token request body for logging', logErr);
    }

    const tokenResp = await fetch(tokenEndpoint, {
      method: 'POST',
      body: params,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    let tokenData;
    try {
      tokenData = await tokenResp.json();
    } catch (parseErr) {
      const text = await tokenResp.text().catch(() => '<no-body>');
      console.error('[auth-server] failed to parse token response as JSON', parseErr, text);
      return res.status(500).json({ error: 'Failed to parse token response', details: text });
    }

    if (!tokenResp.ok) {
      console.error('[auth-server] token endpoint error', tokenData);
      return res.status(500).json({ error: 'Failed to exchange code', details: tokenData });
    }

    console.log('[auth-server] successfully exchanged code for tokens');

    // Fetch complete user info
    const userInfoResp = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await userInfoResp.json();
    console.log('[auth-server] fetched user profile:', {
      email: profile.email,
      sub: profile.sub,
      name: profile.name,
      given_name: profile.given_name,
      picture: profile.picture,
      email_verified: profile.email_verified
    });

    // Check if user already exists
    let user;
    try {
      const checkUserQuery = 'SELECT * FROM users WHERE email = $1';
      const existingUser = await pool.query(checkUserQuery, [profile.email]);

      if (existingUser.rows.length > 0) {
        // User already exists - this is a login, not a signup
        user = existingUser.rows[0];
        console.log('[auth-server] existing user logging in:', user.email);

        // Update the refresh token if provided
        if (tokenData.refresh_token) {
          await pool.query(
            'UPDATE users SET google_refresh_token = $1 WHERE email = $2',
            [tokenData.refresh_token, profile.email]
          );
        }
      } else {
        // New user - create account
        const insertUserQuery = `
          INSERT INTO users (email, name, provider, completed, google_refresh_token)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `;
        const { rows } = await pool.query(insertUserQuery, [
          profile.email,
          profile.name,
          'google',
          true,
          tokenData.refresh_token || null
        ]);
        user = rows[0];
        console.log('[auth-server] new user created:', user.email);
      }
    } catch (dbErr) {
      console.error('[auth-server] database error while checking/creating user', dbErr);
      return res.status(500).json({ error: 'database_error', message: 'Failed to process user' });
    }

    // Sign a local JWT to represent a session in your app
    const jwtPayload = {
      sub: profile.sub,
      email: user.email,
      name: user.name,
    };

    const JWT_SECRET = process.env.JWT_SECRET || 'dev_jwt_secret_change_me';
    const localToken = jwt.sign(jwtPayload, JWT_SECRET, { expiresIn: '12h' });

    // Set the JWT as an HTTP-only cookie instead of returning it in the response
    res.cookie('session_token', localToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // Use secure in production
      sameSite: 'lax',
      maxAge: 12 * 60 * 60 * 1000, // 12 hours
      path: '/'
    });

    console.log('[auth-server] session cookie set successfully');

    // Return success without exposing the token
    return res.json({
      success: true,
      user: {
        email: user.email,
        name: user.name
      }
    });
  } catch (err) {
    console.error('[auth-server] unexpected error', err);
    return res.status(500).json({ error: 'internal_error' });
  }
};
