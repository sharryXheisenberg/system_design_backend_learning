# Secure Passwords Project: From Insecure to Secure Storage

## Introduction
This Node.js project demonstrates password storage techniques, from completely insecure (plain text) to secure (bcrypt with salting and peppering). It's a backend-focused learning tool using SQLite for simplicity—no external DB server needed.

**Goal**: Understand why "hashing" isn't enough and how attackers breach weak systems. Based on [this article](https://substack.com/home/post/p-173209451), we progress step-by-step. Run `npm install && npm start` to see it in action: It registers sample users, tests logins, and "breaches" the DB by dumping it.

**Why Learn This?**
- 80% of breaches involve stolen creds (Verizon DBIR 2023).
- Plain text? Instant compromise.
- Fast hashes (MD5)? Cracked in seconds with tools.
- Secure: Slow, salted, peppered—takes years to crack even with GPUs.

**Project Structure**:
- `db.js`: SQLite setup and queries.
- `auth.js`: Register/login with method switching.
- `index.js`: Demo runner.
- `.env`: Secrets (e.g., pepper—never commit!).
- `passwords.db`: Generated (inspect with DB Browser for SQLite).

**Prerequisites**: Node.js 18+, npm. No frontend—pure backend.

## Techniques Overview
We store passwords in a `users` table:

| Column    | Type | Description                  |
|-----------|------|------------------------------|
| id       | INTEGER | Auto-increment PK           |
| username | TEXT | Unique username             |
| password | TEXT | Plain or hashed value       |
| method   | TEXT | 'plain', 'md5', 'sha256', 'bcrypt_peppered' |

Progression table (insecure → secure):

| Stage | Method              | Stored Example (for 'Pa$$w0rd123') | Why Insecure? | Breach Simulation | Fix |
|-------|---------------------|------------------------------------|---------------|-------------------|-----|
| 1     | Plain Text         | `Pa$$w0rd123`                     | DB dump reveals all. No protection. | `SELECT * FROM users;` → Passwords visible! | Hash it (one-way). |
| 2     | MD5 (Fast Hash)    | `482c811da5d5b4bc6d497ffa98491e38` | Rainbow tables (precomputed DBs) crack in <1s. Same pw → same hash. | Google the hash → "Pa$$w0rd123". | Use slow hash (e.g., bcrypt). |
| 3     | SHA-256 (Fast Hash)| `e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855` (empty, but similar) | Brute-force: GPUs do billions/sec. No salt. | Hashcat tool: Cracks in minutes. | Add unique salt per user. |
| 4     | Bcrypt (Slow + Salt)| `$2b$12$randomsalt...hashedvalue` | Salt in DB—offline attack possible if DB stolen. | Extract salt, brute-force (still slow, but no pepper). | Add pepper (app secret). |
| 5     | Bcrypt + Pepper    | Same as above (but input: pw + pepper) | Most secure here. Needs both DB + server access to crack. | Impossible without pepper (env-only). Years on GPU. | Delegate: Use OAuth (Google/Auth0)—no pw storage! |

*Notes*: Bcrypt auto-generates unique salt per hash (why Alice/Eve hashes differ despite same pw). Pepper is concatenated pre-hash (env secret, not in DB).

## Code Walkthrough
### db.js
Handles SQLite: Creates table, inserts/gets users. Async for Node best practices.

Key Snippet (Table Creation):
```javascript
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  method TEXT NOT NULL
)`);