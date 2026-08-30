import dotenv from "dotenv";
dotenv.config();

const REQUIRED_IN_PROD = [
  "SESSION_SECRET",
  "JWT_SECRET",
  "DB_PASSWORD",
  "GOOGLE_CLIENT_ID",
  "GOOGLE_CLIENT_SECRET",
  "ADMIN_PASSWORD_HASH",
];

if (process.env.NODE_ENV === "production") {
  const missing = REQUIRED_IN_PROD.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(
      `[env] Missing required env vars in production: ${missing.join(", ")}`
    );
    process.exit(1);
  }

  for (const k of ["SESSION_SECRET", "JWT_SECRET", "DB_PASSWORD"]) {
    if ((process.env[k]?.length ?? 0) < 24) {
      console.error(`[env] ${k} is too short for production. Regenerate it.`);
      process.exit(1);
    }
  }
}