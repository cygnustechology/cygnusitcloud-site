const router = require("express").Router();
const pool = require("../db");
const { authenticate } = require("../middleware/auth");

router.use(authenticate);

router.get("/", async (req, res) => {
  try {
    const { rows } = await pool.query(
      "SELECT * FROM apps WHERE user_id = $1 ORDER BY created_at DESC",
      [req.user.userId]
    );
    res.json(rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { connectionId, name, repoUrl, deployPath, domain, port, buildCmd, autoDeploy, webhookSecret, envVars } = req.body;
    const { rows } = await pool.query(
      `INSERT INTO apps (user_id, connection_id, name, repo_url, deploy_path, domain, port, build_cmd, auto_deploy, webhook_secret, env_vars)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
      [req.user.userId, connectionId, name, repoUrl, deployPath, domain, port, buildCmd, autoDeploy ?? true, webhookSecret, JSON.stringify(envVars || {})]
    );
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, repoUrl, deployPath, domain, port, buildCmd, status, autoDeploy, webhookSecret, envVars, lastDeployed } = req.body;
    const { rows } = await pool.query(
      `UPDATE apps SET name=COALESCE($1,name), repo_url=COALESCE($2,repo_url), deploy_path=COALESCE($3,deploy_path),
       domain=COALESCE($4,domain), port=COALESCE($5,port), build_cmd=COALESCE($6,build_cmd), status=COALESCE($7,status),
       auto_deploy=COALESCE($8,auto_deploy), webhook_secret=COALESCE($9,webhook_secret),
       env_vars=COALESCE($10,env_vars), last_deployed=COALESCE($11,last_deployed)
       WHERE id=$12 AND user_id=$13 RETURNING *`,
      [name, repoUrl, deployPath, domain, port, buildCmd, status, autoDeploy, webhookSecret, envVars ? JSON.stringify(envVars) : null, lastDeployed, req.params.id, req.user.userId]
    );
    if (!rows.length) return res.status(404).json({ error: "App not found" });
    res.json(rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    await pool.query("DELETE FROM apps WHERE id = $1 AND user_id = $2", [req.params.id, req.user.userId]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
