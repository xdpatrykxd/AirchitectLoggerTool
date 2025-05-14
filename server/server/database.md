```sql
-- Start PostgreSQL
brew services start postgresql@17

-- Connect to postgres database
psql postgres

-- Create database
CREATE DATABASE ATLASCOPCO;

-- Create user and set password
CREATE USER admin WITH PASSWORD 'admin';

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE ATLASCOPCO TO admin;

-- Optional: Grant schema privileges
\c ATLASCOPCO
GRANT ALL ON SCHEMA public TO admin;
```

Praktische stappen voor medestudenten:
1. Installeer Homebrew + PostgreSQL
2. Start PostgreSQL met `brew services start postgresql@17`
3. Kopieer bovenstaande commands
4. Vervang `databasename`, `username` en `password` met gewenste waardes

Voor nieuw database gebruik:
```bash
psql -U username -d databasename
```