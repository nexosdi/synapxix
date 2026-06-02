# 📊 Economy Module — Documentación Completa



## 🎯 Descripción General

El módulo **Economy** implementa un sistema de recompensas gamificado para Synapxix. Procesa resultados de juegos y otorga créditos + XP de forma **atómica, idempotente y segura**.

### Responsabilidades Principales

1. Procesar eventos finales de juegos (victory / participation)
2. Calcular recompensas (créditos + XP) basadas en score
3. Persistir transacciones con auditoría completa
4. Garantizar atomicidad (todo se guarda o nada)
5. Prevenir doble reclamación (idempotencia)

---

## 🏗️ Arquitectura

### Clean Architecture Layers

```
┌─────────────────────────────────────────────────────────┐
│             EconomyController (HTTP)                    │
│          POST /economy/claim-reward                      │
└────────────────┬────────────────────────────────────────┘
                 │ DTO Validation (class-validator)
                 ▼
┌─────────────────────────────────────────────────────────┐
│           EconomyService (Orchestration)                │
│  - Validaciones de negocio                              │
│  - Cálculo de recompensas                               │
│  - Mapeo de errores Prisma → HTTP                       │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│          EconomyRepository (Data Layer)                 │
│  - Prisma $transaction (atomicidad)                     │
│  - Increment credits + XP                              │
│  - Create EconomyTransaction + AuditLog                │
└────────────────┬────────────────────────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────────────────────────┐
│              Prisma ORM (PostgreSQL)                    │
│  Schema multi-tenant:                                  │
│  - core: EconomyTransaction, GameSession, GameAttempt  │
│  - auth: app_user (credits, experience_points)         │
│  - audit: AuditLog (todas las transacciones)          │
└─────────────────────────────────────────────────────────┘
```

### Patrón de Integración

```
Frontend (EconomyBridgeService)
         ↓
    HttpEconomyDispatcher
         ↓
POST /economy/claim-reward
         ↓
EconomyService → Validación
         ↓
EconomyRepository → $transaction
         ↓
Prisma: app_user.update + EconomyTransaction.create + AuditLog.create
         ↓
200 OK + ClaimRewardResponseDto
o
 4xx/5xx (mapped from Prisma error)
```

---

## Componentes

### 1. **EconomyController**

**Archivo**: `server/src/app/economy/economy.controller.ts`

**Responsabilidades**:
- Exponer endpoint REST: `POST /economy/claim-reward`
- Guardia JWT: solo usuarios autenticados
- Extraer `user_id` del JWT
- Delegar al servicio

**Endpoint**:
```http
POST /economy/claim-reward
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json

{
  "gameSessionId": "550e8400-e29b-41d4-a716-446655440001",
  "score": 150,
  "victory": true
}
```

---

### 2. **EconomyService**

**Archivo**: `server/src/app/economy/economy.service.ts`

**Responsabilidades**:
- Orquestar el flujo de recompensas
- Validar límites de seguridad (`MAX_REWARD_THRESHOLD = 500`)
- Verificar idempotencia (session ya reclamada o no)
- Mapear errores Prisma a excepciones HTTP

**Métodos**:
- `processGameReward(userId: string, dto: ClaimRewardDto): Promise<any>`
  - Calcula recompensa vía `calculateGameReward()` + `calculateXP()`
  - Verifica `MAX_REWARD_THRESHOLD` (badRequest si supera)
  - Busca transacción existente (conflictException si existe)
  - Llama repository para persistir
  - Maneja Prisma P2002 → 409 Conflict

---

### 3. **EconomyRepository**

**Archivo**: `server/src/app/economy/economy.repository.ts`

**Responsabilidades**:
- Ejecutar transacción atómica (Prisma `$transaction`)
- Incrementar `app_user.credits` + `app_user.experience_points`
- Crear registro en `EconomyTransaction`
- Crear registro de auditoría en `AuditLog`

