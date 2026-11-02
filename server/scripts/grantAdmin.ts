import "../env.js";
import { eq } from "drizzle-orm";
import { pool, db } from "../db/index.js";
import { login, users } from "../db/schema.js";

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const revoke = args.includes("--revoke");
  const emailArg = args.find((arg) => !arg.startsWith("--"));

  if (!emailArg) {
    console.error("Usage: npm run admin:grant -- <email> [--revoke]");
    process.exitCode = 1;
    return;
  }

  const email = emailArg.trim().toLowerCase();
  let updated = 0;

  const loginRows = await db.select().from(login).where(eq(login.email, email));
  if (loginRows.length > 0) {
    await db.update(login).set({ isAdmin: !revoke }).where(eq(login.email, email));
    updated += 1;
  }

  const userRows = await db.select().from(users).where(eq(users.email, email));
  if (userRows.length > 0) {
    await db.update(users).set({ isAdmin: !revoke }).where(eq(users.email, email));
    updated += 1;
  }

  if (updated === 0) {
    console.error(`No user found with email ${email}. The account must exist first.`);
    process.exitCode = 1;
    return;
  }

  console.log(
    `${revoke ? "Revoked" : "Granted"} admin privileges for ${email} (${updated} account record(s)).`
  );
}

main()
  .catch((err) => {
    console.error(err);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
