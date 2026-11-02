import { eq } from "drizzle-orm";
import { db } from "./index.js";
import { login } from "./schema.js";

/**
 * Ensures the account configured through ADMIN_EMAIL / ADMIN_PASSWORD_HASH
 * exists in the database and has the is_admin flag. This is the only place
 * where admin privileges are granted implicitly (from server-side env vars).
 * Existing accounts are promoted without losing their original id/data.
 */
export async function bootstrapAdmin(): Promise<void> {
  const rawEmail = process.env.ADMIN_EMAIL;
  const passwordHash = process.env.ADMIN_PASSWORD_HASH;

  if (!rawEmail || !passwordHash) {
    console.warn(
      "[admin] ADMIN_EMAIL/ADMIN_PASSWORD_HASH not set; skipping admin bootstrap. Use `npm run admin:grant -- <email>` to create an admin."
    );
    return;
  }

  const email = rawEmail.trim().toLowerCase();

  const existing = await db.select().from(login).where(eq(login.email, email));

  if (existing.length === 0) {
    await db.insert(login).values({
      email,
      password: passwordHash,
      verified: true,
      verificationlink: null,
      isAdmin: true,
    });
    console.log(`[admin] Bootstrapped admin account for ${email}`);
    return;
  }

  await db
    .update(login)
    .set({ verified: true, isAdmin: true })
    .where(eq(login.email, email));

  console.log(
    `[admin] Ensured admin privileges for ${email} (existing password left unchanged)`
  );
}
