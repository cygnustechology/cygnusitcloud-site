const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const { authenticate } = require("../middleware/auth");

const SECRET = process.env.JWT_SECRET || "change-me";

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1 AND disabled = false", [email]);
    if (!rows.length) return res.status(401).json({ error: "Invalid email or password" });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: "Invalid email or password" });

    await pool.query("UPDATE users SET last_login = NOW() WHERE id = $1", [user.id]);

    const token = jwt.sign(
      { userId: user.id, email: user.email, name: user.name, role: user.role, workspace: user.workspace },
      SECRET,
      { expiresIn: "24h" }
    );

    res.json({
      token,
      session: { userId: user.id, email: user.email, name: user.name, role: user.role, workspace: user.workspace, loginAt: new Date().toISOString() },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/session", authenticate, (req, res) => {
  res.json({ session: req.user });
});

router.post("/change-password", authenticate, async (req, res) => {
  try {
    const { newPassword } = req.body;
    const hash = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password_hash = $1 WHERE id = $2", [hash, req.user.userId]);
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
