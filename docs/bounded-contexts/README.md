# Bounded contexts

Phase 0 chỉ có infrastructure + health; các bảng sau **chưa được tạo**.

| Context      | Schema       | Dữ liệu và trách nhiệm dự kiến                                                                                                        |
| ------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------- |
| Identity     | identity     | users, roles, permissions, role_permissions, event_role_assignments, refresh_tokens; auth và event-scoped RBAC                        |
| Event        | event        | events, event_locations, rooms, tracks, sessions, speakers, session_speakers; nội dung và agenda                                      |
| Registration | registration | attendees, registration_forms, registration_form_fields, event_registrations, registration_responses, tickets, check_ins              |
| Operations   | operations   | teams, event_staff, team_members, tasks, task_assignments, documents, equipment, equipment_assignments, organizations, event_sponsors |
| Reporting    | reporting    | event_metrics, registration_metrics, checkin_metrics, session_metrics, operations_metrics; read models riêng                          |

Event lưu ownerUserId dạng UUID, không FK sang Identity. Registration có eventId nhưng không đọc trực tiếp Event DB. Operations gom staff/task/resource/sponsor trong một service. Reporting nhận domain events để xây projection, không query DB của service nguồn.

Các giao tiếp nghiệp vụ, consistency guarantees và failure policies sẽ được thiết kế ở phase tương ứng. Contracts không export Prisma models hoặc business repository. Không có Order/Payment hoặc service tài chính.
