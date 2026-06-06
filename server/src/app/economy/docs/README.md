## Economy Engine

 * This module manages the transactional logic for virtual credits within the platform. It handles everything from validating game sessions and performance-based rewards to ensuring data integrity through atomic transactions and audit logs.
--------------------------------------------------------------------------------------------------------------------
### Key Features:

- Atomicity: Uses Prisma's `$transaction` to ensure the user's balance and the reward transaction log are updated simultaneously.

- Idempotency: Prevents duplicate claims by enforcing a unique `game_session_id` and handling Prisma `P2002` (race-condition safe).

- Security: Implements maximum threshold validation (`MAX_REWARD_THRESHOLD`) to block reward anomalies or potential score fraud.

- Auditing: Automatic recording of every movement within the `audit_log` schema (for traceability/support).

It is worth noting that I focused on deterministic reward calculation and clean separation between business logic (pure functions) and persistence (repository + Prisma), to maximize reliability under real game conditions.

--------------------------------------------------------------------------------------------------------------------
### Module Architecture:

I separated business logic from persistence:
- Controller: Defines the `POST /economy/claim-reward` endpoint and routes authenticated requests to the service.
- Service: Orchestrates business logic, security validations (threshold + idempotency), and exception handling.
- Logic: Pure functions (no dependencies) for credit + XP calculations to enable fast unit testing.
- Repository: Data access layer that encapsulates Prisma queries and executes the atomic `$transaction`.
- DTO: Data Transfer Objects with strict validation.
--------------------------------------------------------------------------------------------------------------------
### Integration of the Motor of Economy ↔ Game Results & Testing

#### Objective Principal

Link the internal Economy Engine with the practical outputs of the games and ensure its reliability through automatic tests.

#### Integration Behavior

The claim flow is designed to be triggered by the game results pipeline (game-engine → economy dispatcher → backend endpoint). When a game finishes, the engine receives `(gameSessionId, score, victory)` and:

**Tables (what each one does, in simple terms):**

- **app_user**: stores the user balance and updates it on reward claim (`credits` + `experience_points`).
- **economy_transaction**: records the awarded reward for each `game_session_id` (idempotency + history).
- **audit_log**: stores a detailed audit entry for the transaction (traceability). 



1. Calculates credits + XP deterministically.
2. Enforces `MAX_REWARD_THRESHOLD` (security).
3. Prevents duplicate claims for the same `gameSessionId` (idempotency + Prisma `P2002`).
4. Persists everything atomically via Prisma `$transaction`:
   - update balance (`app_user`)
   - create economy transaction (`economy_transaction`)
   - write audit entry (`audit_log`)

#### Testing Coverage (Definition of Done)

To meet the reliability criteria, the economy test suite covers both ideal and boundary scenarios:

- **Unit tests (Logic / Pure Functions)**
  - Victory vs participation base rules
  - Bonus calculation with `floor()` behavior
  - Edge cases: `score=0` and `score=1000`
  - Determinism: same inputs → same outputs

- **Unit tests (Service)**
  - Security: rewards above `MAX_REWARD_THRESHOLD` are blocked (`400 BadRequest`)
  - Idempotency: duplicate sessions are rejected (`409 Conflict`)
  - Race-condition safety: Prisma `P2002` mapped to `409 Conflict`
  - Happy path: returns the updated balance + awarded reward

- **Repository tests (Integrity of atomic transaction via mock Prisma)**
  - `$transaction` includes balance update + economy transaction + audit log
  - Rollback expectation when audit step fails
  - FK/unique constraint error handling

- **Controller tests (delegation + error propagation)**
  - Correct delegation to service
  - Proper propagation of `400/409`
  - Participation vs victory scenarios

- **Stress tests (Concurrency simulation)**
  - 10 concurrent claims on the same session → 1 success and 9 conflicts (simulated idempotency)
  - Burst calls across different sessions → successful execution

#### To test (Jest/Nx)

From the project root (workspace):
- `npx nx test server --all --skip-nx-cache`

Note: whithin Nx workspaces, the legacy command, `npx jest server/src/app/economy` may not properly resolve the graph or targets. Using Nx is the recommended path.

#### Local Test Result (pattern Economy)

`npx nx test server --testNamePattern=Economy --runInBand`
- 1 skipped
- 6 passed
- 48 total tests
- 41 passed

--------------------------------------------------------------------------------------------------------------------
### Perez Sofia.

