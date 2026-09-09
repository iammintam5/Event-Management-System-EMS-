import assert from 'node:assert/strict';

const api = process.env.SMOKE_API_URL || 'http://localhost:3001';
const web = process.env.SMOKE_WEB_URL || 'http://localhost:3000';
const get = (url) => fetch(url, { signal: AbortSignal.timeout(30000) });
const health = await get(`${api}/api/health`);
assert.equal(health.status, 200);
const body = await health.json();
assert.equal(body.success, true);
assert.equal(body.data.database, 'up');
const docs = await get(`${api}/api/docs`);
assert.equal(docs.status, 200);
assert.match(await docs.text(), /swagger-ui/i);
const openapi = await (await get(`${api}/api/docs-json`)).json();
assert.ok(openapi.paths['/api/health']);
const missing = await get(`${api}/api/does-not-exist`);
assert.equal(missing.status, 404);
assert.equal((await missing.json()).success, false);
const cors = await fetch(`${api}/api/health`, {
  headers: { Origin: web },
  signal: AbortSignal.timeout(30000),
});
assert.equal(cors.headers.get('access-control-allow-origin'), web);
const homepage = await get(web);
assert.equal(homepage.status, 200);
assert.match(await homepage.text(), /Event Management System/);
console.log(
  'PASS: web, API, PostgreSQL through Prisma, Swagger, error format and CORS.',
);
