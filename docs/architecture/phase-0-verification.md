# Phase 0 verification

Ngày kiểm tra: **2026-09-13**. Môi trường: Windows PowerShell, Node.js 22.20.0, pnpm 10.18.2.

**Trạng thái: foundation đã được triển khai và các kiểm tra nội bộ pass; chưa xác nhận hoàn tất Phase 0 vì thiếu cấu hình Supabase và NATS runtime.**

## Kết quả thực tế

| Kiểm tra                                    | Kết quả       | Bằng chứng/phạm vi                                                                                     |
| ------------------------------------------- | ------------- | ------------------------------------------------------------------------------------------------------ |
| pnpm install                                | PASS          | 10 workspace projects; đã cập nhật pnpm-lock.yaml                                                      |
| pnpm db:validate                            | PASS          | Prisma CLI validate cả 5 schemas                                                                       |
| pnpm db:generate                            | PASS          | Generate 5 Prisma Clients riêng với Prisma stable 7.10.0; không có business model                      |
| pnpm typecheck                              | PASS          | Tất cả packages/apps/services; kiểm tra lại sau sửa startup/HTTP configuration                         |
| pnpm lint                                   | PASS          | Không lỗi hoặc cảnh báo trong lần kiểm tra cuối                                                        |
| pnpm test                                   | PASS          | 9 suites, 34 tests; gồm timeout, service down, config, HTTP 400/404, CORS, Swagger                     |
| pnpm build                                  | PASS          | Production build Web, Gateway, 5 services và 2 packages; backend được build lại sau chỉnh startup/HTTP |
| Web HTTP                                    | PASS          | Chạy production server, GET / trả 200 và có bốn capability cards                                       |
| Gateway HTTP                                | PASS          | Khởi động bản build thật trên port 3001                                                                |
| Swagger                                     | PASS          | UI và OpenAPI JSON trả 200, có /api/health                                                             |
| Gateway khi broker down                     | PASS          | HTTP 503, gateway up, broker down, đủ 5 service down; Gateway tiếp tục phản hồi                        |
| REST errors                                 | PASS          | Route API không tồn tại trả JSON 404; malformed JSON trả JSON 400                                      |
| Frontend CORS                               | PASS          | Origin được cấu hình nhận Access-Control-Allow-Origin phù hợp                                          |
| pnpm smoke                                  | CHƯA PASS     | Đã chạy, thất bại vì Gateway health trả HTTP 503; chưa có NATS/service responders                      |
| pnpm db:check                               | CHƯA PASS     | Đã chạy, bị chặn trước khi kết nối vì DATABASE_URL/DIRECT_URL chưa được cấu hình                       |
| 5 PostgreSQL schemas trên Supabase          | CHƯA XÁC MINH | Có SQL bootstrap và hướng dẫn grants; chưa chạy trên project thật                                      |
| 5 business services chạy liên tục           | CHƯA XÁC MINH | Build/typecheck và controller tests pass; startup bị chặn đúng bởi env validation                      |
| NATS request/reply thực tế với đủ 5 service | CHƯA XÁC MINH | NATS server không có trong PATH và không lắng nghe cổng 4222 khi kiểm tra                              |

Health hiện là communication/liveness, không bao gồm database readiness. Test HTTP dùng health provider thay thế để kiểm tra lớp HTTP; không được tính là bằng chứng NATS integration hoặc kết nối database thật.

## Cấu hình còn thiếu

Các file services/*/.env đã được tạo từ example và giữ trống:

- DATABASE_URL và DIRECT_URL cho cả 5 service.
- JWT_ACCESS_SECRET và JWT_REFRESH_SECRET cho Identity.

Không tạo connection string hoặc secret giả. Không kết nối hoặc thay đổi Supabase từ phiên làm việc này. Không khẳng định database grants isolation đã được kiểm chứng trên server.

## Cách hoàn tất kiểm chứng

1. Lấy connection strings thật trong Supabase Connect; provision role/grants theo [Supabase setup](../database/supabase-setup.md).
2. Chạy scripts/create-schemas.sql trong Supabase SQL Editor.
3. Điền services/<name>-service/.env; đặt hai JWT secrets khác nhau, tối thiểu 32 ký tự cho Identity.
4. Cài native nats-server và chạy trong terminal riêng:

```sh
nats-server -a 127.0.0.1 -p 4222
```

5. Tại root repository:

```sh
pnpm db:validate
pnpm db:generate
pnpm build
pnpm db:check
pnpm dev
```

6. Giữ pnpm dev chạy, mở terminal khác:

```sh
pnpm smoke
```

Trên PowerShell bị chặn execution policy, dùng pnpm.cmd. Chỉ đánh dấu Phase 0 hoàn tất sau khi smoke trả PASS và các kết nối/database ownership thực tế được kiểm chứng.

## Giới hạn có chủ ý

Không có bảng nghiệp vụ, CRUD, auth business, cross-service DB access, Docker hoặc các future extensions. JWT hiện chỉ là signing/verification configuration. Các bước triển khai Supabase, domain models, domain events và deployment chưa được thực hiện.
