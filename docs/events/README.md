# Messaging contracts

## Phase 0: health request/reply

| Subject             | Responder    |
| ------------------- | ------------ |
| identity.health     | Identity     |
| event.health        | Event        |
| registration.health | Registration |
| operations.health   | Operations   |
| reporting.health    | Reporting    |

Request payload: {}. Reply: { service: "<context>", status: "up" }. Constants/types nằm trong @ems/contracts. Gateway dùng ClientProxy, microservices dùng @MessagePattern, queue group theo service để mỗi request được một instance xử lý.

## Domain events — kế hoạch các phase sau

Chưa có publisher, consumer hoặc business handlers trong Phase 0.

Các sự kiện dự kiến: event.created, event.published, session.created; registration.created, ticket.issued, checkin.completed; staff.assigned, task.completed, equipment.assigned, sponsor.assigned.

Reporting sẽ nhận sự kiện để xây read models của chính mình. Trước khi triển khai cần xác định versioned envelope, event ID, timestamp, idempotency, ordering, retry và replay strategy. NATS Core hiện dùng request/reply và không tự cung cấp durable delivery; chưa tuyên bố reporting eventual consistency đã được giải quyết.