**Métodos**:
- `findTransactionBySessionId(sessionId: string)`
  - Busca si el session ya fue reclamado
- `createRewardTransaction(userId, data)` (alias: `createTransactionAndAwardCredits` for backwards compatibility)
  - Ejecuta `$transaction` con 3 operaciones:
    1. `app_user.update({ credits ↑, xp ↑ })`
    2. `economyTransaction.create({ ... })`
    3. `auditLog.create({ ... })`

---

### 4. **Economy Logic**

**Archivo**: `server/src/app/economy/logic/economy.logic.ts`

**Responsabilidades**:
- Cálculos deterministas de recompensas
- Fórmulas de créditos y XP

**Funciones**:

#### `calculateGameReward(victory: boolean, score: number): number`

Fórmula de créditos:
```
IF victory:
  base = 100
  bonus = floor(score / 10)
  total = base + bonus  // 100-200
ELSE (participation):
  base = 20
  bonus = floor(score / 10)
  total = base + bonus  // 20-120

Rango: 20-200 créditos
```

#### `calculateXP(victory: boolean, score: number): number`

Fórmula de XP:
```
IF victory:
  base = 50
  bonus = floor(score / 20)
  total = base + bonus  // 50-100
ELSE (participation):
  base = 10
  bonus = floor(score / 50)
  total = base + bonus  // 10-30

Rango: 10-100 XP
```

---

##  Flujo de Datos

### Happy Path (Success)

```
1. Frontend completa juego
   → EconomyBridgeService.processGameResult(sessionId, result)

2. EconomyBridgeService valida si el juego es rewarded
   → Excluye tipos como "avatar"

3. Traduce AnyGameResult → EconomyClaimPayload
   {
     gameSessionId: "session-123",
     score: 150,
     victory: true
   }

4. HttpEconomyDispatcher.dispatch(payload)
   → POST /economy/claim-reward

5. EconomyController.claimReward(userId, dto)
   → JWT guard valida autenticación

6. EconomyService.processGameReward(userId, dto)
   ✓ calculateGameReward(true, 150) = 115 créditos
   ✓ calculateXP(true, 150) = 57 XP
   ✓ Validar 115 < 500 ✓
   ✓ findTransactionBySessionId("session-123") = null ✓
   → Llamar repository

7. EconomyRepository.createRewardTransaction()
   $transaction:
     a) app_user UPDATE:
        credits: 100 → 215
        experience_points: 1000 → 1057
     b) economyTransaction INSERT:
        transaction_id, user_id, game_session_id, credits_awarded, xp_awarded, reward_type
     c) auditLog INSERT:
        Detalles completos de la transacción

8. Respuesta: HTTP 200 OK
   {
     "status": "success",
     "transactionId": "tx-abc-123",
     "balance": {
       "credits": 215,
       "experience_points": 1057
     },
     "reward": {
       "credits": 115,
       "xp": 57
     }
   }
```

### Error Path (Duplicate Claim)

```
1-5. Igual al happy path

6. EconomyService.processGameReward(userId, dto)
   → findTransactionBySessionId("session-123") ≠ null
   → Throw ConflictException (409)

7. Exception Handler (NestJS)
   → HTTP 409 Conflict
   {
     "statusCode": 409,
     "message": "Reward already claimed for session: session-123"
   }
```

### Error Path (Security Limit Exceeded)

```
1-5. Igual

6. EconomyService.processGameReward(userId, dto)
   ✓ calculateGameReward(true, 4010) = 501
   ✗ 501 > 500 → Throw BadRequestException (400)

7. HTTP 400 Bad Request
   {
     "statusCode": 400,
     "message": "Reward exceeds allowed limits"
   }
```

---

##  DTOs & Validación

### ClaimRewardDto (INPUT)

**Archivo**: `server/src/app/economy/dto/claim.reward.dto.ts`

