# Analytics Module — Test Documentation

## Overview

The **Analytics** module provides statistical aggregation and progress tracking for users, students, and classes across cognitive, motor, and evaluative metrics in Synapxix.

The test suite under `server/src/app/analytics/test/` validates the core controller endpoints, calculation logic in the service layer, role-based authorization, and structural validation of all 6 Data Transfer Objects (DTOs):

| Source file | Spec file | Responsibility |
|---|---|---|
| `analytics.controller.ts` | `analytics.controller.spec.ts` | REST API endpoints, JWT token extraction, self vs teacher/admin role authorization |
| `analytics.service.ts` | `analytics.service.spec.ts` | Prisma database aggregations, date range bounds, zero-division handling, metric averages |
| `dto/*.dto.ts` | `analytics.dto.spec.ts` | `class-validator` schema rules for request/response DTO structures |

**Current status:** 39 tests · 3 test suites · all passing.

---

## Analytics Request & Authorization Flow

```
Client HTTP Request
        │
        ▼
  JwtAuthGuard (Passport JWT)
        │
        ├─ Invalid / Missing Token ──► 401 Unauthorized
        │
        └─ Token Valid ──► req.user = KeycloakJwtPayload
                                │
                                ▼
                      AnalyticsController
                                │
        ┌───────────────────────┴───────────────────────┐
        │                                               │
Global Endpoints                               Individual Endpoints
(e.g., /global-average)                (e.g., /individual-average/:userId)
        │                                               │
        ▼                                       Is req.user.sub == targetId?
AnalyticsService                                        │
        │                                       ├─ YES ──► Authorized
        ▼                                       │
Prisma Aggregations                             └─ NO ───► Query user.role in DB
        │                                                       │
        ▼                                                       ├─ teacher / admin ──► Authorized
HTTP Response (DTO)                                             │
                                                                └─ regular user ────► 401 Unauthorized
```

---

## Test Layout

```
server/src/app/analytics/
├── analytics.controller.ts
├── analytics.module.ts
├── analytics.service.ts
├── dto/
│   ├── class-progress.dto.ts
│   ├── global-cognitive-average.dto.ts
│   ├── global-evaluative-average.dto.ts
│   ├── global-motor-average.dto.ts
│   ├── individual-cognitive-average.dto.ts
│   ├── student-progress.dto.ts
│   └── index.ts
└── test/
    ├── doc/
    │   └── README.md                    ← this file
    ├── fixtures/
    │   └── analytics.fixtures.ts        ← shared test fixtures & JWT payloads
    ├── analytics.controller.spec.ts
    ├── analytics.service.spec.ts
    └── analytics.dto.spec.ts
```

---

## Shared Fixtures

**File:** `test/fixtures/analytics.fixtures.ts`

| Export | Purpose |
|---|---|
| `mockUserId`, `mockTargetUserId`, `mockClassId` | Fixed UUID constants for deterministic testing |
| `mockUserJwtPayload` | Standard student/user Keycloak JWT payload (`role: 'user'`) |
| `mockTeacherJwtPayload` | Privileged educator Keycloak JWT payload (`role: 'teacher'`) |
| `mockGlobalCognitiveAverageResponse` | Typed DTO response fixture for global cognitive metrics |
| `mockIndividualCognitiveAverageResponse` | Typed DTO response fixture for individual cognitive metrics |
| `mockClassProgressResponse` | Typed DTO response fixture for class progress |
| `mockStudentProgressResponse` | Typed DTO response fixture for student progress |
| `mockGlobalMotorAverageResponse` | Typed DTO response fixture for motor game metrics |
| `mockGlobalEvaluativeAverageResponse` | Typed DTO response fixture for evaluative game metrics |

---

## Spec Coverage

### 1. `analytics.dto.spec.ts`

Validates runtime field types and constraints using `class-validator` and `class-transformer`.

| DTO Tested | Validations Tested |
|---|---|
| `GlobalCognitiveAverageDto` | Validates numeric properties (`accuracy`, `reaction_time`, `cognitive_load`, `memory_retention`, `attention_span`); rejects non-numeric types. |
| `IndividualCognitiveAverageDto` | Inherits global metrics; validates string `user_id`; rejects invalid type IDs. |
| `ClassProgressDto` | Validates `class_id` string and `progress` number. |
| `StudentProgressDto` | Validates `student_id` string and `progress` number. |
| `GlobalMotorAverageDto` | Validates `average_score` and `completed_quickly_rate` numbers. |
| `GlobalEvaluativeAverageDto` | Validates `success_rate` number. |

