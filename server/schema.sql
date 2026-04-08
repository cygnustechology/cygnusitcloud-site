-- Cygnus Cloud Database Schema
-- Run this as the postgres superuser or cygnus_user

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Users table (admin + tenants)
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

-- VM Connections
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

-- Apps
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

-- Managed databases
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

-- Seed default admin (password: admin123)
INSERT INTO users (email, name, password_hash, role, workspace, max_apps, max_databases, storage_quota_mb)
VALUES ('admin@cygnus.cloud', 'Admin', '$2a$10$rQZK8sDwZBGHRHmE5Mh2aOLH5p1Kn7YxX8FjVqkN6kZJGvRn0WCWK', 'admin', '__admin__', -1, -1, -1)
ON CONFLICT (email) DO NOTHING;