```typescript
export class ClaimRewardDto {
  @IsUUID()
  gameSessionId!: string;  // UUID del session

  @IsInt()
  @Min(0)
  @Max(1000)
  score!: number;       

  @IsBoolean()
  victory!: boolean;   
}
```

**Validaciones**:
- `gameSessionId`: Formato UUID válido
- `score`: Integer, rango 0-1000 (inclusive)
- `victory`: Boolean strictly

---

### ClaimRewardResponseDto (OUTPUT)

**Archivo**: `server/src/app/economy/dto/claim-reward-response.dto.ts`

```typescript
export class ClaimRewardResponseDto {
  status: 'success' | 'pending';
  
  transactionId: string;           // UUID único de transacción
  
  balance: {
    credits: number;               
    experience_points: number;     
  };
  
  reward: {
    credits: number;               )
    xp: number;                    
  };
  
  processedAt?: string;          
}
```

---

## 🎯 Reglas de Negocio

### Tabla de Recompensas

| Escenario | Credits (Base) | Credits (Bonus) | XP (Base) | XP (Bonus) | Total Credits | Total XP |
|-----------|---|---|---|---|---|---|
| **Victory, Score=0** | 100 | 0 | 50 | 0 | 100 | 50 |
| **Victory, Score=100** | 100 | 10 | 50 | 5 | 110 | 55 |
| **Victory, Score=150** | 100 | 15 | 50 | 7 | 115 | 57 |
| **Victory, Score=1000** | 100 | 100 | 50 | 50 | 200 | 100 |
| **Participation, Score=0** | 20 | 0 | 10 | 0 | 20 | 10 |
| **Participation, Score=50** | 20 | 5 | 10 | 1 | 25 | 11 |
| **Participation, Score=500** | 20 | 50 | 10 | 10 | 70 | 20 |
| **Participation, Score=1000** | 20 | 100 | 10 | 20 | 120 | 30 |

### Límites de Seguridad

| Parámetro | Valor | Razón |
|-----------|-------|-------|
| `MAX_REWARD_THRESHOLD` (credits) | 500 | Prevenir exploits de score alto |
| `MAX_REWARD_THRESHOLD` (XP) | 100 | Implícito en fórmula (victory + score=1000) |
| `DTO Max Score` | 1000 | Límite superior razonable para juegos |
| `DTO Min Score` | 0 | Participación válida (perder también recompensa) |

### Regla de Idempotencia

**Constraint**: `UNIQUE(game_session_id)` en `EconomyTransaction`

- Primera reclamación de session-123 → **200 OK**
- Segunda reclamación de session-123 → **409 Conflict** (Prisma P2002)
- Tercera reclamación de session-123 → **409 Conflict** (verificado antes)

Beneficio: Safe retry pattern. Si el cliente reintentas (network timeout), no duplica recompensas.

---

##  Testing

### Arquitectura de Tests

```
┌─────────────────────────────────────────────────────────┐
│  economy.logic.spec.ts (Unit — Pure Functions)          │
│  - calculateGameReward: 8 tests                         │
│  - calculateXP: 8 tests                                 │
│  Total: 16 tests                                        │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  economy.service.spec.ts (Unit — Mock Repository)       │
│  - Idempotency, security limits, Prisma errors          │
│  - Happy path                                           │
│  Total: 8 tests                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  economy.repository.spec.ts (Integration — Mock Prisma) │
│  - Atomicity, rollback, FK errors, P2002               │
│  Total: 4 tests                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  economy.controller.spec.ts (E2E — Mock Service)        │
│  - Valid request, 409, 400, participation, user_id      │
│  Total: 5 tests                                         │
└─────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────┐
│  economy.stress.spec.ts (Concurrency & Edge Cases)      │
│  - 10 concurrent claims same session → 1 success        │
│  - 100 burst different sessions → all success           │
│  - Boundary scores + high scores                        │
│  Total: 3 tests                                         │
└─────────────────────────────────────────────────────────┘

TOTAL: 36+ Tests | Coverage Target: >80%
```

