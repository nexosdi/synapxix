# Rewards Shop (Synapxix) — Rewards Shop 

A simple e-commerce module where students spend **virtual credits** to unlock **avatars** and **banners**.

> Focus of this README: **Real integration** with the backend economy service and historical testing details.

---

## Architecture

### Frontend

```txt
shop.component.ts
  ├─ shop-balance.component.ts         (UI: displays credits balance)
  ├─ shop-item-card.component.ts      (UI: item card for avatars/banners)
  ├─ economy-store.service.ts        (real HttpClient: getBalance(), purchase())
  ├─ services/
  │    └─ http-store-items.provider.ts (real HttpClient: getItems())
  └─ models/
       ├─ store-item.model.ts
       └─ store-items-provider.token.ts
```

**How the interaction flows**:

1. `shop.component.ts` loads items via `HttpStoreItemsProvider` (using the injection token `STORE_ITEMS_PROVIDER`).
2. Calls `EconomyStoreService.getBalance()` to render the credits balance.
3. On purchase, calls `EconomyStoreService.purchase(itemId)`.
4. Updates the balance reactively using Angular Signals after a successful purchase.

### Backend — `economy` module

- `EconomyController` (`@Controller('economy')` protected with `JwtAuthGuard`):
  - `GET /economy/items` → `StoreItem[]` (lists all active store items from DB)
  - `GET /economy/balance` → `BalanceResponseDto { credits, experience_points }`
  - `POST /economy/purchase` → `PurchaseDto { itemId: string (UUID) }`
    → `PurchaseResponseDto { status, purchaseId, itemId, itemName, itemType, creditsSpent, newBalance, processedAt }`
  - `POST /economy/claim-reward` → `ClaimRewardDto { gameSessionId: UUID, score: number (0-1000), victory: boolean }`
    → `ClaimRewardResponseDto { status, transactionId, balance: {credits, experience_points}, reward: {credits, xp}, processedAt }`

- `EconomyService`:
  - validates funds
  - avoids duplicates (transaction/inventory)
  - calculates rewards (`calculateGameReward`, `calculateXP` in `economy.logic.ts`)
  - handles Prisma errors (e.g. `P2002` already exists/duplicate, `P2003` FK not found)

- `EconomyRepository`:
  - uses Prisma `$transaction` for atomic updates:
    - deduct credits
    - create inventory record
    - write audit log
  - uses `updateMany` with a condition (`credits >= price`) to mitigate race conditions for concurrent purchases

**Tables involved**:
- `app_user`
- `store_item`
- `user_inventory`
- `purchase_transaction`
- `economy_transaction`
- `audit_log`

---

## Endpoints consumed

| Method | Route | Request body | Response (high-level) | Possible errors |
|---|---|---|---|---|
| GET | `/economy/items` | — | `StoreItem[]` | — |
| GET | `/economy/balance` | — | `BalanceResponseDto { credits, experience_points }` | — |
| POST | `/economy/purchase` | `PurchaseDto { itemId: string (UUID) }` | `PurchaseResponseDto { status, purchaseId, itemId, itemName, itemType, creditsSpent, newBalance, processedAt }` | `INSUFFICIENT_FUNDS` (400), `ALREADY_OWNED` (409), `ITEM_NOT_FOUND` (404), `UNKNOWN` |
| POST | `/economy/claim-reward` | `ClaimRewardDto { gameSessionId: UUID, score: number (0-1000), victory: boolean }` | `ClaimRewardResponseDto { status, transactionId, balance: {credits, experience_points}, reward: {credits, xp}, processedAt }` | (depends on backend error mapping) |

---

## Connection Status: Live Backend (Fullstack)

Previously, local mocks (`MockEconomyStoreService` and `MockStoreItemsProvider`) were used to simulate purchases and item listings without requiring an authenticated user (JWT) or a running database.

Those mocks have been completely removed and replaced with the real HTTP services querying the backend.

To test the complete flow:
1. Ensure the backend (NestJS) is running.
2. The user must be authenticated with a valid JWT token, as all `/economy` endpoints are protected by the `JwtAuthGuard`.

---

## Definition of Done (DoD)

- [x] Shop UI with implemented components (cards, balance, filters/skeleton/loading)
- [x] Purchase integration against `POST /economy/purchase` including error mapping: `INSUFFICIENT_FUNDS`, `ALREADY_OWNED`, `ITEM_NOT_FOUND`
- [x] Reactive balance update using Angular Signals after a successful purchase
- [x] Testing infrastructure enabled with a temporary mock of `EconomyStoreService`
- [x] Test purchase flows with a **real authenticated (JWT) user** against the DB
- [x] Revert the mock before merging to production:
  - [x] remove `mock-economy-store.service.ts`
  - [x] remove the `providers` override from `shop.component.ts`
