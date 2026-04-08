# Cygnus Cloud Platform

**Centralized cloud management & identity platform** for all Cygnus projects.

## Architecture

```
┌─────────────────────────────────────────────────────┐
│              cygnus_maindb (PostgreSQL)              │
│  persons │ users │ projects │ apps │ connections │ … │
└────────────────────────┬────────────────────────────┘
                         │
         ┌───────────────┼───────────────┐
         │               │               │
   Cygnus Cloud    Vote Polling    Visitor Mgmt
   (this app)       System          System
```

### Centralized Identity

All Cygnus projects share the `persons` table in `cygnus_maindb`. A person registered in Vote Polling is automatically recognized in Visitor Management and vice-versa. The `person_projects` table tracks which projects each person participates in, and `activity_log` provides a cross-project audit trail.

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 18, Vite 5, Tailwind CSS, shadcn/ui |
| Backend  | Node.js, Express 4, JWT auth        |
| Database | PostgreSQL (`cygnus_maindb`)         |
| VM Agent | CloudPanel Agent (per-VM)            |

## Project Structure

```
├── src/                    # React frontend
│   ├── pages/              # Login, Dashboard, Index
│   ├── components/dashboard/  # Dashboard panels
│   ├── lib/api.ts          # API client (JWT auto-inject)
│   ├── lib/auth.ts         # Auth functions
│   └── lib/connections.ts  # CRUD for apps, connections, databases
│
├── server/                 # Express API (deployed separately)
│   ├── index.js            # Entry point (port 4000)
│   ├── db.js               # PostgreSQL pool (cygnus_maindb)
│   ├── schema.sql          # Full database schema
│   ├── seed-admin.js       # Admin user seeder
│   ├── middleware/auth.js   # JWT middleware
│   └── routes/             # auth, apps, connections, databases, tenants
│
└── README.md
```

## API Endpoints

| Method | Endpoint                     | Auth     | Description              |
|--------|------------------------------|----------|--------------------------|
| POST   | `/api/auth/login`            | Public   | Login, returns JWT       |
| GET    | `/api/auth/session`          | Bearer   | Verify session           |
| POST   | `/api/auth/change-password`  | Bearer   | Change password          |
| GET    | `/api/apps`                  | Bearer   | List user's apps         |
| POST   | `/api/apps`                  | Bearer   | Create app               |
| PUT    | `/api/apps/:id`              | Bearer   | Update app               |
| DELETE | `/api/apps/:id`              | Bearer   | Delete app               |
| GET    | `/api/connections`           | Bearer   | List VM connections      |
| POST   | `/api/connections`           | Bearer   | Add connection           |
| PUT    | `/api/connections/:id`       | Bearer   | Update connection        |
| DELETE | `/api/connections/:id`       | Bearer   | Delete connection        |
| GET    | `/api/databases`             | Bearer   | List databases           |
| POST   | `/api/databases`             | Bearer   | Create database record   |
| PUT    | `/api/databases/:id`         | Bearer   | Update database          |
| DELETE | `/api/databases/:id`         | Bearer   | Delete database          |
| GET    | `/api/tenants`               | Admin    | List tenants             |
| POST   | `/api/tenants`               | Admin    | Create tenant            |
| PUT    | `/api/tenants/:id`           | Admin    | Update tenant            |
| DELETE | `/api/tenants/:id`           | Admin    | Delete tenant            |
| POST   | `/api/tenants/:id/toggle`    | Admin    | Enable/disable tenant    |

## Database Schema (cygnus_maindb)

### Core Identity Tables
- **persons** — Single registration across ALL Cygnus projects (name, email, phone, IC/passport, company, photo)
- **projects** — Registry of Cygnus systems (cygnus-cloud, vote-polling, visitor-mgmt)
- **person_projects** — Which person participates in which project, with role
- **activity_log** — Cross-project audit trail (who did what, where, when)

### Platform Tables
- **users** — Admin & tenant accounts for Cygnus Cloud dashboard
- **connections** — VM agent connections
- **apps** — Deployed applications
- **databases** — Managed database containers

## Deployment

### VPS Details
- **Host:** `103.152.12.106` (SSH port `2222`, user `cygnus`)
- **API:** `http://103.152.12.106:4000`
- **Database:** `cygnus_maindb` (PostgreSQL, user `cygnus_user`)

### Server Setup
```bash
cd /opt/cygnus-api
npm install
psql -U cygnus_user -d cygnus_maindb -f schema.sql
node seed-admin.js
node index.js   # or use PM2: pm2 start index.js --name cygnus-api
```

### Frontend
The frontend connects to the API via `VITE_API_URL` (defaults to `http://103.152.12.106:4000`).

### Default Admin
Credentials are set via environment variables during seeding — never hardcoded:
```bash
ADMIN_EMAIL=administrator@cygnusitcloud.com ADMIN_PASSWORD=yourpass node seed-admin.js
```

## Dashboard Features

| Panel        | Description                                              |
|--------------|----------------------------------------------------------|
| Apps         | Create, deploy, manage applications on connected VMs     |
| Databases    | Provision database containers (PostgreSQL, MySQL, Redis…) |
| Activity     | Cross-app deploy history & audit log                     |
| Tenants      | Admin-only tenant management (CRUD, enable/disable)      |
| Settings     | VM connections, backup/export, system stats               |
| Help & Docs  | Setup guides and documentation                           |

## Cross-Project Integration

To integrate a new Cygnus project with centralized identity:

1. Register the project in the `projects` table
2. Use the `persons` table for user lookup/registration
3. Link persons to the project via `person_projects`
4. Log activities to `activity_log` with the project ID

Example SQL for person lookup:
```sql
SELECT p.* FROM persons p
JOIN person_projects pp ON pp.person_id = p.id
JOIN projects pr ON pr.id = pp.project_id
WHERE pr.code = 'vote-polling' AND p.email = 'user@example.com';
```
