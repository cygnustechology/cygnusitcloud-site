// Run once to seed the admin user into cygnus_maindb
// Uses environment variables so credentials are never hardcoded.
//
// Usage:
//   ADMIN_EMAIL=administrator@cygnusitcloud.com ADMIN_PASSWORD=yourpass node seed-admin.js
//
// If env vars are not set, it will prompt an error and exit.

const bcrypt = require("bcryptjs");
const pool = require("./db");
require("dotenv").config();

async function seed() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;
  const name = process.env.ADMIN_NAME || "Administrator";

  if (!email || !password) {
    console.error("ERROR: Set ADMIN_EMAIL and ADMIN_PASSWORD environment variables.");
    console.error("Example: ADMIN_EMAIL=administrator@cygnusitcloud.com ADMIN_PASSWORD=secret node seed-admin.js");
    process.exit(1);
  }

  const hash = await bcrypt.hash(password, 10);
  await pool.query(
    `INSERT INTO users (email, name, password_hash, role, workspace, max_apps, max_databases, storage_quota_mb)
     VALUES ($1, $2, $3, 'admin', '__admin__', -1, -1, -1)
     ON CONFLICT (email) DO UPDATE SET password_hash = $3, name = $2`,
    [email, name, hash]
  );
  console.log(`Admin user seeded: ${email}`);
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
