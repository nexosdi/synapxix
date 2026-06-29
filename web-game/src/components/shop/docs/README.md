# Rewards Shop (Synapxix) — Rewards Shop (Tienda de Recompensas)

A simple e-commerce module where students spend **virtual credits** to unlock **avatars** and **banners**.

> Focus of this README: **testing infrastructure** and how to walk through scenarios using mocks.

---

## Architecture

### Frontend

```txt
shop.component.ts
  ├─ shop-balance.component.ts        (UI: displays credits balance)
  ├─ shop-item-card.component.ts     (UI: item card for avatars/banners)
  ├─ economy-store.service.ts       (real HttpClient: getBalance(), purchase())
  ├─ mock-economy-store.service.ts  (MOCK TEMPORARY for testing)
  │    ├─ getBalance() -> fixed credits
  │    └─ purchase() -> simulates outcomes
  └─ models/
       ├─ store-item.model.ts
       └─ store-items-provider.token.ts
```

**How the interaction flows**:

1. `shop.component.ts` loads/sorts/filters items (via provider/token).
2. Calls `EconomyStoreService.getBalance()` to render the credits balance.
3. On purchase, calls `EconomyStoreService.purchase(itemId)`.
4. Updates the balance reactively using Angular Signals after a successful purchase.

### Backend — `economy` module

- `EconomyController` (`@Controller('economy')` protected with `JwtAuthGuard`):
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

**Tables involved (inferred)**:
- `app_user`
- `storeItem`
- `userInventory`
- `purchaseTransaction`
- `economyTransaction`
- `auditLog`

---

## Endpoints consumed

| Method | Route | Request body | Response (high-level) | Possible errors |
|---|---|---|---|---|
| GET | `/economy/balance` | — | `BalanceResponseDto { credits, experience_points }` | — |
| POST | `/economy/purchase` | `PurchaseDto { itemId: string (UUID) }` | `PurchaseResponseDto { status, purchaseId, itemId, itemName, itemType, creditsSpent, newBalance, processedAt }` | `INSUFFICIENT_FUNDS` (400), `ALREADY_OWNED` (409), `ITEM_NOT_FOUND` (404), `UNKNOWN` |
| POST | `/economy/claim-reward` | `ClaimRewardDto { gameSessionId: UUID, score: number (0-1000), victory: boolean }` | `ClaimRewardResponseDto { status, transactionId, balance: {credits, experience_points}, reward: {credits, xp}, processedAt }` | (depends on backend error mapping) |

---

## Status: using mocked data (TEMPORARY)

To test the UI without relying on a real JWT-authenticated user against the DB, `shop.component.ts` includes a temporary `providers` override:

- `{ provide: EconomyStoreService, useClass: MockEconomyStoreService }`

This mock (`mock-economy-store.service.ts`) simulates:
- `getBalance()` → returns **300 fixed credits**
- `purchase()` → simulates:
  - successful purchase
  - insufficient funds
  - item already owned
  - item not found

Why this exists:
- The current testing/infrastructure setup doesn’t yet provide a stable way to generate a real authenticated user (JWT + DB) for UI testing.

### How to revert the mock (EXACT steps)

1. Delete the mock file:
   - `web-game/src/components/shop/services/mock-economy-store.service.ts`
2. Edit `web-game/src/components/shop/shop.component.ts` and remove the temporary `providers` override.

Specifically, remove the **two lines** that bind `EconomyStoreService` to `MockEconomyStoreService`.

Reference (do not copy blindly; confirm against your local file):

```ts
// TODO: remove the exact 2 lines from providers
{ provide: EconomyStoreService, useClass: MockEconomyStoreService }
```

---

## How to test different scenarios (using the mock)

All scenarios are controlled from `MockEconomyStoreService` (`mock-economy-store.service.ts`).

### Successful purchase
- Ensure the chosen `itemId` has a price `<= mockCredits`.
- Ensure the chosen `itemId` is **not** present in `mockOwnedItemIds`.

### Insufficient funds
- Increase the item price (or decrease `mockCredits`).
- Ensure the chosen `itemId` has a price `> mockCredits`.

### Already owned (ALREADY_OWNED)
- Add the chosen `itemId` to `mockOwnedItemIds`.
- Call `purchase(itemId)`.

### Item not found (ITEM_NOT_FOUND)
- Call `purchase(itemId)` with an `itemId` that the mock considers inactive/non-existent.

---

## Definition of Done (DoD)

- [x] Shop UI with implemented components (cards, balance, filters/skeleton/loading)
- [x] Purchase integration against `POST /economy/purchase` including error mapping: `INSUFFICIENT_FUNDS`, `ALREADY_OWNED`, `ITEM_NOT_FOUND`
- [x] Reactive balance update using Angular Signals after a successful purchase
- [x] Testing infrastructure enabled with a temporary mock of `EconomyStoreService`
- [ ] Test purchase flows with a **real authenticated (JWT) user** against the DB
- [ ] Revert the mock before merging to production:
  - [ ] remove `mock-economy-store.service.ts`
  - [ ] remove the `providers` override from `shop.component.ts`

