# Synapxix

Adaptive cognitive learning platform built as an Nx monorepo powered by Angular (frontends), NestJS (backend API), PostgreSQL + Prisma (multi-schema relational persistence), Neo4j (adaptive knowledge graph), and Redis (caching and rate limiting).

---

## Overview

**Synapxix** is an interactive educational ecosystem designed to support student learning through gamified cognitive activities, ethical behavioral telemetry, and AI-assisted psychopedagogical analytics.

The platform is structured around four core pillars:

1. **Gamified Student Experience (`web-game` + `libs/game-engine/core`)**:
   - Curated learning journeys (*histories/roadmaps*) composed of **16 interactive game types** spanning linguistic, logical, spatial, and auditory domains (`read-aloud`, `categorization`, `fill-in-the-blanks`, `intruder`, `timeline-order`, `memory-match`, `word-association`, `pattern-recognition`, `balance-master`, `neural-link`, `spotlight`, `sound-match`, `listen-type`, `read-select`, `speak-about-photo`, `avatar`).
   - Dynamic execution engine (`GameRunnerComponent` + `GameFlowService`) driven by a deterministic finite state machine (`IDLE` → `LOADING` → `READY` → `PLAYING` → `ANSWERING` → `FEEDBACK` → `ADVANCING` → `COMPLETED`).
   - Real-time pedagogical feedback streamed via **Server-Sent Events (SSE)** and tailored to student performance.
   - **Virtual economy & progression (`economy`)**: transactional and idempotent awarding of credits and experience points (XP), cosmetic item store (avatars and banners), and user inventory management.
   - Student dashboard displaying cognitive metrics, curriculum progress, and session history.

2. **D.A.L.A.™ Adaptive Engine (`libs/dala/*` + `server/src/app/modules/dala`)**:
   - Reference implementation of the **Dynamic Adaptive Learning Architecture (Specification v3)**.
   - Full auditable loop: `evidence → state → decision → intervention → outcome → update`.
   - **Privacy by design**: strict separation between real user identity (`user_id` in the `auth` schema) and pseudonymous learning subject (`subject_id` in the `dala` schema), governed by versioned informed consent (`consent`).
   - **Construct estimation**: tracks 5 core constructs (`curricular_mastery`, `persistence`, `help_seeking`, `strategy_flexibility`, and `task_engagement`).
   - **Shadow Mode**: pedagogical recommendations (`ASK`, `HINT`, `WITHDRAW_SUPPORT`, `REFLECT`, `VERIFY`) are recorded with full evidence traceability and require human review/approval by educators.

3. **Knowledge Graph & Multi-LLM AI Analytics (`learning`, `research`, `evaluative`, `analytics`)**:
   - **Neo4j Knowledge Graph (`learning`)**: models users, curriculum topics, prerequisites, mastery progress, learning preferences (Gardner Multiple Intelligences and Kolb Learning Styles), and pedagogical methods with vector embeddings.
   - **Cognitive & Multimodal Evaluation (`evaluative`, `exercises`, `research`)**: computes accuracy, reaction time, cognitive load, memory retention, and attention span, combined with semantic and phonetic (audio) analysis through a multi-provider AI abstraction layer (`libs/ai-adapter`: Google Gemini, Anthropic Claude, OpenAI, and xAI Grok).
   - **Automated Teacher Insights (`teacher-insights`)**: scheduled (cron) and on-demand generation of weekly cohort pedagogical reports.

4. **Teacher & Administration Portal (`admin-frontend` + `admin`)**:
   - Portal for teachers and school directors featuring cohort-wide cognitive analytics, individual student progression tracking, AI query assistant, D.A.L.A.™ decision review (`teacher/dala-review`), institution-level user management, and CSV report exports.

