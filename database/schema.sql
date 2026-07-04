-- =====================================================================
-- Image Editor
-- Copyright © 2026 Md. Sahabul. All rights reserved.
-- Designed & developed by Md. Sahabul.
-- =====================================================================
-- Database Schema (MySQL 8.0+)
-- This file documents the canonical schema. The Laravel migrations
-- under backend/database/migrations are the executable source of truth;
-- this .sql mirrors them for reference, manual provisioning, and ER review.
-- =====================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

-- ---------------------------------------------------------------------
-- roles & permissions (custom lightweight RBAC, no third-party package)
-- ---------------------------------------------------------------------
CREATE TABLE roles (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(50)  NOT NULL UNIQUE,   -- e.g. admin, editor, user
    label           VARCHAR(100) NOT NULL,
    created_at      TIMESTAMP NULL,
    updated_at      TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE permissions (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name            VARCHAR(100) NOT NULL UNIQUE,   -- e.g. projects.delete
    label           VARCHAR(150) NOT NULL,
    created_at      TIMESTAMP NULL,
    updated_at      TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE permission_role (
    role_id         BIGINT UNSIGNED NOT NULL,
    permission_id   BIGINT UNSIGNED NOT NULL,
    PRIMARY KEY (role_id, permission_id),
    CONSTRAINT fk_pr_role FOREIGN KEY (role_id) REFERENCES roles(id) ON DELETE CASCADE,
    CONSTRAINT fk_pr_perm FOREIGN KEY (permission_id) REFERENCES permissions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- users
-- ---------------------------------------------------------------------
CREATE TABLE users (
    id                  BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    name                VARCHAR(150) NOT NULL,
    email               VARCHAR(190) NOT NULL UNIQUE,
    email_verified_at   TIMESTAMP NULL,
    password            VARCHAR(255) NOT NULL,
    role_id             BIGINT UNSIGNED NOT NULL DEFAULT 3,  -- 1=admin,2=editor,3=user
    avatar_path         VARCHAR(255) NULL,
    storage_quota_mb    INT UNSIGNED NOT NULL DEFAULT 2048,
    storage_used_bytes  BIGINT UNSIGNED NOT NULL DEFAULT 0,
    is_active           TINYINT(1) NOT NULL DEFAULT 1,
    last_login_at       TIMESTAMP NULL,
    remember_token      VARCHAR(100) NULL,
    created_at          TIMESTAMP NULL,
    updated_at          TIMESTAMP NULL,
    deleted_at          TIMESTAMP NULL,
    CONSTRAINT fk_users_role FOREIGN KEY (role_id) REFERENCES roles(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE password_reset_tokens (
    email       VARCHAR(190) PRIMARY KEY,
    token       VARCHAR(255) NOT NULL,
    created_at  TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE personal_access_tokens (   -- Sanctum
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    tokenable_type  VARCHAR(150) NOT NULL,
    tokenable_id    BIGINT UNSIGNED NOT NULL,
    name            VARCHAR(150) NOT NULL,
    token           VARCHAR(64) NOT NULL UNIQUE,
    abilities       TEXT NULL,
    last_used_at    TIMESTAMP NULL,
    expires_at      TIMESTAMP NULL,
    created_at      TIMESTAMP NULL,
    updated_at      TIMESTAMP NULL,
    INDEX idx_pat_tokenable (tokenable_type, tokenable_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE sessions (
    id              VARCHAR(255) PRIMARY KEY,
    user_id         BIGINT UNSIGNED NULL,
    ip_address      VARCHAR(45) NULL,
    user_agent      TEXT NULL,
    payload         LONGTEXT NOT NULL,
    last_activity   INT NOT NULL,
    INDEX idx_sessions_user (user_id),
    INDEX idx_sessions_last_activity (last_activity)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- folders (project organization, nested)
-- ---------------------------------------------------------------------
CREATE TABLE folders (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NOT NULL,
    parent_id   BIGINT UNSIGNED NULL,
    name        VARCHAR(150) NOT NULL,
    created_at  TIMESTAMP NULL,
    updated_at  TIMESTAMP NULL,
    deleted_at  TIMESTAMP NULL,
    CONSTRAINT fk_folders_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_folders_parent FOREIGN KEY (parent_id) REFERENCES folders(id) ON DELETE CASCADE,
    INDEX idx_folders_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- projects (an editing workspace/document, can contain multiple images)
-- ---------------------------------------------------------------------
CREATE TABLE projects (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    folder_id       BIGINT UNSIGNED NULL,
    title           VARCHAR(200) NOT NULL,
    canvas_width    INT UNSIGNED NOT NULL DEFAULT 1920,
    canvas_height   INT UNSIGNED NOT NULL DEFAULT 1080,
    background_color VARCHAR(20) NOT NULL DEFAULT '#ffffff',
    thumbnail_path  VARCHAR(255) NULL,
    is_template     TINYINT(1) NOT NULL DEFAULT 0,
    last_opened_at  TIMESTAMP NULL,
    created_at      TIMESTAMP NULL,
    updated_at      TIMESTAMP NULL,
    deleted_at      TIMESTAMP NULL,
    CONSTRAINT fk_projects_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_projects_folder FOREIGN KEY (folder_id) REFERENCES folders(id) ON DELETE SET NULL,
    INDEX idx_projects_user (user_id),
    INDEX idx_projects_folder (folder_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- image_assets (uploaded / source images, immutable originals)
-- ---------------------------------------------------------------------
CREATE TABLE image_assets (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    project_id      BIGINT UNSIGNED NULL,
    original_name   VARCHAR(255) NOT NULL,
    disk            VARCHAR(50) NOT NULL DEFAULT 'public',
    original_path   VARCHAR(255) NOT NULL,
    thumbnail_path  VARCHAR(255) NULL,
    mime_type       VARCHAR(100) NOT NULL,
    width           INT UNSIGNED NULL,
    height          INT UNSIGNED NULL,
    size_bytes      BIGINT UNSIGNED NOT NULL DEFAULT 0,
    status          ENUM('uploading','processing','ready','failed') NOT NULL DEFAULT 'uploading',
    checksum_sha256 VARCHAR(64) NULL,
    created_at      TIMESTAMP NULL,
    updated_at      TIMESTAMP NULL,
    deleted_at      TIMESTAMP NULL,
    CONSTRAINT fk_assets_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_assets_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_assets_user (user_id),
    INDEX idx_assets_project (project_id),
    INDEX idx_assets_checksum (checksum_sha256)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- layers (non-destructive scene graph entries within a project)
-- ---------------------------------------------------------------------
CREATE TABLE layers (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id      BIGINT UNSIGNED NOT NULL,
    image_asset_id  BIGINT UNSIGNED NULL,         -- null for text/shape layers
    type            ENUM('image','text','shape','group') NOT NULL DEFAULT 'image',
    name            VARCHAR(150) NOT NULL DEFAULT 'Layer',
    z_index         INT NOT NULL DEFAULT 0,
    is_visible      TINYINT(1) NOT NULL DEFAULT 1,
    is_locked       TINYINT(1) NOT NULL DEFAULT 0,
    opacity         DECIMAL(4,3) NOT NULL DEFAULT 1.000,
    transform_json  JSON NOT NULL,                -- {x,y,scaleX,scaleY,rotation,skewX,skewY}
    style_json      JSON NULL,                    -- fill, stroke, filters, font props, etc.
    fabric_object_json JSON NULL,                 -- raw Fabric.js/Konva serialized object
    created_at      TIMESTAMP NULL,
    updated_at      TIMESTAMP NULL,
    CONSTRAINT fk_layers_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_layers_asset FOREIGN KEY (image_asset_id) REFERENCES image_assets(id) ON DELETE SET NULL,
    INDEX idx_layers_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- project_versions (undo/redo + history snapshots, capped & pruned)
-- ---------------------------------------------------------------------
CREATE TABLE project_versions (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id      BIGINT UNSIGNED NOT NULL,
    snapshot_json   JSON NOT NULL,                -- full layer tree snapshot
    label           VARCHAR(150) NULL,
    created_at      TIMESTAMP NULL,
    CONSTRAINT fk_versions_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    INDEX idx_versions_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- ai_jobs (tracks async AI operations: bg-removal, upscale, enhance)
-- ---------------------------------------------------------------------
CREATE TABLE ai_jobs (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id         BIGINT UNSIGNED NOT NULL,
    image_asset_id  BIGINT UNSIGNED NOT NULL,
    type            ENUM('bg_removal','upscale','auto_enhance') NOT NULL,
    status          ENUM('queued','processing','completed','failed') NOT NULL DEFAULT 'queued',
    params_json     JSON NULL,
    result_path     VARCHAR(255) NULL,
    error_message   TEXT NULL,
    started_at      TIMESTAMP NULL,
    completed_at    TIMESTAMP NULL,
    created_at      TIMESTAMP NULL,
    updated_at      TIMESTAMP NULL,
    CONSTRAINT fk_aijobs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_aijobs_asset FOREIGN KEY (image_asset_id) REFERENCES image_assets(id) ON DELETE CASCADE,
    INDEX idx_aijobs_user (user_id),
    INDEX idx_aijobs_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- exports (rendered final output files)
-- ---------------------------------------------------------------------
CREATE TABLE exports (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    project_id      BIGINT UNSIGNED NOT NULL,
    user_id         BIGINT UNSIGNED NOT NULL,
    format          ENUM('png','jpg','webp','pdf','svg') NOT NULL DEFAULT 'png',
    quality         TINYINT UNSIGNED NOT NULL DEFAULT 90,
    width           INT UNSIGNED NULL,
    height          INT UNSIGNED NULL,
    file_path       VARCHAR(255) NULL,
    size_bytes      BIGINT UNSIGNED NULL,
    status          ENUM('queued','processing','completed','failed') NOT NULL DEFAULT 'queued',
    error_message   TEXT NULL,
    created_at      TIMESTAMP NULL,
    updated_at      TIMESTAMP NULL,
    CONSTRAINT fk_exports_project FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE,
    CONSTRAINT fk_exports_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_exports_project (project_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- settings (key/value app + admin configurable settings)
-- ---------------------------------------------------------------------
CREATE TABLE settings (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    `key`       VARCHAR(150) NOT NULL UNIQUE,
    `value`     TEXT NULL,
    type        ENUM('string','integer','boolean','json') NOT NULL DEFAULT 'string',
    created_at  TIMESTAMP NULL,
    updated_at  TIMESTAMP NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- activity_logs (audit trail, used by admin panel)
-- ---------------------------------------------------------------------
CREATE TABLE activity_logs (
    id          BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    user_id     BIGINT UNSIGNED NULL,
    action      VARCHAR(150) NOT NULL,
    description TEXT NULL,
    ip_address  VARCHAR(45) NULL,
    meta_json   JSON NULL,
    created_at  TIMESTAMP NULL,
    CONSTRAINT fk_logs_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_logs_user (user_id),
    INDEX idx_logs_action (action)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- queue tables (database queue fallback / failed_jobs always needed)
-- ---------------------------------------------------------------------
CREATE TABLE jobs (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    queue           VARCHAR(150) NOT NULL,
    payload         LONGTEXT NOT NULL,
    attempts        TINYINT UNSIGNED NOT NULL,
    reserved_at     INT UNSIGNED NULL,
    available_at    INT UNSIGNED NOT NULL,
    created_at      INT UNSIGNED NOT NULL,
    INDEX idx_jobs_queue (queue)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE failed_jobs (
    id              BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    uuid            VARCHAR(36) NOT NULL UNIQUE,
    connection      TEXT NOT NULL,
    queue           TEXT NOT NULL,
    payload         LONGTEXT NOT NULL,
    exception       LONGTEXT NOT NULL,
    failed_at       TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE cache (
    `key`       VARCHAR(255) PRIMARY KEY,
    `value`     MEDIUMTEXT NOT NULL,
    expiration  INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE cache_locks (
    `key`       VARCHAR(255) PRIMARY KEY,
    owner       VARCHAR(255) NOT NULL,
    expiration  INT NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- ---------------------------------------------------------------------
-- seed default roles & permissions
-- ---------------------------------------------------------------------
INSERT INTO roles (id, name, label, created_at, updated_at) VALUES
 (1, 'admin', 'Administrator', NOW(), NOW()),
 (2, 'editor', 'Editor', NOW(), NOW()),
 (3, 'user', 'User', NOW(), NOW());

SET FOREIGN_KEY_CHECKS = 1;
