# Economy Module — Rewards & Store System (Week 2)

## Context

Extension of the existing economy module. The engine already credited balances via `POST /economy/claim-reward`. This week adds the ability to safely debit them through a virtual store where users can purchase cosmetic items (avatars and banners).

---

## New endpoint

### `POST /economy/purchase`

Requires JWT. The `userId` is always extracted from the token, never from the request body.

**Request body:**
```json
{ "itemId": "uuid" }
```

**Response 201:**
```json
{
  "status": "success",
  "purchaseId": "uuid",
  "itemId": "uuid",
  "itemName": "Dragon Avatar",
  "itemType": "avatar",
  "creditsSpent": 200,
  "newBalance": 300,
  "processedAt": "2026-06-12T18:00:00.000Z"
}
```

**Error responses:**

| Code | Cause |
|------|-------|
| 400 | Insufficient funds |
| 404 | Item not found or inactive |
| 409 | User already owns the item |
| 500 | Internal error (transaction failed) |

---

## New tables (migration)

```bash
npx prisma migrate dev --name add_store_and_inventory
```

**`store_item`** — store catalog with name, type (`avatar` | `banner`), price, and active/inactive status.

**`user_inventory`** — tracks which items each user owns. Has a `@@unique([user_id, store_item_id])` constraint that acts as a concurrency safety net.

**`purchase_transaction`** — purchase ledger. Stores balance before and after each transaction for full traceability.

---

## Purchase flow

```
1. Verify item exists and is active                    → 404 if not
2. Fetch current user balance                          → 404 if user not found
3. validatePurchase(balance, price)                    → 400 if insufficient
4. Verify user does not already own the item           → 409 if owned
5. prisma.$transaction:
   a. updateMany WHERE credits >= price → decrement    → INSUFFICIENT_FUNDS if count=0
   b. findUnique to get post-decrement balance
   c. userInventory.create                             → P2002 if race condition
   d. purchaseTransaction.create
   e. auditLog.create
```

If any step inside the `$transaction` fails, Prisma rolls back everything.

---

## Concurrency protection

Three layers in execution order:

1. **In-memory pre-check** — `validatePurchase` compares balance against price before touching the DB.
2. **DB double-check** — `updateMany WHERE credits >= price` ensures the decrement only happens if the balance is still sufficient at the exact moment of the UPDATE. If another request drained the balance between step 1 and this one, `count` returns 0 and `INSUFFICIENT_FUNDS` is thrown.
3. **Unique constraint** — `@@unique([user_id, store_item_id])` on `user_inventory` guarantees that two concurrent requests that pass both previous checks can only insert one row. The second receives P2002 → 409.

---

## Tests

```bash
# Unit + repository tests
npx jest server/src/app/economy/test/economy.purchase.spec.ts --runInBand

# Stress & concurrency tests
npx jest server/src/app/economy/test/economy.stress.spec.ts --runInBand
```

**`economy.purchase.spec.ts`** — 32 tests:
- Pure logic for `validatePurchase` (5 cases)
- Service: happy path, all error cases, Prisma error mapping, `INSUFFICIENT_FUNDS`, `USER_NOT_FOUND` (10 cases)
- Repository: `findActiveStoreItem`, `findUserInventoryItem`, `createPurchaseTransaction` atomicity, rollback, P2002/P2003 propagation (17 cases)

**`economy.stress.spec.ts`** — 11 tests:
- Concurrency: 10 and 50 simultaneous requests for the same item → only 1 succeeds
- Burst: 100 requests for different items → all succeed
- Balance edge cases: exact balance, balance-1, balance 0
- Inactive/non-existent item
- Rollback on DB crash
- Sequential idempotency
- Double-check: balance drained between pre-check and transaction

**Total: 43 tests, 0 failures.**

---

### Perez Sofia.