---

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Monorepo Build System | [Nx](https://nx.dev) | 22.0.x |
| Student Frontend (`web-game`) | Angular + TailwindCSS | 20.3.x / 3.4.x |
| Admin & Teacher Portal (`admin-frontend`) | Angular (SSR enabled) | 20.3.x |
| Backend API (`server`) | NestJS | 11.x |
| Relational ORM | Prisma | 6.19.x |
| Relational Database | PostgreSQL | 15 |
| Graph Database | Neo4j (with APOC) | 5.26 |
| Caching & Throttling | Redis + `cache-manager` | 7 / 5.x |
| Identity & Access Management | Keycloak (OIDC / JWKS) + Passport JWT | 26.x |
| Data Visualization | Chart.js + `ng2-charts` | 4.5.x / 9.0.x |
| AI Providers | Gemini (`@google/generative-ai`), Claude (`@anthropic-ai/sdk`), OpenAI (`openai`), Grok | Multi-adapter |
| Logging & HTTP Security | `nestjs-pino` (Pino) + `helmet` + `@nestjs/throttler` | 5.x / 8.x / 6.x |
| Testing | Jest (unit) + Playwright (E2E) | 30.x / 1.61.x |
| Language & Runtime | TypeScript / Node.js | ~5.9.2 / >=22.12.0 |

---

## Monorepo Structure

```text
synapxix/
├── server/                                   # NestJS Backend API
│   └── src/app/
│       ├── admin/                            # Administrative management, user metrics, and CSV exports
│       ├── analytics/                        # Global, class-level, and individual cognitive aggregations
│       ├── auth/                             # Passport JWT strategy (Keycloak JWKS), role and teacher guards
│       ├── consent/                          # Versioned informed consent management (D.A.L.A.)
│       ├── core/filters/                     # Global HTTP exception filter
│       ├── decorators/                       # Custom route decorators (@GetUser)
│       ├── economy/                          # Virtual economy engine (credits, XP, rewards, store, purchases)
│       ├── evaluative/                       # Transactional evaluative engine and AI SSE streaming
│       ├── exercises/                        # Validation and scoring for all 16 exercise/game types
│       ├── game-session/                     # Game session lifecycle, attempts, and adaptive difficulty
│       ├── learning/                         # Neo4j knowledge graph and adaptive path recommendations
│       ├── modules/
│       │   ├── dala/                         # D.A.L.A.™ v1 facade, repository, and API endpoints
│       │   └── research/                     # AI pedagogical analysis, Redis caching, prompts, and teacher-insights
│       ├── notifications/                    # In-app user notifications
│       ├── profile/                          # User preferences and psychopedagogical archetype calculation
│       └── health.controller.ts              # Healthcheck endpoint (/api/health)
│
├── web-game/                                 # Angular SPA — Interactive Student Platform
│   └── src/
│       ├── app/                              # Root configuration, routes, Keycloak guards, and consent service
│       ├── components/
│       │   ├── dashboard/                    # Student dashboard (balance, cognitive metrics, progress, sessions)
│       │   ├── shop/                         # Virtual store for cosmetic avatars and banners
│       │   ├── map.component.ts              # Interactive learning journey map
│       │   ├── menu.component.ts             # Main navigation shell
│       │   └── splash.component.ts           # Welcome and entry screen
│       └── teachers-form/                    # Roadmap builder and activity authoring forms for educators
│
├── admin-frontend/                           # Angular SPA — Teacher & Administration Portal
│   └── src/app/
│       ├── core/                             # Role guards, domain models, and HTTP services (analytics, admin, dala)
│       ├── dashboard/                        # General dashboard, AI assistant, cognitive charts, and user management
│       ├── teacher-dashboard/                # Cohort analytics, student detail views, and D.A.L.A. decision review
│       ├── login/ & login-preview/           # Authentication screens
│       └── register-preview/                 # Registration views
│
└── libs/                                     # Shared Workspace Libraries
    ├── ai-adapter/                           # Multi-LLM abstraction for Gemini, Claude, OpenAI, and Grok
    ├── brand/                                # Design system: CSS tokens (--sx-*), base.css, and official assets
    ├── dala/
    │   ├── contracts/                        # Public contracts and interfaces for the D.A.L.A.™ standard
    │   ├── domain/                           # Pure evidence rules, construct estimators, and pedagogical policies
    │   └── instrumentation/                  # Event emission SDK with offline queue and game adapters
    ├── game-engine/core/                     # Game engine: GameRunner, state machine, core services, and 16 games
    ├── learning/shared/                      # Shared DTOs and contracts for the Neo4j learning module
    ├── prisma/                               # Multi-schema PostgreSQL definition, migrations, seeds, and PrismaService
    └── testing/                              # Shared test factories and mocks
```

---

## Database Architecture

### 1. PostgreSQL (Prisma Multi-Schema)

The [`libs/prisma/src/schema.prisma`](libs/prisma/src/schema.prisma) file organizes relational persistence across **7 PostgreSQL schemas** to enforce domain isolation:

| Schema | Tables | Responsibility |
|---|---|---|
| `auth` | `app_user`, `session`, `user_link`, `user_structure`, `user_profile`, `dala_consent`, `dala_subject_map` | Identity, teacher-student links, informed consent, and pseudonymous subject mapping |
| `core` | `institution`, `structure`, `game_session`, `game_attempt`, `economy_transaction`, `store_item`, `user_inventory`, `purchase_transaction`, `ai_prompt`, `teacher_insight_report` | Educational domain, game sessions, virtual economy, AI prompt templates, and teacher reports |
| `dala` | `instrument`, `behavior_event`, `evidence_observation`, `construct_estimate`, `human_state_snapshot`, `decision_record`, `outcome` | Immutable behavior event store, evidence observations, construct estimates, snapshots, and decisions |
| `psychometrics` | `dimension`, `archetype`, `archetype_dimension_weight`, `cognitive_metric` | Psychometric dimensions, archetypes, and session-level cognitive metrics |
| `knowledge` | `content`, `user_content_progress` | Curriculum content catalog, prerequisites, and per-student mastery progress |
| `audit` | `audit_log` | System audit trail and operational traceability |
| `communication` | `notification` | User notification inbox |

### 2. Neo4j (Adaptive Knowledge Graph)

Used by `LearningModule` to model adaptive relationships and vector embeddings (`768` dimensions, cosine similarity):
- **Nodes**: `User`, `Topic`, `LearnPref` (Gardner / Kolb), `LearnMethod`.
- **Relationships**: `(:User)-[:OWNS]->(:Topic)`, `(:User)-[:INTEREST_IN {weight}]->(:Topic)`, `(:User)-[:PREFERS {weight}]->(:LearnPref)`, `(:User)-[:BENEFITS_FROM {weight}]->(:LearnMethod)`, `(:Topic)-[:PREREQUISITE]->(:Topic)`, `(:User)-[:PROGRESS {status, score}]->(:Topic)`.

### 3. Redis (Caching & Rate Limiting)

Used for:
- AI response caching (`AiCacheInterceptor`, key `ai-response:<sha256>`).
- Database-backed AI prompt template caching (`AiPromptService`).
- Per-user AI request quota enforcement (`AiUserThrottleGuard`, key `ai-throttle:<userId>`).
- Student metric list caching (`EvaluativeService`).

---

## API Reference

The backend server listens on `http://localhost:3000/api` by default. Except for `/api/health`, all endpoints require an `Authorization: Bearer <JWT>` header.

### System & Health
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/health` | Public server healthcheck |
| `GET` | `/api` | Authenticated base API status |

### Auth, Profile & Consent
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/auth/preferences` | Retrieve basic token profile and default preferences |
| `GET` | `/api/preferences` | Retrieve persisted user preferences (`ProfileModule`) |
| `PATCH` | `/api/preferences` | Update theme, language, and notification settings (`ProfileModule`) |
| `GET` | `/api/profile/:userId/archetype` | Compute a user's psychopedagogical archetype (`ProfileModule`) |
| `GET` | `/api/consent/current` | Query current informed consent status (`?scope=research`) |
| `POST` | `/api/consent` | Grant or revoke versioned informed consent |

### Virtual Economy & Store (`EconomyModule`)
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/economy/balance` | Get current credits and XP for the authenticated user |
| `GET` | `/api/economy/items` | List active cosmetic items available in the store |
| `POST` | `/api/economy/claim-reward` | Claim idempotent session completion reward (credits and XP) |
| `POST` | `/api/economy/purchase` | Purchase a store item using virtual credits |

### Game Sessions (`GameSessionModule`)
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/game-session/start` | Start a new game session |
| `POST` | `/api/game-session/:id/attempt` | Record an exercise attempt within a session |
| `POST` | `/api/game-session/:id/complete` | Mark a game session as completed |
| `GET` | `/api/game-session/:id` | Retrieve session details and attempts (owner or staff) |
| `GET` | `/api/game-session/me/report` | Retrieve game history and summary for the authenticated user |
| `GET` | `/api/game-session/me/difficulty` | Get calculated adaptive difficulty tier for the authenticated user |
| `GET` | `/api/game-session/user/:userId/report` | Retrieve activity report for a specific student (staff only) |

### Exercise Evaluation (`ExercisesModule`)
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/exercises/read-aloud` | Multimodal phonetic evaluation with audio upload (`multipart/form-data`) |
| `POST` | `/api/exercises/categorization` | Evaluate categorization exercise |
| `POST` | `/api/exercises/fill-in-the-blanks` | Evaluate fill-in-the-blanks exercise |
| `POST` | `/api/exercises/intruder` | Evaluate intruder detection exercise |
| `POST` | `/api/exercises/<game-type>` | Evaluation endpoints for all remaining game types (`avatar`, `balance-master`, `listen-type`, `neural-link`, `memory-match`, `word-association`, `read-select`, `sound-match`, `speak-about-photo`, `spotlight`, `timeline-order`, `pattern-recognition`) |

### Evaluative Engine, AI Research & Teacher Insights (`EvaluativeModule`, `ResearchModule`, `TeacherInsightsModule`)
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/evaluative/evaluate` | Compute and persist cognitive metrics from session attempts |
| `POST` | `/api/evaluative/evaluate-ai` | Evaluate performance with AI and persist standardized cognitive metrics |
| `POST` | `/api/evaluative/evaluate-ai/stream` | SSE stream for AI pedagogical or audio evaluation |
| `GET` | `/api/evaluative/students` | List linked students with cognitive metric summaries |
| `GET` | `/api/evaluative/students/:id/metrics` | Retrieve historical cognitive metric series for a student |
| `POST` | `/api/research/process` | Analyze game activity with AI (with Redis caching and per-user rate limiting) |
| `POST` | `/api/research/process/stream` | Real-time AI game activity analysis via SSE |
| `GET` | `/api/teacher-insights/:teacherId` | List generated weekly cohort insight reports for a teacher |
| `POST` | `/api/teacher-insights/:teacherId/generate` | Trigger on-demand AI generation of the weekly cohort report |

### Analytics, Administration & Notifications (`AnalyticsModule`, `AdminModule`, `NotificationsModule`)
| Method | Route | Description |
|---|---|---|
| `GET` | `/api/analytics/global-average` | Global cognitive metric averages (`?startDate=YYYY-MM-DD&endDate=YYYY-MM-DD`) |
| `GET` | `/api/analytics/individual-average/:userId` | Individual cognitive metric averages for a student |
| `GET` | `/api/analytics/class-progress/:classId` | Curriculum progress average for a class (`structure_id`) |
| `GET` | `/api/analytics/student-progress/:studentId` | Curriculum progress average for an individual student |
| `GET` | `/api/analytics/global-motor-average` | Global average score and quick-completion rate |
| `GET` | `/api/analytics/global-evaluative-average` | Global success rate across recorded attempts |
| `GET` | `/api/admin/users` | Paginated and filtered student directory (`teacher` / `director`) |
| `GET` | `/api/admin/users/:id/metrics` | Detailed cognitive metrics for a specific user |
| `GET` | `/api/admin/institutions/:id/stats` | Aggregated statistics by institution |
| `GET` | `/api/admin/reports/students` | Export student report in CSV format (`?format=csv&institutionId=...`) |
| `GET` | `/api/notifications` | List notifications for the authenticated user |
| `POST` | `/api/notifications` | Create a notification for a linked user |
| `PATCH` | `/api/notifications/read-all` | Mark all notifications as read |
| `PATCH` | `/api/notifications/:id/read` | Mark a specific notification as read |

### D.A.L.A.™ Adaptive Engine (`DalaModule`)
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/dala/v1/events` | Idempotent ingestion of a single behavior event (requires active consent) |
| `POST` | `/api/dala/v1/events/batch` | Batch ingestion of behavior events |
| `POST` | `/api/dala/v1/subjects/resolve` | Resolve the pseudonymous `subject_id` for the authenticated user |
| `GET` | `/api/dala/v1/subjects/:subjectId/state` | Retrieve current construct estimates for a subject |
| `GET` | `/api/dala/v1/subjects/:subjectId/timeline` | Retrieve behavior event timeline for a subject |
| `POST` | `/api/dala/v1/decisions` | Generate a shadow-mode pedagogical recommendation with state snapshot |
| `GET` | `/api/dala/v1/decisions` | List recorded decisions (`?status=pending\|reviewed&page=1&limit=20`) |
| `GET` | `/api/dala/v1/decisions/:decisionId` | Retrieve a specific decision record |
| `POST` | `/api/dala/v1/decisions/:decisionId/review` | Record educator verdict (`approved` \| `rejected` \| `edited`) |
| `POST` | `/api/dala/v1/outcomes` | Record observed post-intervention outcome metrics |
| `GET` | `/api/dala/v1/traces/:decisionId` | Reconstruct full audit trace: decision → snapshot → evidence → outcomes |

### Adaptive Knowledge Graph (`LearningModule`)
| Method | Route | Description |
|---|---|---|
| `POST` | `/api/learning/bootstrap` | Initialize Neo4j constraints, vector indexes, and base catalogs |
| `POST` | `/api/learning/users` | Create or update a user node in the knowledge graph |
| `POST` | `/api/learning/topics` | Create a topic and initialize interest weight |
| `POST` | `/api/learning/topics/feedback` | Reinforce or adjust topic interest weight |
| `POST` | `/api/learning/preferences` | Set user learning preferences |
| `POST` | `/api/learning/methods/init` | Initialize affinity with a learning method |
| `POST` | `/api/learning/methods/feedback` | Adjust effectiveness weight for a learning method |
| `GET` | `/api/learning/topics` | Get top topics for the authenticated user |
| `GET` | `/api/learning/preferences` | Get top learning preferences for the authenticated user |
| `GET` | `/api/learning/methods` | Get top learning methods for the authenticated user |
| `POST` | `/api/learning/embedding/refresh` | Recompute the user's vector embedding in Neo4j |
| `GET` | `/api/learning/:userId/graph` | Retrieve the user's topic progress and prerequisite subgraph |
| `GET` | `/api/learning/:userId/recommended-path` | Get recommended next topics based on satisfied prerequisites |

---

## Local Setup

### Prerequisites

- Node.js `>=22.12.0` (see `.nvmrc`)
- Docker & Docker Compose
- Git

### 1. Clone and configure environment

```bash
git clone <repo-url>
cd synapxix

# Copy environment template and fill in local credentials
cp .env.example .env
```

Ensure `APP_DB_*` and `DATABASE_URL` values in `.env` match each other.

### 2. Install dependencies

```bash
npm install --legacy-peer-deps
```

### 3. Initialize the database

Run the setup shortcut to start PostgreSQL and Redis, generate the Prisma client, apply migrations, and seed development data:

```bash
npm run dev:setup
```

Or run each step individually:

```bash
npm run db:up             # docker compose up -d postgres-app redis
npm run db:migrate        # prisma migrate deploy --config prisma.config.ts
npm run db:seed           # development user + store catalog
npm run db:seed:prompts   # AI prompt templates in PostgreSQL
```

> The development seed (`libs/prisma/src/seeds/dev.seed.ts`) creates the default user referenced by `MockJwtGuard`. Without this record, database writes will fail on foreign key constraints when `DISABLE_AUTH=true`.

### 4. Start the applications

Run each service in a separate terminal:

```bash
# NestJS Backend API (port 3000)
npx nx serve server

# Student Web Game SPA (port 4300)
npx nx serve web-game

# Teacher & Admin Portal SPA (port 4200)
npx nx serve admin-frontend
```

### 5. Development Authentication Modes

#### Fast Mode: Bypass JWT Validation (`DISABLE_AUTH`)

Suitable for testing the backend API and `admin-frontend` locally (`NODE_ENV !== 'production'`). Set in `.env`:

```env
DISABLE_AUTH=true
```

The backend activates `MockJwtGuard`, injecting a fixed educator user (`00000000-0000-4000-8000-000000000001`). Note that `web-game` still executes its browser-side Keycloak guard unless Keycloak is running.

#### Full Mode: Local Keycloak Instance

Required for end-to-end authentication flows in `web-game`:

```bash
docker compose up -d postgres-keycloak keycloak
```

The `Synapxix` realm and `synapxix-app` client are automatically imported from `keycloak/realm-synapxix.json` on first startup. Configure `.env`:

```env
DISABLE_AUTH=false
KEYCLOAK_PORT=8080
KEYCLOAK_REALM_URL=http://localhost:8080/realms/Synapxix
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=changeme
KEYCLOAK_DB_NAME=keycloak
KEYCLOAK_DB_USER=keycloak_user
KEYCLOAK_DB_PASSWORD=changeme
```

To create a test user, open the Keycloak Admin Console at `http://localhost:8080`, select the **Synapxix** realm → *Users* → *Add user*, set a password under *Credentials*, and assign the `teacher` or `student` role under *Role mapping*.

> To use a remote Keycloak server instead of the local container, set `KEYCLOAK_REALM_URL=https://auth.aisuite.neops.ai/realms/Synapxix` and update `keycloak.url` in `web-game/src/environments/environment.ts`.

---

## Development Workflows

### Adding a New API Endpoint

1. Create the request DTO with `class-validator` decorators in `server/src/app/<module>/dto/`
2. Implement business logic in the module's `Service` (and persistence queries in its `Repository`)
3. Register the route and guards (`JwtAuthGuard`, `RolesGuard`, or `TeacherAccessGuard`) in the `Controller`
4. If schema changes are required, create a migration: `npx prisma migrate dev --config prisma.config.ts --name <migration_name>`
5. Regenerate the Prisma client: `npx prisma generate --config prisma.config.ts`

### Resolving `package-lock.json` Conflicts

The repository configures `.gitattributes` with `merge=ours` for `package-lock.json`. When a merge modifies dependencies:

1. Complete the git merge normally
2. Run `npm install --legacy-peer-deps` to regenerate the merged lockfile
3. Stage and commit the updated `package-lock.json`

### Updating the Prisma Schema

```bash
# Edit libs/prisma/src/schema.prisma, then run:
npx prisma migrate dev --config prisma.config.ts --name change_description
npx prisma generate --config prisma.config.ts
```

> Always run `prisma generate` after editing the schema or pulling new migrations.

### Generating a Shared Library

```bash
npx nx g @nx/js:library libs/<name>
```

---

## Testing

### Unit Tests (Jest)

```bash
# Run all unit tests across the monorepo
npx nx test

# Run unit tests for a specific project
npx nx test server
npx nx test web-game
npx nx test admin-frontend

# Run with coverage report
npx nx test server --coverage
```

### End-to-End Tests (Playwright)

```bash
# Run E2E tests in headless mode
npx nx e2e web-game

# Run E2E tests with Playwright interactive UI
npx nx e2e web-game --ui
```

> Ensure the backend server (`npx nx serve server`) is running before executing E2E suites.

---

## Production Build

```bash
npx nx build server
npx nx build web-game
npx nx build admin-frontend
```

Compiled artifacts are emitted to the `dist/` directory.

---

## Environment Variables

See [`.env.example`](.env.example) for the full template:

| Variable | Description |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string used by Prisma |
| `APP_DB_NAME` / `USER` / `PASSWORD` / `PORT` | Application PostgreSQL credentials and host port (default: `5434`) |
| `DISABLE_AUTH` | When `true` in non-production environments, enables `MockJwtGuard` on the backend |
| `KEYCLOAK_REALM_URL` | Public Keycloak realm URL used to validate JWT `iss` claims |
| `KEYCLOAK_JWKS_URL` | (Optional) Internal JWKS endpoint URL for Docker network resolution |
| `GOOGLE_GEN_AI_KEY` | Google AI Studio API key (default Gemini provider) |
| `AI_PROVIDER` / `AI_MODEL` | (Optional) AI provider (`gemini`, `claude`, `openai`, `grok`) and model override |
| `AI_RATE_LIMIT_PER_USER` | Max AI requests per user per minute (default: `10`) |
| `AI_MAX_RETRIES` / `AI_RETRY_BASE_DELAY_MS` | Exponential backoff retry settings for AI provider calls |
| `REDIS_HOST` / `PORT` / `PASSWORD` | Redis connection settings for AI cache, prompt cache, and throttling |
| `NEO4J_URI` / `USERNAME` / `PASSWORD` | Neo4j connection settings for `LearningModule` |

---

## Default Ports

| Service | Port |
|---|---|
| NestJS API (`server`) | `3000` |
| `web-game` (Angular) | `4300` |
| `admin-frontend` (Angular) | `4200` |
| PostgreSQL App (`postgres-app`) | `5434` |
| PostgreSQL Keycloak (`postgres-keycloak`) | `5432` |
| Redis (`redis`) | `6379` |
| Keycloak (`keycloak`) | `8080` |
| Neo4j HTTP / Bolt (`neo4j`) | `7474` / `7687` |

---

## CORS

CORS is configured in `server/src/main.ts` using the `CORS_ORIGIN` environment variable (comma-separated list), defaulting to `http://localhost:4200`, `http://localhost:4300`, and `http://localhost:4201`.

---

## Brand & Design System

All UI components adhere to the Synapxix Brand Guidelines documented in **[BRAND.md](BRAND.md)**.

Core rule: **never hardcode literal hex colors, font families, or border radii in component stylesheets.** Always consume the design tokens defined in [`libs/brand/src/tokens.css`](libs/brand/src/tokens.css):

```css
/* Incorrect */           /* Correct */
color: #1e90ff;           color: var(--sx-blue);
border-radius: 4px;       border-radius: var(--sx-radius-sm);
```

Equivalent Tailwind utilities (`bg-synapxix`, `text-blue-deep`, `rounded-sx-lg`, `rounded-sx-pill`) are also available across `web-game` and shared libraries.

---

## Project Conventions

- **Brand System**: Follow [BRAND.md](BRAND.md). Use CSS tokens or Tailwind theme classes instead of hardcoded values.
- **D.A.L.A.™ Architecture**: Follow [docs/DALA.md](docs/DALA.md). External modules must never write directly to the `dala` database schema; all interactions go through `DalaFacade`.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, `docs:`, `refactor:`, `test:`).
- **Code Language**: English for all identifiers, types, comments, and technical documentation.
- **UI Copy**: Spanish for user-facing interface strings.
- **Typing**: Strict TypeScript — avoid `any`; prefer explicit interfaces or `unknown` with type guards.
- **Prisma Migrations**: Every change to `schema.prisma` must include its corresponding migration under `libs/prisma/src/migrations/`.
- **Branching**: Feature branches with pull requests required into `main`.
