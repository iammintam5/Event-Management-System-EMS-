# Gateway REST API

Base URL local: http://localhost:3001/api. Swagger UI: /api/docs; OpenAPI JSON: /api/docs-json.

## GET /health

HTTP 200:

```json
{
  "success": true,
  "data": {
    "gateway": "up",
    "broker": "up",
    "services": {
      "identity": "up",
      "event": "up",
      "registration": "up",
      "operations": "up",
      "reporting": "up"
    }
  }
}
```

HTTP 503 khi một thành phần down:

```json
{
  "success": false,
  "message": "One or more platform components are unavailable",
  "error": "Service Unavailable",
  "statusCode": 503,
  "data": {
    "gateway": "up",
    "broker": "up",
    "services": {
      "identity": "up",
      "event": "down",
      "registration": "up",
      "operations": "up",
      "reporting": "up"
    }
  }
}
```

Gateway gửi cả năm requests song song với HEALTH_TIMEOUT_MS (mặc định 2000 ms). Broker trạng thái từ NATS status stream; không suy ra broker down chỉ vì không có service responder. Response không chứa database connection strings, exception nội bộ hoặc credentials.

Health là process/communication liveness. Dùng pnpm db:check để kiểm tra PostgreSQL riêng.

## Error envelope

```json
{ "success": false, "message": ["Invalid field"], "error": "Bad Request", "statusCode": 400 }
```

ValidationPipe bật whitelist, transform, forbidNonWhitelisted. Lỗi chưa phân loại trả 500 với thông báo chung; lỗi không trả 200. Không có fake CRUD endpoints. Authentication/RBAC sẽ được triển khai ở Phase 1; Swagger Bearer scheme hiện chỉ là foundation.
