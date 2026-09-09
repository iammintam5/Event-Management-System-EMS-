# Database roadmap

Phase 0 only initializes PostgreSQL's public schema and Prisma migration history.
No business tables or dummy models are created. Health uses `SELECT 1` through Prisma.

Phase 1 adds users and event-scoped authorization foundations. Later MVP phases add
events, rooms, sessions, attendees, event_registrations, ticket_types, orders,
order_items, payments, tickets and check_ins. Version all schema changes using
named Prisma migrations. Use UUIDs, Decimal money values, database constraints,
and transactional updates for payment and check-in.
