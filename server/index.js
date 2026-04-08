const express = require("express");
const cors = require("cors");
require("dotenv").config();

const authRoutes = require("./routes/auth");
const appsRoutes = require("./routes/apps");
const connectionsRoutes = require("./routes/connections");
const databasesRoutes = require("./routes/databases");
const tenantsRoutes = require("./routes/tenants");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (_, res) => res.json({ status: "ok" }));

app.use("/api/auth", authRoutes);
app.use("/api/apps", appsRoutes);
app.use("/api/connections", connectionsRoutes);
app.use("/api/databases", databasesRoutes);
app.use("/api/tenants", tenantsRoutes);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Cygnus API running on port ${PORT}`));
