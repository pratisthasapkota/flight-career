import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20"; // ✅ Named import
import dotenv from "dotenv";

dotenv.config();

// ------------------- Passport serialize/deserialize -------------------
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

// ------------------- GOOGLE STRATEGY -------------------
const backendUrl = process.env.BACKEND_URL || "http://localhost:5000"; // make sure your .env has BACKEND_URL

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,       // must match your .env
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // must match your .env
      callbackURL: `${backendUrl}/auth/google/callback`,
    },
    (accessToken, refreshToken, profile, done) => {
      const user = {
        name: profile.displayName,
        email: profile.emails[0].value,
        photo: profile.photos[0]?.value || null,
      };
      done(null, user);
    }
  )
);

export default passport;
