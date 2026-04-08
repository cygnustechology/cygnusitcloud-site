// Run once to generate the correct bcrypt hash for admin and seed it
const bcrypt = require("bcryptjs");
const pool = require("./db");

async function seed() {
  const hash = await bcrypt.hash("admin123", 10);
  await pool.query(
    `INSERT INTO users (email, name, password_hash, role, workspace, max_apps, max_databases, storage_quota_mb)
     VALUES ('admin@cygnus.cloud', 'Admin', $1, 'admin', '__admin__', -1, -1, -1)
     ON CONFLICT (email) DO UPDATE SET password_hash = $1`,
    [hash]
  );
  console.log("Admin seeded with hash:", hash);
  process.exit(0);
}

seed().catch(e => { console.error(e); process.exit(1); });