### Ejecución de Tests

```bash
# Todos los tests del proyecto
npx nx test server

npx nx test server --testFile=economy

npx nx test server --coverage

npx nx test server --watch
```

### Test Cases Clave

#### Logic Tests (`calculateGameReward` + `calculateXP`)

```typescript
✓ should award 115 credits for victory + 150 score
✓ should award 25 credits for participation + 50 score
✓ boundary: score=0 → base only
✓ boundary: score=1000 → max (200 / 100)
✓ determinism: f(150) = f(150)
✓ bonus calculation: floor behavior
```

#### Service Tests (Idempotency & Security)

```typescript
✓ processGameReward: happy path (200 OK)
✓ ConflictException: duplicate session (409)
✓ BadRequestException: reward > 500 (400)
✓ Prisma P2002 mapped to 409 Conflict
✓ Prisma P2003 (FK) handled
```

#### Repository Tests (Atomicity)

```typescript
✓ $transaction completes: credits + XP + audit
✓ rollback: if audit fails, credits NOT incremented
✓ P2002 caught and rethrown
✓ P2003 (FK violation) handled
```

#### Controller Tests (HTTP)

```typescript
✓ 200 OK: valid JWT + DTO
✓ 409: duplicate gameSessionId
✓ 400: reward exceeds threshold
✓ 200: participation (victory=false)
```

#### Stress Tests (Concurrency)

```typescript
✓ 10 concurrent claims same session → 1 success, 9 × 409
✓ 100 rapid requests different sessions → all 200
✓ Boundary scores (0 + 1000) in parallel
```

---

## Integración Game Engine

### Arquitectura de Integración

```
Frontend (web-game)
    ↓
GameComponent emite result
    ↓
EconomyBridgeService.processGameResult(sessionId, result)
    (En libs/game-engine/core)
    ↓
Filter: excluir juegos no rewardables (e.g., "avatar")
    ↓
Traducir AnyGameResult → EconomyClaimPayload
    {
      gameSessionId: sessionId,
      score: result.score,
      victory: result.isCorrect
    }
    ↓
HttpEconomyDispatcher.dispatch(payload)
    ↓
POST /economy/claim-reward (al backend)
    ↓
EconomyService procesa
    ↓
ok Respuesta o Error
```

### Flow de Datos

**AnyGameResult** (output del juego):
```typescript
interface AnyGameResult {
  gameType: GameType;           // "intruder", "memory", "match", etc.
  answer: any;                  // Respuesta dada
  isCorrect: boolean;           // ¿Es correcta?
  score: number;                // Puntuación
  timeSpentMs: number;          // Tiempo en ms
}
```

**Juegos NO recompensados** (`NON_REWARDED_GAME_TYPES`):
```typescript
['avatar']  
```

**EconomyClaimPayload** (enviado al backend):
```typescript
interface EconomyClaimPayload {
  gameSessionId: string;  
  score: number;          
  victory: boolean;       
}
```

### Ejemplo Completo

```typescript
// En web-game component
const gameResult: AnyGameResult = {
  gameType: 'intruder',
  answer: { selectedItemId: '4' },
  isCorrect: true,
  score: 150,
  timeSpentMs: 2000
};

// Bridge service (Angular service inyectado)
economyBridge.processGameResult('session-123', gameResult);
// (Fire-and-forget, no bloquea UI)

// Internamente:
// 1. 'intruder' ∉ NON_REWARDED_GAME_TYPES → proceder
// 2. Construir payload:
//    { gameSessionId: 'session-123', score: 150, victory: true }
// 3. dispatcher.dispatch(payload)
// 4. POST /economy/claim-reward + JWT del usuario
// 5. Backend responde (usuario recibe 115 créditos + 57 XP)
```

---

##  Manejo de Errores

### Errores de DTO (400 Bad Request)

