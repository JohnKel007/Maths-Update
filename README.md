# Maths Practice — Grade 8 (Phase A)

Student-facing web app for a single Grade 8 Maths cohort to practise Cambridge
Phase A objectives at their assigned edition, with a teacher view for cohort
progress.

This repository is currently at the end of **Phase 1** of the build sequence
described in the project brief. Only login, sessions, and placeholder
dashboards exist — no questions, no progress views yet.

## Stack

- Remix (Vite) + React 18 + TypeScript
- Tailwind CSS
- SQLite via `better-sqlite3`, single file on disk
- `bcryptjs` for password hashing
- Signed cookie sessions (`@remix-run/node`)
- `vitest` for tests

Deploys as a single Node process. No vendor-specific runtime APIs.

## First run

```bash
npm install
cp .env.example .env       # edit SESSION_SECRET to a long random string
npm run dev
```

On first start the server creates `./data/app.db`, applies the schema, and
seeds **one teacher** and **three test students** with randomly-generated
passwords printed to the server console. Example:

```
========================================================================
FIRST-RUN SEED — save these credentials now. They are not stored anywhere else.

Teacher:
  username: teacher
  password: Kx7p...            (16 chars)

Test students:
  username: ana.g      password: 8Qm...   (edition 1 / Basic)
  username: luis.r     password: 4Rn...   (edition 2 / Competent)
  username: maria.s    password: 2Vt...   (edition 3 / Mastery)
========================================================================
```

**Save these credentials immediately.** They are only printed once. If you
lose them, delete `./data/app.db` and restart — the seed runs again on any
empty database.

Then visit `http://localhost:3000/login`.

## Commands

```bash
npm run dev         # dev server on :3000
npm run build       # production build
npm run start       # run the built server
npm run typecheck   # tsc --noEmit
npm test            # vitest
```

## Data

- Database file: `./data/app.db` (path configurable via `DATABASE_PATH`).
- Backups: stop the server, copy the `.db` file.
- The schema lives in `app/db/migrations/`. Migrations are applied on boot.

## Phase 1 verification

- [x] App starts from a clean database without error (runs migrations, seeds).
- [x] App starts from an already-populated database without re-seeding.
- [x] Student UI shows "Edition 1 / 2 / 3" — never the internal level name.
- [x] Login with wrong credentials returns a single generic error; passwords
      are stored hashed (bcrypt).
- [x] `/student` and `/teacher` redirect to `/login` when unauthenticated,
      and redirect cross-role users to their own dashboard.

Phases 2–6 are described in the project brief.