---

### 2. `analytics.service.spec.ts`

Validates database aggregate queries and calculations with mock `PrismaService`.

| Method | Scenario | Expected Behaviour |
|---|---|---|
| `getGlobalCognitiveAverage` | No dates passed | Applies default 30-day lookback window (`gte: Date`) |
| `getGlobalCognitiveAverage` | `startDate` & `endDate` passed | Parses ISO/date strings; sets `endDate` bound to `23:59:59.999Z` for full-day inclusion |
| `getGlobalCognitiveAverage` | Aggregate returns `null` | Returns fallback default object with `0` values |
| `getIndividualCognitiveAverage` | Valid `userId` | Aggregates metrics specifically for `user_id` |
| `getIndividualCognitiveAverage` | User has no records | Returns `user_id` and zero fallback values |
| `getClassProgress` | Valid `classId` | Filters content progress by `userStructures` relationship |
| `getStudentProgress` | Valid `studentId` | Aggregates content progress for given student ID |
| `getGlobalMotorAverage` | Attempts exist | Calculates `average_score` and `completed_quickly_rate` (quick count / total count) |
| `getGlobalMotorAverage` | 0 total attempts | Prevents division by zero; returns score `0` and rate `0` |
| `getGlobalEvaluativeAverage` | Attempts exist | Calculates `success_rate` (correct count / total count) |
| `getGlobalEvaluativeAverage` | 0 total attempts | Returns `success_rate: 0` |

---

### 3. `analytics.controller.spec.ts`

Validates NestJS routing, parameter mapping, and security/role authorization logic.

| Endpoint | Scenario | Result |
|---|---|---|
| `GET /analytics/global-average` | Query parameters `startDate`, `endDate` | Delegates to `AnalyticsService` with parsed queries |
| `GET /analytics/individual-average/:userId` | Requesting user's own data (`sub === userId`) | Allows request instantly without database lookup |
| `GET /analytics/individual-average/:userId` | Educator accessing student data (`role: 'teacher'` / `'admin'`) | Queries DB, confirms role, and returns service data |
| `GET /analytics/individual-average/:userId` | Regular user accessing another user data (`role: 'user'`) | Throws `UnauthorizedException` (401) |
| `GET /analytics/individual-average/:userId` | Unauthenticated / missing `req.user` | Throws `UnauthorizedException` (401) |
| `GET /analytics/class-progress/:classId` | Class ID parameter | Delegates to `AnalyticsService.getClassProgress()` |
| `GET /analytics/student-progress/:studentId` | Student accessing own progress | Allows request without DB lookup |
| `GET /analytics/student-progress/:studentId` | Educator accessing student progress | Allows request after role validation |
| `GET /analytics/student-progress/:studentId` | Regular user accessing other student progress | Throws `UnauthorizedException` (401) |
| `GET /analytics/global-motor-average` | Endpoint invocation | Delegates to `AnalyticsService.getGlobalMotorAverage()` |
| `GET /analytics/global-evaluative-average` | Endpoint invocation | Delegates to `AnalyticsService.getGlobalEvaluativeAverage()` |

---

## Acceptance Criteria Checklist

- [x] **Controller tests for each endpoint**: All 6 routes tested in `analytics.controller.spec.ts`.
- [x] **Service correct averages with mock data**: Math formulas, zero division edge cases, and date ranges verified in `analytics.service.spec.ts`.
- [x] **DTO structural validation**: All 6 DTOs validated using `class-validator` in `analytics.dto.spec.ts`.
- [x] **All tests green**: 39/39 tests passing cleanly.

---

## Running Tests

Execute analytics test suite only:

```bash
npx jest server/src/app/analytics/test
```

Execute full server test suite:

```bash
npx jest server
```

Via Nx monorepo CLI:

```bash
npx nx test server
```

---

## Conventions

- Code comments, spec descriptions, and documentation are written in **English**.
- Mock fixtures are centralized in `test/fixtures/analytics.fixtures.ts` to enforce DRY principles.
- Controller unit tests override `JwtAuthGuard` and supply mock `req.user` payloads to test role authorization logic in isolation.
