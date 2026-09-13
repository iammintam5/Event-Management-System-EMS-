# Supabase PostgreSQL setup

## 1. Project và schema

Tạo một Supabase project. Sử dụng PostgreSQL managed, chưa dùng Supabase Auth, Realtime, Edge Functions. Mở SQL Editor và chạy [create-schemas.sql](../../scripts/create-schemas.sql).

Script chỉ tạo năm schema: identity, event, registration, operations, reporting. Không tạo business tables. Không expose các schema này qua Data API; dự án chỉ truy cập thông qua Prisma backend.

## 2. Credentials và phân quyền

Mỗi service cần role PostgreSQL riêng cho runtime và quyền migration theo schema sở hữu. Tạo password ngoài source control. Không dùng chung postgres/admin credentials cho năm service.

Prisma schemas = ["identity"] chỉ giới hạn model/migration scope; nó không ngăn raw SQL của một role có quyền rộng. Grants là bắt buộc để enforce isolation:

- Runtime role: LOGIN, CONNECT vào database, USAGE trên đúng một schema, SELECT/INSERT/UPDATE/DELETE trên các bảng thuộc schema đó và quyền sequence cần thiết.
- Migration role: CREATE trong đúng schema và ownership của objects do migration tạo; không cấp quyền vào các schema service khác.
- Với objects trong tương lai, cấu hình ALTER DEFAULT PRIVILEGES **FOR ROLE migration-role IN SCHEMA owned-schema** cho runtime role. Default grants của postgres không áp dụng cho bảng được tạo bởi role khác.
- Không cấp superuser/BYPASSRLS/CREATEDB cho runtime. Không cấp quyền thông qua role membership rộng.
- Kiểm tra quyền PUBLIC và inherited grants trước khi kết luận đã cách ly. Không thay đổi quyền trên schema hệ thống Supabase một cách hàng loạt.

Ví dụ hướng dẫn cho Identity, thay các tên role bằng role đã provision trong project; đoạn SQL này không tạo password hoặc business tables:

```sql
GRANT USAGE ON SCHEMA identity TO ems_identity_runtime;
GRANT USAGE, CREATE ON SCHEMA identity TO ems_identity_migrator;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA identity TO ems_identity_runtime;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA identity TO ems_identity_runtime;
ALTER DEFAULT PRIVILEGES FOR ROLE ems_identity_migrator IN SCHEMA identity
  GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO ems_identity_runtime;
ALTER DEFAULT PRIVILEGES FOR ROLE ems_identity_migrator IN SCHEMA identity
  GRANT USAGE, SELECT ON SEQUENCES TO ems_identity_runtime;
```

Lặp lại đúng mapping cho Event, Registration, Operations, Reporting. Không cấp tất cả schemas cho một role. Ownership schema, migration grants và việc Supabase dashboard nhìn được objects cần được quản trị project kiểm tra theo chính sách của project.

## 3. Kết nối

Lấy URLs từ **Supabase Connect**, không tự đoán host/project ref/region/password:

- DATABASE_URL: runtime connection với đúng runtime role. Với các backend process chạy lâu, session pooler hoặc direct connection là lựa chọn phù hợp theo khả năng mạng.
- DIRECT_URL: direct PostgreSQL với migration role; nếu direct endpoint chỉ hỗ trợ IPv6 nhưng máy dùng IPv4, dùng session pooler phù hợp. Không dùng transaction pooler cho migration.
- Giữ TLS verification. Không đặt rejectUnauthorized: false để chữa lỗi kết nối.
- Nếu password có ký tự đặc biệt, đảm bảo URL được percent-encode đúng; không in URL ra log.
- Schema query parameter nếu có phải đúng ownership. CLI bổ sung owned schema cho migration; runtime adapter cố định schema.

Điền hai URL vào services/<name>-service/.env. Với Identity, điền thêm hai JWT secrets khác nhau, tối thiểu 32 ký tự. Không commit .env.

## 4. Prisma 7

Mỗi service có schema.prisma, prisma.config.ts, migrations và src/generated/prisma riêng. Generator prisma-client hỗ trợ CJS cho build NestJS. datasource schema chỉ có provider và schemas; URL nằm trong Prisma Config/driver adapter.

```sh
pnpm db:validate
pnpm db:generate
pnpm build
pnpm db:check
```

Validate/generate không cần connection thật. db:check dùng generated Prisma Client của từng service để kết nối PostgreSQL, xác minh schema tồn tại và role có USAGE; không tạo bảng và không chứng minh toàn bộ grants isolation.

## 5. Migration strategy

Không có model giả. Phase 0 bootstrap namespace bằng create-schemas.sql; Prisma migrations chỉ có migration_lock.toml. Khi thêm model thật, đặt @@schema("owned_schema") và tạo migration trong service sở hữu.

Migrate dev cần shadow database riêng có thể tạo/xóa an toàn. Không đặt shadow database vào cùng Supabase production/shared database; không dùng migrate reset hay db push trên database dùng chung. Nếu provision shadow database thủ công, bổ sung shadowDatabaseUrl trong prisma.config.ts cho development theo tài liệu version đang cài.

Migrate deploy sử dụng DIRECT_URL và migration history riêng nhờ schema parameter. Review SQL để không chạm schema khác trước khi áp dụng.

## Nguồn

[Supabase Prisma guide](https://supabase.com/docs/guides/database/prisma), [Supabase connection options](https://supabase.com/docs/guides/database/connecting-to-postgres), [Prisma multiple schemas](https://www.prisma.io/docs/orm/prisma-schema/data-model/multi-schema), [Prisma Config](https://www.prisma.io/docs/orm/reference/prisma-config-reference).
