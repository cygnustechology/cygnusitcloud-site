-- Cygnus Main Database Schema
-- Database: cygnus_maindb
-- This is the centralized identity & platform database.
-- All Cygnus projects (Vote Polling, Visitor Management, etc.) share this DB
-- so users register ONCE and are recognized across all systems.

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

------------------------------------------------------------
-- CENTRALIZED IDENTITY: persons table
-- Single registration across ALL Cygnus projects.
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS persons (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE,
  phone VARCHAR(50),
  ic_passport VARCHAR(50),
  company VARCHAR(255),
  department VARCHAR(255),
  designation VARCHAR(255),
  photo_url TEXT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

------------------------------------------------------------
-- PLATFORM USERS (admin & tenants for Cygnus Cloud)
-- Links to persons for identity
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID REFERENCES persons(id) ON DELETE SET NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  password_hash TEXT NOT NULL,
  role VARCHAR(20) NOT NULL DEFAULT 'tenant' CHECK (role IN ('admin', 'tenant')),
  workspace VARCHAR(255) UNIQUE NOT NULL,
  disabled BOOLEAN DEFAULT false,
  max_apps INT DEFAULT 5,
  max_databases INT DEFAULT 3,
  storage_quota_mb INT DEFAULT 1024,
  last_login TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

------------------------------------------------------------
-- PROJECT REGISTRY
-- Tracks which Lovable projects use this central DB
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code VARCHAR(50) UNIQUE NOT NULL,         -- e.g. 'vote-polling', 'visitor-mgmt'
  name VARCHAR(255) NOT NULL,
  description TEXT,
  api_url TEXT,                              -- deployed URL of the project
  created_at TIMESTAMPTZ DEFAULT NOW()
);

------------------------------------------------------------
-- PERSON ↔ PROJECT participation
-- Tracks which person is registered/active in which project
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS person_projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID REFERENCES persons(id) ON DELETE CASCADE NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE NOT NULL,
  role VARCHAR(50) DEFAULT 'participant',    -- 'participant', 'admin', 'voter', 'visitor', etc.
  registered_at TIMESTAMPTZ DEFAULT NOW(),
  metadata JSONB DEFAULT '{}',
  UNIQUE(person_id, project_id)
);

------------------------------------------------------------
-- ACTIVITY LOG
-- Centralized tracking: who did what, in which project
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS activity_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  person_id UUID REFERENCES persons(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  action VARCHAR(100) NOT NULL,             -- 'check_in', 'voted', 'registered', etc.
  details JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_activity_person ON activity_log(person_id);
CREATE INDEX IF NOT EXISTS idx_activity_project ON activity_log(project_id);
CREATE INDEX IF NOT EXISTS idx_activity_created ON activity_log(created_at DESC);

------------------------------------------------------------
-- VM CONNECTIONS (for Cygnus Cloud panel)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  label VARCHAR(255) NOT NULL,
  agent_url TEXT NOT NULL,
  agent_secret TEXT NOT NULL,
  is_default BOOLEAN DEFAULT false,
  status VARCHAR(20) DEFAULT 'disconnected' CHECK (status IN ('connected', 'disconnected', 'error')),
  last_checked TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

------------------------------------------------------------
-- APPS (deployed applications)
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS apps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  connection_id UUID REFERENCES connections(id) ON DELETE SET NULL,
  name VARCHAR(255) NOT NULL,
  repo_url TEXT,
  deploy_path TEXT NOT NULL DEFAULT '/var/www',
  domain VARCHAR(255),
  port INT NOT NULL DEFAULT 3000,
  build_cmd TEXT,
  status VARCHAR(20) DEFAULT 'idle' CHECK (status IN ('running', 'deploying', 'stopped', 'failed', 'idle')),
  auto_deploy BOOLEAN DEFAULT true,
  webhook_secret TEXT,
  env_vars JSONB DEFAULT '{}',
  last_deployed TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

------------------------------------------------------------
-- MANAGED DATABASES
------------------------------------------------------------
CREATE TABLE IF NOT EXISTS databases (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  connection_id UUID REFERENCES connections(id) ON DELETE SET NULL,
  engine VARCHAR(20) NOT NULL CHECK (engine IN ('postgresql', 'mysql', 'mariadb', 'redis', 'mongodb')),
  container_name VARCHAR(255) NOT NULL,
  port INT NOT NULL,
  db_name VARCHAR(255) NOT NULL,
  db_user VARCHAR(255) NOT NULL,
  db_password TEXT NOT NULL,
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error')),
  container_id VARCHAR(255),
  app_id UUID REFERENCES apps(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

------------------------------------------------------------
-- SEED: Default admin user
------------------------------------------------------------
-- NOTE: No hardcoded admin user. Run seed-admin.js with env vars after schema setup:
--   ADMIN_EMAIL=administrator@cygnusitcloud.com ADMIN_PASSWORD=yourpass node seed-admin.js

------------------------------------------------------------
-- SEED: Register known Cygnus projects
------------------------------------------------------------
INSERT INTO projects (code, name, description) VALUES
  ('cygnus-cloud', 'Cygnus Cloud Platform', 'Central cloud management panel'),
  ('vote-polling', 'Vote Polling System', 'AGM voting and polling system'),
  ('visitor-mgmt', 'Visitor Management System', 'Visitor check-in and tracking')
ON CONFLICT (code) DO NOTHING;
