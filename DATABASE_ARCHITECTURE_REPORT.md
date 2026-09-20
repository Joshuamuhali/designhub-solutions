# Designhub Solutions - Database Architecture Report

## A. System Modules

The Designhub Solutions system is a comprehensive design agency management platform with the following modules:

1. **Public Website** - Service catalog, landing pages, contact forms, project consultation
2. **Authentication & User Management** - Supabase Auth with profile extensions
3. **Lead Management** - CRM for tracking leads from multiple sources (website, referrals, campaigns)
4. **Project Management** - Full project lifecycle with tasks, files, revisions
5. **Financial Management** - Quotes, invoices, payments, commissions, expenses
6. **Communication** - Messaging system between clients and staff
7. **Support System** - Ticket management and resolution
8. **Marketing** - Campaign tracking and analytics
9. **ERP** - Company/contact management, opportunities, feedback
10. **Offerings Management** - Services and products catalog with landing pages
11. **Audit & Logging** - System activity tracking

## B. User Types

The system uses a hierarchical role-based access control model with 8 distinct user types:

| Role | Access Level | Category | Primary Dashboard |
|------|-------------|----------|-------------------|
| super_admin | 10 | admin | SuperAdminDashboard |
| admin | 8 | admin | AdminDashboard |
| sales_head | 7 | sales | SalesHeadDashboard |
| finance | 6 | finance | FinanceDashboard |
| marketing | 6 | marketing | MarketingDashboard |
| support | 5 | support | SupportDashboard |
| sales_rep | 5 | sales | SalesRepDashboard |
| client | 1 | client | Overview |

### Role Permissions:
- **super_admin**: Full system access, user management, all dashboards
- **admin**: Administrative access, limited user management, reports
- **sales_head**: Sales team management, reports, analytics, commission approval
- **sales_rep**: Client management, sales tasks, commissions, lead creation
- **finance**: Financial reports, invoices, billing, payment approval
- **marketing**: Campaigns, analytics, content management
- **support**: Ticket management, customer support
- **client**: View own projects, invoices, communicate, update profile

## C. Core Workflows

### 1. Lead Generation Workflow
- **Public Landing Page** → User fills inquiry form → `service_inquiries` table
- **Project Consultation** → User fills detailed form → `leads` table with JSONB fields
- **Product Catalog** → User expresses interest → `leads` table with product attribution
- **UTM Tracking** → Campaign parameters captured in `leads` and `service_inquiries`

### 2. Lead to Project Conversion
- Sales rep qualifies lead → Update `leads.status` to 'qualified'
- Lead converts to opportunity → Create record in `opportunities` table
- Opportunity won → Create project in `projects` table
- Project assigned to PM → Add to `project_members` table

### 3. Project Execution Workflow
- PM creates tasks in `project_tasks` table
- Team uploads files to `project_files` with visibility tiers
- Designer submits proof → Create `project_revisions` record
- Client reviews → Update revision status
- Client approves → Update project status to 'client_approved'
- PM confirms completion → Update project to 'completed', auto-create invoice

### 4. Financial Workflow
- Quote created from project → `quotes` and `quote_items` tables
- Quote accepted → Create invoice in `invoices` table
- Payment received → Record in `payments` table
- Commission calculated → Record in `commissions` table
- Expenses tracked → Record in `expenses` table

### 5. Communication Workflow
- Conversation created between two users → `conversations` table
- Messages exchanged → `messages` table
- Notifications generated → `notifications` table
- Files attached → `file_attachments` table

## D. Canonical Tables

### Core Tables (Required for System Operation)

#### Authentication & Users
1. **profiles** - Extends auth.users with role and profile data
2. **audit_logs** - System activity tracking

#### Lead Management
3. **leads** - Comprehensive lead tracking with product catalog and project consultation fields

#### Project Management
4. **projects** - Project records with status tracking
5. **project_tasks** - Task assignments and progress
6. **project_files** - File uploads with visibility tiers
7. **project_revisions** - Proof reviews and client feedback
8. **project_members** - Project team assignments

#### Financial
9. **quotes** - Quote records
10. **quote_items** - Line items for quotes
11. **invoices** - Invoice records
12. **payments** - Payment tracking
13. **commissions** - Sales commissions
14. **expenses** - Expense tracking

#### Communication
15. **conversations** - Message threads
16. **messages** - Individual messages
17. **notifications** - User notifications

#### Support
18. **support_tickets** - Support ticket management

#### Marketing
19. **campaigns** - Marketing campaign tracking

#### Offerings
20. **services** - Service catalog for landing pages
21. **products** - Product catalog
22. **service_inquiries** - Landing page inquiry submissions

#### ERP
23. **companies** - Client company records
24. **contacts** - Contact persons
25. **opportunities** - Sales pipeline
26. **feedbacks** - Post-project feedback

#### Legacy/Transition
27. **service_requests** - Legacy service request tracking (kept for compatibility)
28. **project_milestones** - Legacy milestone tracking (kept for compatibility)
29. **file_attachments** - Legacy file tracking (kept for compatibility)

## E. Relationships

