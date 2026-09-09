# API conventions

- Base URL: `http://localhost:3001/api`
- Swagger UI: `http://localhost:3001/api/docs`
- OpenAPI JSON: `http://localhost:3001/api/docs-json`
- `GET /health`: readiness, runs a PostgreSQL query through Prisma.
- Success: `{ "success": true, "data": { "status": "ok", "database": "up", "timestamp": "ISO-8601" } }`
- Database unavailable: HTTP 503; `{ "success": false, "error": { "statusCode": 503, "message": "Database unavailable", "path": "/api/health" } }`.
- Unhandled failures: HTTP 500 with a generic message; database details are not returned.
- DTO validation: global whitelist, transform and forbidNonWhitelisted.
- CORS: configured frontend origin only. Authentication is Phase 1.
- Future paginated lists: `{ success: true, data: [], meta: { page, limit, total, totalPages } }`.

Health does not claim Redis connectivity; inspect its Docker healthcheck or run
`docker compose exec -T redis redis-cli ping`.
