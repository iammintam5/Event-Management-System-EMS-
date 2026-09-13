# Architecture overview

Web → Gateway → NATS → Identity / Event / Registration / Operations / Reporting → Supabase PostgreSQL theo schema riêng.

## Runtime boundaries

- **Web**: App Router, query provider, REST client, Zod response validation, form foundation, capability overview. Chỉ nhận public API URL; không dùng NATS, Prisma hay Supabase SDK.
- **Gateway**: public HTTP, Swagger, CORS, DTO validation, exception mapping, health aggregation. Authn/authz entry point sẽ được triển khai ở Phase Identity.
- **Business services**: mỗi process là một NestJS NATS microservice; health responder và Prisma provider riêng. Không có HTTP server.
- **Contracts**: subject constants và message response types; không chia sẻ implementation.
- **Shared**: generic API envelopes và environment primitives, không chứa domain/service/database code.
- **Database**: một Supabase database, năm schema độc lập. Credential/grants riêng mới là enforcement ở database level; Prisma datasource alone không phải security boundary.

## Health behavior

Gateway dùng ClientProxy.send, chạy requests song song, timeout riêng. Status stream của NATS client phản ánh broker connected/disconnected/reconnecting. Một responder chết không kéo Gateway chết. Sai service identity trong reply cũng bị đánh dấu down.

Health endpoint đo communication/liveness. Prisma dùng lazy connection; db:check là kiểm chứng database thực tế riêng. Không đưa trạng thái database chưa được query vào trường up.

## Dependency direction

Apps/services chỉ import public package exports. Web không import NATS contracts. Gateway không import Prisma. Không import source của service khác, không cross-schema FK hoặc SQL JOIN. UUID liên service chỉ là dữ liệu định danh.

## Build and operations

Shared packages được build trước dependents. Prisma generate nằm trong build/typecheck orchestration. Mỗi service có package scripts riêng để triển khai độc lập về sau. pnpm dev chạy các watcher, mỗi backend hỗ trợ shutdown hooks.

NATS Core request/reply đủ cho Phase 0. Không đưa durable event processing hoặc infrastructure bổ sung vào giai đoạn này. Database schema bootstrap là thao tác rõ ràng do developer thực hiện, không tự chạy lúc app boot.

JWT foundation chỉ cấu hình Access Token signing/verification tại Identity và Bearer scheme ở Swagger. Chưa có auth endpoints, guard hoặc tuyên bố RBAC đã bảo vệ routes.
