const router = require("express").Router();
const bcrypt = require("bcryptjs");
const pool = require("../db");
const { authenticate, adminOnly } = require("../middleware/auth");

router.use(authenticate, adminOnly);

router.get("/", async (_, res) => {
  try {
    const { rows } = await pool.query("SELECT id, email, name, role, workspace, created_at, last_login, disabled, max_apps, max_databases, storage_quota_mb FROM users WHERE role = 'tenant' ORDER BY created_at DESC");
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { email, name, password, workspace, maxApps, maxDatabases, storageQuotaMb } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const slug = workspace.toLowerCase().replace(/[^a-z0-9_-]/g, "-");
    const { rows } = await pool.query(
      `INSERT INTO users (email, name, password_hash, role, workspace, max_apps, max_databases, storage_quota_mb)
       VALUES ($1, $2, $3, 'tenant', $4, $5, $6, $7) RETURNING id, email, name, role, workspace, created_at, max_apps, max_databases, storage_quota_mb`,
      [email, name, hash, slug, maxApps || 5, maxDatabases || 3, storageQuotaMb || 1024]
    );
    res.json(rows[0]);
  } catch (err) {
    if (err.code === "23505") return res.status(409).json({ error: "Email or workspace already exists" });
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, email, workspace, maxApps, maxDatabases, storageQuotaMb } = req.body;
    const { rows } = await pool.query(
      `UPDATE users SET name=COALESCE($1,name), email=COALESCE($2,email), workspace=COALESCE($3,workspace),
       max_apps=COALESCE($4,max_apps), max_databases=COALESCE($5,max_databases), storage_quota_mb=COALESCE($6,storage_quota_mb)
       WHERE id=$7 AND role='tenant' RETURNING *`,
      [name, email, workspace, maxApps, maxDatabases, storageQuotaMb, req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Tenant not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/:id/toggle", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "UPDATE users SET disabled = NOT disabled WHERE id = $1 AND role = 'tenant' RETURNING id, disabled",
      [req.params.id]
    );
    if (!rows.length) return res.status(404).json({ error: "Tenant not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1 AND role = 'tenant'", [req.params.id]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
