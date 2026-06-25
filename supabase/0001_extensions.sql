-- ============================================================
-- Ravi Gupta AI Labs
-- Migration: 0001_extensions.sql
-- Purpose: Enable PostgreSQL extensions
-- ============================================================

CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";

COMMENT ON EXTENSION "pgcrypto" IS 'UUID generation and cryptographic functions';
COMMENT ON EXTENSION "uuid-ossp" IS 'UUID generation functions';
COMMENT ON EXTENSION "vector" IS 'Vector embeddings for AI semantic search';