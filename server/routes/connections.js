const router = require("express").Router();
const pool = require("../db");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM connections WHERE user_id = $1 ORDER BY created_at DESC", [req.user.userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { label, agentUrl, agentSecret, isDefault } = req.body;
    if (isDefault) await pool.query("UPDATE connections SET is_default = false WHERE user_id = $1", [req.user.userId]);
    const { rows } = await pool.query(
      `INSERT INTO connections (user_id, label, agent_url, agent_secret, is_default) VALUES ($1,$2,$3,$4,$5) RETURNING *`,
      [req.user.userId, label, agentUrl, agentSecret, isDefault ?? false]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { label, agentUrl, agentSecret, isDefault, status } = req.body;
    if (isDefault) await pool.query("UPDATE connections SET is_default = false WHERE user_id = $1", [req.user.userId]);
    const { rows } = await pool.query(
      `UPDATE connections SET label=COALESCE($1,label), agent_url=COALESCE($2,agent_url), agent_secret=COALESCE($3,agent_secret),
       is_default=COALESCE($4,is_default), status=COALESCE($5,status), last_checked=NOW()
       WHERE id=$6 AND user_id=$7 RETURNING *`,
      [label, agentUrl, agentSecret, isDefault, status, req.params.id, req.user.userId]
    );
    if (!rows.length) return res.status(404).json({ error: "Connection not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM connections WHERE id = $1 AND user_id = $2", [req.params.id, req.user.userId]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
