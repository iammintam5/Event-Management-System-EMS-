import assert from 'node:assert/strict';

async function smoke() {
  const apiUrl = process.env.SMOKE_API_URL;
  const webUrl = process.env.SMOKE_WEB_URL;
  if (!apiUrl || !webUrl)
    throw new Error('Set SMOKE_API_URL and SMOKE_WEB_URL in root .env (pnpm setup:env).');
  const response = await fetch(`${apiUrl.replace(/\/$/, '')}/health`, {
    signal: AbortSignal.timeout(15000),
  });
  const health = await response.json();
  assert.equal(
    response.status,
    200,
    `Gateway health returned ${response.status}; start NATS and all five services.`,
  );
  assert.equal(health.success, true);
  assert.equal(health.data.gateway, 'up');
  assert.equal(health.data.broker, 'up');
  const services = ['identity', 'event', 'registration', 'operations', 'reporting'];
  assert.deepEqual(Object.keys(health.data.services).sort(), [...services].sort());
  for (const service of services)
    assert.equal(health.data.services[service], 'up', `${service} is unavailable`);
  const docs = await fetch(`${apiUrl.replace(/\/$/, '')}/docs-json`, {
    signal: AbortSignal.timeout(10000),
  });
  assert.equal(docs.status, 200, 'Swagger JSON must be available');
  const spec = await docs.json();
  assert.equal(spec.info.title, 'Event Management System API');
  assert.ok(spec.paths['/api/health'], 'Swagger must document health');
  const page = await fetch(webUrl, { signal: AbortSignal.timeout(30000) });
  assert.equal(page.status, 200, 'Web must respond');
  assert.match(await page.text(), /Event Management System/);
  console.log('PASS: Web, Swagger, Gateway → NATS → all five service responders.');
  console.log('Database connectivity is separate: run pnpm db:check after configuring Supabase.');
}
void smoke().catch((error) => {
  console.error(`Smoke failed: ${error.message}`);
  process.exitCode = 1;
});
