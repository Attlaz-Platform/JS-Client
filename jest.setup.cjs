// Load a local .env into process.env for tests that need it (the e2e specs read config via
// process.env). Uses Node's built-in loader (process.loadEnvFile, Node 20.12+) — no dotenv
// dependency. No-ops when there is no .env, so unit-only runs and CI work without one.
try {
    process.loadEnvFile();
} catch {
    // No .env present — expected for unit-only / CI runs.
}
