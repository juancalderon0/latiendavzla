import { Pool } from "pg";
import fs from "node:fs";
import bcrypt from "bcryptjs";

const env = fs.readFileSync(".env.local", "utf8");
const match = env.match(/^DATABASE_URL="(.+)"/m);
if (!match) throw new Error("DATABASE_URL not found in .env.local");

const pool = new Pool({ connectionString: match[1] });

async function main() {
  const email = "juancalderon0@gmail.com";
  const password = "Santy1445.";
  const hash = await bcrypt.hash(password, 10);

  await pool.query(
    `INSERT INTO admin_users (email, password_hash) VALUES ($1, $2)
     ON CONFLICT (email) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [email, hash]
  );

  console.log("Admin user ready:", email);
  await pool.end();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
