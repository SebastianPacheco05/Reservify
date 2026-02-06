/*
 * Migración: tabla jwt_tokens con refresh_token y refresh_expires_at.
 * Una fila por sesión (token = access, refresh_token = refresh).
 * Ejecutar si ya tenías jwt_tokens sin estas columnas.
 * NOTA: Al recrear la tabla, todas las sesiones actuales se invalidan (los usuarios deben volver a iniciar sesión).
 */

DROP TABLE IF EXISTS "jwt_tokens";

CREATE TABLE "jwt_tokens" (
    id SERIAL PRIMARY KEY NOT NULL,
    id_credencial INT NOT NULL,
    token TEXT NOT NULL,
    refresh_token TEXT NOT NULL UNIQUE,
    issued_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NOT NULL,
    refresh_expires_at TIMESTAMP NOT NULL,
    revoked BOOLEAN NOT NULL DEFAULT FALSE,
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW(),
    FOREIGN KEY (id_credencial) REFERENCES "Credenciales" (id_credencial) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_jwt_tokens_refresh_token ON "jwt_tokens" (refresh_token);
