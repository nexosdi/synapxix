# MB-401
## Economy Engine

 * This module manages the transactional logic for virtual credits within the platform. It handles everything from validating game sessions and performance-based rewards to ensuring data integrity through atomic transactions and audit logs.
--------------------------------------------------------------------------------------------------------------------
### Key Features:

- Atomicity: Uses Prisma's $transaction to ensure the user's balance and the transaction log are updated simultaneously.

- Idempotency: Prevents duplicate claims by validating a unique game_session_id.

- Security: Implements maximum threshold validation to prevent anomalies or potential score fraud.

- Auditing: Automatic recording of every movement within the audit schema of the database.

It is worth noting that I aimed to make efficient use of the previously established schema.prisma. I updated tables as necessary to complete this task, incorporating constructive feedback from the last meeting and focusing on clean code and testing.

--------------------------------------------------------------------------------------------------------------------

### Module Architecture:

I separated business logic from persistence:
- Controller: Defines endpoints and applies security guards (JWT, currently commented out).
- Service: Orchestrates business logic, security validations, and exception handling.
- Logic: Pure functions (no dependencies) for credit calculations, facilitating unit testing.
- Repository: Data access layer that encapsulates Prisma queries.
- DTO: Data Transfer Objects with strict validation.
--------------------------------------------------------------------------------------------------------------------

### Testing:

To ensure reliability in this new engine, I implemented unit and logic tests covering:

- Logic: Verification of correct calculations for victories, losses, and score bonuses.

- Service-Security: Blocking rewards that exceed the MAX_REWARD_THRESHOLD.

- Service-Integrity: Preventing duplicate claims for the same session.

- Service-Flow: Validation of the successful process and return of the new balance.

#### To test:
Navigate from the project root to /server and run: npx jest server/src/app/economy
![terminal](image-2.png)
#### On Postman:
![201](image.png)
POST: http://localhost:3000/api/economy/claim-reward
JSON: {
"gameSessionId": "a343c07a-0f93-4513-ac06-984a5651d135",
"score": 850,
"victory": true
}

This ID was generated via prisma.studio. It is important to emphasize that currently, the following lines in the controller must be commented out:

- import { JwtAuthGuard } from '../auth/jwt-auth.guard';

- @UseGuards(JwtAuthGuard)

- @GetUser('user_id') userId: string,
Also add:

- const UserId = 'a343c07a-0f93-4513-ac06-984a5651d135';
before the return.

Please do not forget to remove these changes once the review is finished, as the auth module is not active.

I implemented the most complete logic possible, integrating JWT and testing as much as I could.

### Schema.prisma Configuration:
The module interacts with the following tables:

- auth.app_user: Updates the credits field.

- core.economy_transaction: Records the reward history (new).

- audit.audit_log: Stores the operation trace for compliance and support.
--------------------------------------------------------------------------------------------------------------------

### OTHERS:

To modify reward logic: economy.logic.ts. Current values:

- Base victory: 100 credits.

- Base Loss: 20 credits.

- Bonus: +1 credit per 10 score points.
--------------------------------------------------------------------------------------------------------------------
### Perez Sofia.