| Código | Razón | Ejemplo |
|--------|-------|---------|
| `@IsUUID()` fail | gameSessionId no es UUID | `"invalid-id"` |
| `@IsInt()` fail | score no es integer | `150.5` |
| `@Min(0)` fail | score < 0 | `-10` |
| `@Max(1000)` fail | score > 1000 | `1001` |
| `@IsBoolean()` fail | victory no es boolean | `"true"` (string) |

**Response HTTP**:
```json
{
  "statusCode": 400,
  "message": "Bad Request",
  "error": [
    "score must be an integer number",
    "score must not be greater than 1000"
  ]
}
```

### Errores de Negocio (400 Bad Request)

| Error | Causa | Mensaje |
|-------|-------|---------|
| `BadRequestException` | `calculateGameReward()` > 500 | `"Reward exceeds allowed limits"` |

---

### Errores de Idempotencia (409 Conflict)

| Error | Causa | Mensaje |
|-------|-------|---------|
| `ConflictException` | `findTransactionBySessionId()` ≠ null | `"Reward already claimed for session: {id}"` |
| `ConflictException` | Prisma P2002 (race condition) | `"Reward already claimed for this session"` |

**Response HTTP**:
```json
{
  "statusCode": 409,
  "message": "Conflict",
  "error": "Reward already claimed for session: 550e8400-e29b-41d4-a716-446655440001"
}
```

---

### Errores de Base de Datos (4xx / 5xx)

| Código Prisma | HTTP | Mapeo | Mensaje |
|---|---|---|---|
| P2002 | 409 | `ConflictException` | "Reward already claimed for this session" |
| P2003 | 404 / 500 | `InternalServerErrorException` | "Transaction failed" |
| P2004 | 500 | `InternalServerErrorException` | "Transaction failed" |
| Otros | 500 | `InternalServerErrorException` | "Transaction failed" |

**Response HTTP (5xx)**:
```json
{
  "statusCode": 500,
  "message": "Internal Server Error",
  "error": "Transaction failed"
}
```

---

### Autenticación (401 Unauthorized)

| Caso | Razón |
|------|-------|
| No JWT | Falta header `Authorization: Bearer <token>` |
| JWT inválido | Token expirado, firmado incorrectamente, etc. |
| JWT sin user_id | Payload sin claim `user_id` |

**Response HTTP**:
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

---

##  Setup & Migrations

### Prerequisitos

- PostgreSQL ≥ 14
- Node.js ≥ 22.12.0
- npm ≥ 10.9.0
- Prisma CLI

### Schema Changes

**Cambios principales**:

1. **app_user**: +`experience_points INT DEFAULT 0`
2. **EconomyTransaction**: +`xp_awarded INT`, rename `amount` → `credits_awarded`, rename `type` → `reward_type`
3. **GameSession**: +`economyTransaction` relation

### Migration

```bash
# Crear y ejecutar migration
cd /home/soperez/Documentos/2026/pet/synapxix

npx prisma migrate dev --name add_xp_and_game_session_fk_to_economy

# Output:
# ✓ Created migration: migrations/[timestamp]_add_xp_and_game_session_fk_to_economy/migration.sql
# ✓ Your database has been successfully migrated
```

### Verificación

```bash
npx prisma validate
npx prisma generate
npx prisma studio
```

---

##  Ejemplos de Uso

### Caso 1: Usuario gana juego con score alto

```bash
POST /economy/claim-reward
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
Content-Type: application/json

{
  "gameSessionId": "550e8400-e29b-41d4-a716-446655440000",
  "score": 800,
  "victory": true
}
```

**Cálculos**:
- Credits: 100 + floor(800/10) = 100 + 80 = **180**
- XP: 50 + floor(800/20) = 50 + 40 = **90**
- 180 < 500 ✓

