const router = require("express").Router();
const pool = require("../db");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query("SELECT * FROM databases WHERE user_id = $1 ORDER BY created_at DESC", [req.user.userId]);
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { connectionId, engine, containerName, port, dbName, dbUser, dbPassword, appId } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO databases (user_id, connection_id, engine, container_name, port, db_name, db_user, db_password, app_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *`,
      [req.user.userId, connectionId, engine, containerName, port, dbName, dbUser, dbPassword, appId]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { status, containerName, port, dbName, dbUser, dbPassword } = req.body;
    const { rows } = await pool.query(
      `UPDATE databases SET status=COALESCE($1,status), container_name=COALESCE($2,container_name),
       port=COALESCE($3,port), db_name=COALESCE($4,db_name), db_user=COALESCE($5,db_user), db_password=COALESCE($6,db_password)
       WHERE id=$7 AND user_id=$8 RETURNING *`,
      [status, containerName, port, dbName, dbUser, dbPassword, req.params.id, req.user.userId]
    );
    if (!rows.length) return res.status(404).json({ error: "Database not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM databases WHERE id = $1 AND user_id = $2", [req.params.id, req.user.userId]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
