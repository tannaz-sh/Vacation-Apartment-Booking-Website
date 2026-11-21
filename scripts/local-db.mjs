import EmbeddedPostgres from 'embedded-postgres';
import { mkdir, readFile, writeFile, access } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import path from 'node:path';

const root = path.resolve('.local');
await mkdir(root, { recursive: true });
const settingsPath = path.join(root, 'postgres-settings.json');
let settings;
try { settings = JSON.parse(await readFile(settingsPath, 'utf8')); }
catch (error) {
  if (error.code !== 'ENOENT') throw error;
  settings = { port: 54329, password: randomBytes(32).toString('hex'), appPassword: randomBytes(32).toString('hex') };
  await writeFile(settingsPath, JSON.stringify(settings), { flag: 'wx', mode: 0o600 });
}
const databaseDir = path.join(root, 'postgres');
const server = new EmbeddedPostgres({ databaseDir, user: 'postgres', password: settings.password,
  port: settings.port, persistent: true, authMethod: 'scram-sha-256',
  postgresFlags: ['-h', '127.0.0.1'], initdbFlags: ['--encoding=UTF8', '--locale=C'],
  autoRehydrateSymlinks: true, onLog: () => {}, onError: () => {},
});
try { await access(path.join(databaseDir, 'PG_VERSION')); }
catch { await server.initialise(); }
await server.start();
const client = server.getPgClient('postgres', '127.0.0.1');
await client.connect();
if (!(await client.query("SELECT 1 FROM pg_roles WHERE rolname = 'rf_app'")).rowCount) {
  // Generated hexadecimal password, never external SQL input.
  await client.query(`CREATE ROLE rf_app LOGIN PASSWORD '${settings.appPassword}' NOSUPERUSER NOCREATEDB NOCREATEROLE`);
}
for (const database of ['rf_sauerland', 'rf_sauerland_test']) {
  if (!(await client.query('SELECT 1 FROM pg_database WHERE datname = $1', [database])).rowCount) {
    await client.query(`CREATE DATABASE ${database} OWNER rf_app`);
  }
}
await client.end();
try {
  await writeFile('.env.local', `DATABASE_URL=postgresql://rf_app:${settings.appPassword}@127.0.0.1:${settings.port}/rf_sauerland\nPAYLOAD_SECRET=${randomBytes(48).toString('hex')}\nSITE_URL=http://127.0.0.1:3000\nPAYLOAD_DB_PUSH=true\nSMOOBU_BOOKING_URL=https://booking.smoobu.com/9A1947006\nSMOOBU_BOOKING_HOST=booking.smoobu.com\nSMOOBU_APARTMENT_NEUASTENBERG=3587886\nSMOOBU_APARTMENT_SILBACH=3587887\n`, { flag: 'wx', mode: 0o600 });
} catch (error) { if (error.code !== 'EEXIST') throw error; }
console.log(`PostgreSQL ready on 127.0.0.1:${settings.port}. Data persists in .local/postgres. Keep this terminal open.`);
let stopping = false;
async function stop() { if (stopping) return; stopping = true; await server.stop(); process.exit(0); }
process.on('SIGINT', stop); process.on('SIGTERM', stop);
setInterval(() => {}, 60_000);