**Respuesta (200 OK)**:
```json
{
  "status": "success",
  "transactionId": "a1b2c3d4-e5f6-47g8-h9i0-j1k2l3m4n5o6",
  "balance": {
    "credits": 580,
    "experience_points": 1490
  },
  "reward": {
    "credits": 180,
    "xp": 90
  },
  "processedAt": "2026-06-02T15:30:45.123Z"
}
```

---

### Caso 2: Usuario intenta reclamar dos veces

```bash
# Primera reclamación (exitosa)
POST /economy/claim-reward
Authorization: Bearer token...
{
  "gameSessionId": "session-123",
  "score": 150,
  "victory": true
}

# Response: 200 OK + transactionId: tx-1

# Segunda reclamación (mismo session)
POST /economy/claim-reward
Authorization: Bearer token...
{
  "gameSessionId": "session-123",  ← mismo session
  "score": 200,
  "victory": true
}
```

**Respuesta (409 Conflict)**:
```json
{
  "statusCode": 409,
  "message": "Conflict",
  "error": "Reward already claimed for session: session-123"
}
```

---

### Caso 3: Score inválido (supera threshold)

```bash
POST /economy/claim-reward
Authorization: Bearer token...
{
  "gameSessionId": "session-456",
  "score": 4010,         ← 100 + floor(4010/10) = 501 > 500
  "victory": true
}
```

**Cálculo**:
- Credits: 100 + 401 = **501** > 500 ❌

**Respuesta (400 Bad Request)**:
```json
{
  "statusCode": 400,
  "message": "Bad Request",
  "error": "Reward exceeds allowed limits"
}
```

---

### Caso 4: Participación (pérdida)

```bash
POST /economy/claim-reward
Authorization: Bearer token...
{
  "gameSessionId": "session-789",
  "score": 300,
  "victory": false       ← Participación
}
```

**Cálculos**:
- Credits: 20 + floor(300/10) = 20 + 30 = **50**
- XP: 10 + floor(300/50) = 10 + 6 = **16**
- 50 < 500 ✓

**Respuesta (200 OK)**:
```json
{
  "status": "success",
  "transactionId": "tx-part-001",
  "balance": {
    "credits": 370,
    "experience_points": 1216
  },
  "reward": {
    "credits": 50,
    "xp": 16
  }
}
```

---

##  Edge Cases

### Edge Case 1: Score = 0

- Victory → 100 créditos, 50 XP (base only)
- Participation → 20 créditos, 10 XP (base only)
- Válido: usuario recibe recompensa por participar

**Regla**: Incluso perder otorga créditos (incentivo a jugar)

---

### Edge Case 2: Score = 1000 (máximo DTO)

- Victory → 100 + 100 = **200 créditos**, 50 + 50 = **100 XP**
- Participation → 20 + 100 = **120 créditos**, 10 + 20 = **30 XP**
- Ambos < 500 créditos ✓

**Regla**: Score máximo permitido no causa problemas

---

### Edge Case 3: Transacción en paralelo (race condition)

**Escenario**: 2 requests simultáneos, mismo `gameSessionId`

```
Request 1: findTransactionBySessionId("s1") → null
Request 2: findTransactionBySessionId("s1") → null
Request 1: economyTransaction.create(s1) → SUCCESS
Request 2: economyTransaction.create(s1) → PRISMA P2002 (unique constraint)
```

**Solución**: Prisma `$transaction` + unique constraint + P2002 mapeo

```typescript
// En EconomyService.handleError()
if (error.code === 'P2002') {
  throw new ConflictException('Reward already claimed for this session');
}
```

**Resultado**: Request 2 → 409 Conflict (safe)

---

### Edge Case 4: Usuario no existe

**Escenario**: `user_id` no válido o eliminado

```typescript
// Repository $transaction
await tx.app_user.update({
  where: { user_id: 'invalid-user' },
  data: { credits: { increment: 100 } }
});
// → Prisma P2025 (record not found)
```

**Mapeo**: `InternalServerErrorException` (500)