### Key Relationships:
- **profiles.id** → auth.users.id (1:1)
- **leads.assigned_to** → profiles.id (many:1)
- **projects.lead_id** → leads.id (many:1)
- **projects.pm_id** → profiles.id (many:1)
- **project_tasks.project_id** → projects.id (many:1)
- **project_tasks.assigned_to** → profiles.id (many:1)
- **project_files.project_id** → projects.id (many:1)
- **project_files.uploaded_by** → profiles.id (many:1)
- **project_revisions.project_id** → projects.id (many:1)
- **quotes.project_id** → projects.id (many:1)
- **quote_items.quote_id** → quotes.id (many:1)
- **invoices.quote_id** → quotes.id (many:1)
- **payments.invoice_id** → invoices.id (many:1)
- **conversations.participant_1_id** → profiles.id (many:1)
- **conversations.participant_2_id** → profiles.id (many:1)
- **messages.conversation_id** → conversations.id (many:1)
- **messages.sender_id** → profiles.id (many:1)
- **notifications.user_id** → profiles.id (many:1)
- **notifications.sender_id** → profiles.id (many:1)
- **opportunities.company_id** → companies.id (many:1)
- **opportunities.contact_id** → contacts.id (many:1)
- **contacts.company_id** → companies.id (many:1)

## F. Security Model

### Authentication
- Uses Supabase Auth (`auth.users` table)
- Profile data stored in `profiles` table with foreign key to `auth.users.id`
- Role stored in `profiles.role` field
- JWT claims used for role-based access control

### Multi-Tenant Architecture
- **NOT multi-tenant** - This is a single-tenant system (Designhub's internal system)
- All data belongs to Designhub as a single organization
- No tenant_id or organization_id columns needed
- Isolation is achieved through role-based access control

### RBAC Model
- Hierarchical role system with access levels (1-10)
- Role-based routing to specific dashboards
- Permission checking done in frontend (roleSystem.ts)
- RLS policies enforce database-level security

### RLS Strategy
- **Public tables** (services, products, service_inquiries): Allow anonymous INSERT, authenticated SELECT/UPDATE
- **User-owned data** (conversations, messages, notifications): User can only access their own records
- **Project data**: Access through project membership or service request ownership
- **Admin data**: Admins and super_admins can access all records
- **Staff data**: Staff roles can access relevant business data

## G. Problems Found in Existing SQL

### Critical Issues:
1. **Duplicate users table**: Both `profiles` (correct) and standalone `users` table exist
2. **Duplicate projects table**: Multiple conflicting definitions across SQL files
3. **Missing foreign keys**: Some tables reference non-existent tables or columns
4. **Incorrect RLS policies**: Policies use `auth.jwt() -> 'role'` which doesn't exist in Supabase
5. **Enum conflicts**: service_type defined as ENUM in one file, TEXT in another
6. **Missing tables**: Code references `deals`, `content` tables not defined in SQL
7. **Inconsistent column names**: `client` vs `client_name`, `user_id` vs `assigned_to`

### Medium Issues:
1. **Missing indexes**: Foreign keys and frequently queried columns lack indexes
2. **No updated_at triggers**: Some tables lack automatic timestamp updates
3. **Inconsistent status enums**: Different status values across similar tables
4. **Missing constraints**: No CHECK constraints on critical fields
5. **Orphan-prone relationships**: Some foreign keys don't have proper CASCADE rules

### Minor Issues:
1. **Inconsistent naming**: Mixed use of snake_case and camelCase
2. **Missing defaults**: Some columns lack sensible defaults
3. **No audit fields**: Missing created_by, updated_by on critical tables
4. **Seed data conflicts**: Multiple SQL files insert conflicting seed data

## H. Design Decisions

### 1. Profiles vs Users Table
**Decision**: Use `profiles` table extending `auth.users`, remove standalone `users` table
**Reason**: Supabase best practice, avoids data duplication, maintains auth consistency

### 2. Projects Table Definition
**Decision**: Use the ERP-style projects table with company/contact relationships
**Reason**: More comprehensive, supports the full project workflow, aligns with erpService.ts

### 3. Role Storage
**Decision**: Store role in `profiles.role` as TEXT with CHECK constraint
**Reason**: Simple, flexible, works with Supabase Auth, no need for custom claims

### 4. RLS Policy Approach
**Decision**: Use role-based RLS checking `profiles.role` via subquery
**Reason**: Reliable, doesn't depend on JWT claims, works with Supabase Auth

### 5. Service vs Product Tables
**Decision**: Keep separate `services` and `products` tables for landing pages
**Reason**: Different data structures, different workflows, already implemented in code

### 6. Lead Management
**Decision**: Comprehensive `leads` table with JSONB fields for flexible data capture
**Reason**: Supports multiple lead sources (catalog, consultation, campaigns), flexible schema

### 7. Project File Visibility
**Decision**: Use visibility tier system (internal_only, working_file, client_review, final_deliverable)
**Reason**: Supports the proof review workflow, matches erpService.ts implementation

### 8. Invoice Number Generation
**Decision**: Auto-generate invoice numbers using database trigger
**Reason**: Ensures uniqueness, follows consistent pattern, reduces application logic

### 9. Legacy Tables
**Decision**: Keep `service_requests`, `project_milestones`, `file_attachments` for compatibility
**Reason**: Referenced by existing code, gradual migration path

### 10. UTM Tracking
**Decision**: Add UTM columns to both `leads` and `service_inquiries` tables
**Reason**: Supports marketing attribution, campaign tracking, already implemented in code

## I. Canonical Table Structure Summary

### Tables by Category:

**Authentication (2 tables)**
- profiles
- audit_logs

**Lead Management (1 table)**
- leads

**Project Management (5 tables)**
- projects
- project_tasks
- project_files
- project_revisions
- project_members

**Financial (6 tables)**
- quotes
- quote_items
- invoices
- payments
- commissions
- expenses

**Communication (3 tables)**
- conversations
- messages
- notifications

**Support (1 table)**
- support_tickets

**Marketing (1 table)**
- campaigns

**Offerings (3 tables)**
- services
- products
- service_inquiries

**ERP (4 tables)**
- companies
- contacts
- opportunities
- feedbacks

**Legacy/Transition (3 tables)**
- service_requests
- project_milestones
- file_attachments

**Total: 29 tables**