```json
{
  "statusCode": 500,
  "message": "Internal Server Error",
  "error": "Transaction failed"
}
```

---

### Edge Case 5: AuditLog falla (rollback)

**Escenario**: Durante `$transaction`, AuditLog.create() falla

```typescript
$transaction:
  1. app_user.update(...) ✓
  2. economyTransaction.create(...) ✓
  3. auditLog.create(...) ❌ ERROR (DB full, etc.)
  → ROLLBACK TODO
```

**Resultado**:
- app_user.credits NO incrementado ✓
- economyTransaction NO creado ✓
- Función lanza error → 500 (safe)

---

### Edge Case 6: Bonus calculation floor behavior

| Score | Victory Bonus | Participation Bonus |
|-------|---|---|
| 0-9 | 0 | 0 |
| 10-19 | 1 | 0 |
| 20-29 | 2 | 0 |
| 50-59 | 5 | 1 |
| 100-109 | 10 | 2 |
| 1000 | 100 | 20 |

**Regla**: `floor()` redondea hacia abajo. Score 19 = 0 bonus (para victory), no 1.9

---

##  Monitoreo & Observabilidad

### Logs

```typescript
// EconomyService logger
this.logger.log(`Credits awarded: User ${userId} (+${amountToAward})`);
this.logger.warn(`Security Breach Attempt: User ${userId} requested ${amount}`);
this.logger.error(`Economy Error [User: ${userId}]: ${error?.message ?? error}`, error?.stack);
```

### AuditLog (Persistencia)

Cada transacción exitosa genera registro en `AuditLog`:

```json
{
  "audit_id": "uuid",
  "user_id": "user-123",
  "table_name": "economy_transaction",
  "record_id": "tx-uuid",
  "timestamp": "2026-06-02T15:30:45.123Z",
  "details": {
    "action": "REWARD_CLAIMED",
    "score": 150,
    "victory": true,
    "credits_awarded": 115,
    "xp_awarded": 57,
    "new_balance_credits": 350,
    "new_balance_xp": 1200,
    "game_session_id": "session-123",
    "reward_type": "GAME_VICTORY"
  }
}
```

---
---

##  Referencia de Archivos

| Archivo | Responsabilidad | LOC |
|---------|---|---|
| `economy.controller.ts` | HTTP endpoint + JWT guard | ~25 |
| `economy.service.ts` | Orquestación + validaciones | ~60 |
| `economy.repository.ts` | Transacción atómica | ~40 |
| `economy.logic.ts` | Cálculos deterministas | ~50 |
| `economy.module.ts` | Configuración NestJS | ~15 |
| `claim.reward.dto.ts` | DTO input | ~20 |
| `claim-reward-response.dto.ts` | DTO output | ~40 |
| `economy.logic.spec.ts` | Tests unitarios | ~120 |
| `economy.service.spec.ts` | Tests unitarios (service) | ~80 |
| `economy.repository.spec.ts` | Tests integración | ~90 |
| `economy.controller.spec.ts` | Tests E2E | ~90 |
| `economy.stress.spec.ts` | Tests concurrencia | ~110 |
| **TOTAL** | | **720+ LOC** |

---

##  Conclusión

El módulo **Economy** implementa un sistema robusto, escalable y probado de recompensas gamificadas. Mediante:

**Arquitectura Clean**: Separación clara entre capas (Controller → Service → Repository → ORM)  
 **Atomicidad garantizada**: Prisma `$transaction` asegura consistencia  
**Idempotencia**: Unique constraint + P2002 mapeo previene doble reclamación  
**Testing exhaustivo**: 36+ tests cubriendo logic, service, repo, E2E y stress  
**Seguridad**: Validaciones de DTO, límites de negocio, manejo robusto de errores  
**Auditoría completa**: Cada transacción registrada en AuditLog  
**Integración clara**: Flujo definido desde game-engine hasta backend  

**Status**:  **Production-ready** 

