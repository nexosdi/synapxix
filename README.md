# Synapxix

Plataforma educativa cognitiva para el aprendizaje adaptativo, construida como un monorepo Nx con Angular (frontend), NestJS (backend) y PostgreSQL (base de datos).

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|---|---|---|
| Monorepo | [Nx](https://nx.dev) | 22.x |
| Frontend (juegos) | Angular | 20.x |
| Frontend (admin) | Angular | 20.x |
| Backend | NestJS | 11.x |
| ORM | Prisma | 6.x |
| Base de datos | PostgreSQL | 15 |
| Autenticación | JWT + Passport | — |
| Gráficos | Chart.js + ng2-charts | 4.x / 10.x |
| AI | Google Generative AI | — |
| Lenguaje | TypeScript | 5.9.x |

---

## Estructura del monorepo

```
synapxix/
├── server/                     # API NestJS
│   └── src/app/
│       ├── auth/               # JWT guard + estrategia Passport
│       ├── economy/            # Motor de economía (créditos, XP, recompensas)
│       ├── game-session/       # Ciclo de vida de sesiones de juego
│       ├── learning/           # Módulo de aprendizaje adaptativo
│       └── profile/            # Perfil de usuario
│
├── web-game/                   # SPA Angular — interfaz de juegos para alumnos
│   └── src/
│       ├── app/                # Raíz de la app (rutas, config)
│       ├── components/         # Dashboard, mapa, menú, splash
│       └── teachers-form/      # Constructor de roadmaps para docentes
│
├── admin-frontend/             # SPA Angular — panel administrativo
│   └── src/app/
│       ├── core/               # Servicios HTTP base (ApiService)
│       ├── dashboard/          # Dashboard principal con gráficos
│       ├── login/              # Pantalla de acceso
│       └── register-preview/   # Vista previa de registro
│
└── libs/                       # Librerías compartidas del monorepo
    ├── prisma/                 # Schema Prisma + migraciones + PrismaService
    ├── game-engine/core/       # Motor de juegos (tipos, servicios, lógica)
    ├── learning/shared/        # Tipos compartidos del módulo de aprendizaje
    ├── baseRepository/         # Repositorio base genérico
    └── envValidator/           # Validación de variables de entorno
```

---

## Arquitectura de base de datos

El schema usa **múltiples schemas de PostgreSQL** para separar dominios:

| Schema | Tablas | Responsabilidad |
|---|---|---|
| `auth` | `app_user`, `session`, `user_link`, `user_structure`, `user_profile` | Identidad y autenticación |
| `core` | `institution`, `structure`, `game_session`, `game_attempt`, `economy_transaction` | Dominio educativo principal |
| `knowledge` | `content`, `user_content_progress` | Contenido y progreso |
| `psychometrics` | `dimension`, `archetype` | Perfil cognitivo |
| `audit` | `audit_log` | Trazabilidad |
| `communication` | `notification` | Notificaciones |

---

## API Endpoints

El servidor corre en `http://localhost:3000/api`. Todos los endpoints requieren `Authorization: Bearer <JWT>` salvo que se indique lo contrario.

### Auth
| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/auth/preferences` | Obtener preferencias del usuario autenticado |

### Economy
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/economy/claim-reward` | Reclamar recompensa al finalizar un juego |

**Body `claim-reward`:**
```json
{
  "gameSessionId": "uuid",
  "score": 85,
  "victory": true
}
```

### Game Session
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/game-session/start` | Iniciar una sesión de juego |
| `POST` | `/api/game-session/:id/attempt` | Registrar un intento dentro de la sesión |
| `POST` | `/api/game-session/:id/complete` | Finalizar la sesión |

### Learning
| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/api/learning/bootstrap` | Inicializar perfil de aprendizaje |
| `POST` | `/api/learning/users` | Crear usuario en el módulo de aprendizaje |
| `POST` | `/api/learning/topics` | Crear tema de aprendizaje |
| `POST` | `/api/learning/preferences` | Guardar preferencias |
| `GET` | `/api/learning/:userId/topics` | Obtener temas de un usuario |
| `GET` | `/api/learning/:userId/preferences` | Obtener preferencias de un usuario |
| `GET` | `/api/learning/:userId/methods` | Obtener métodos de aprendizaje |

---

## Setup local

### Requisitos

- Node.js 20+
- Docker y Docker Compose
- Git

### 1. Clonar y configurar entorno

```bash
git clone <repo-url>
cd synapxix

# Copiar variables de entorno y completar los valores
cp .env.example .env
```

Editar `.env` con tus credenciales. Los valores de `APP_DB_*` y `DATABASE_URL` deben coincidir entre sí.

### 2. Instalar dependencias

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` es necesario por la dependencia transitiva entre `ng2-charts@10` y `@angular/cdk@22` en un proyecto Angular 20.

### 3. Preparar la base de datos

Atajo que levanta Postgres y Redis, genera el cliente de Prisma, aplica las
migraciones y carga el seed de desarrollo:

```bash
npm run dev:setup
```

Si preferís los pasos sueltos:

```bash
npm run db:up        # docker compose up -d postgres-app redis
npm run db:migrate   # prisma migrate deploy
npm run db:seed      # usuario de desarrollo + artículos de tienda
```

> El seed (`libs/prisma/src/seeds/dev.seed.ts`) crea el usuario cuyo id usa el
> `MockJwtGuard`. Sin él, cualquier escritura falla por clave foránea cuando
> `DISABLE_AUTH=true`.

### 4. Levantar los servicios

Cada servicio en una terminal separada:

```bash
# Backend NestJS (puerto 3000)
npx nx serve server

# Frontend de juegos (puerto 4300)
npx nx serve web-game

# Frontend admin (puerto 4200)
npx nx serve admin-frontend
```

### 5. Autenticación en desarrollo

Hay dos modos. Elegí uno según lo que necesites probar.

#### Modo rápido: saltear la validación (`DISABLE_AUTH`)

Alcanza para probar la API y el `admin-frontend`. En tu `.env`:

```env
DISABLE_AUTH=true
```

El backend usa `MockJwtGuard`, que inyecta un usuario docente fijo. No sirve
para el `web-game`, cuyo guard es de Keycloak y vive en el frontend.

#### Modo completo: Keycloak local

Necesario para probar el `web-game` de punta a punta.

```bash
docker compose --profile keycloak up -d
```

El realm `Synapxix` y el cliente `synapxix-app` se importan solos desde
`keycloak/realm-synapxix.json` en el primer arranque. Variables en `.env`:

```env
DISABLE_AUTH=false
KEYCLOAK_PORT=8081          # cambialo si el 8080 está libre en tu máquina
KEYCLOAK_REALM_URL=http://localhost:8081/realms/Synapxix
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=changeme
KEYCLOAK_DB_NAME=keycloak
KEYCLOAK_DB_USER=keycloak_user
KEYCLOAK_DB_PASSWORD=changeme
```

Falta un paso manual: crear tu usuario de prueba. Entrá a la consola de admin
en `http://localhost:8081`, elegí el realm **Synapxix** → *Users* → *Add user*,
y asignale una contraseña en la pestaña *Credentials*. Si querés que tenga rol,
usá *Role mapping* con `teacher` o `student`.

> Para usar el Keycloak del VPS en lugar del local, poné
> `KEYCLOAK_REALM_URL=https://auth.aisuite.neops.ai/realms/Synapxix` y cambiá
> `keycloak.url` en `web-game/src/environments/environment.ts`.

---


## Workflows de desarrollo

### Agregar un nuevo endpoint

1. Crear el DTO en `server/src/app/<módulo>/dto/`
2. Agregar el método en el `Service`
3. Registrar la ruta en el `Controller`
4. Si hay cambio de schema → crear migración: `npx prisma migrate dev --config prisma.config.ts --name <nombre>`
5. Regenerar el cliente: `npx prisma generate --config prisma.config.ts`

### Cambiar el schema de Prisma

```bash
# Editar libs/prisma/src/schema.prisma, luego:
npx prisma migrate dev --config prisma.config.ts --name descripcion_del_cambio
npx prisma generate --config prisma.config.ts
```

> ⚠️ Siempre correr `prisma generate` después de cualquier cambio en el schema o después de un `git pull`. Sin esto el cliente TypeScript queda desactualizado y el server no arranca.

### Crear una librería compartida

```bash
npx nx g @nx/js:library libs/<nombre>
```

---

## Testing

### Unit Testing

```bash
# Todos los tests
npx nx test

# Test de un proyecto específico
npx nx test server
npx nx test web-game

# Con cobertura
npx nx test server --coverage
```

### E2E Testing (Playwright)

El proyecto cuenta con pruebas End-to-End para verificar el flujo crítico (ej. `web-game`).

```bash
# Correr pruebas E2E en consola (headless)
npx nx e2e web-game

# Correr pruebas E2E abriendo la interfaz visual de Playwright
npx nx e2e web-game --ui
```
> ⚠️ **Nota:** Asegúrate de tener el backend corriendo (`npx nx serve server`) en otra terminal antes de ejecutar los tests E2E, ya que el frontend del juego necesita comunicarse con la API.

---

## Build para producción

```bash
npx nx build server
npx nx build web-game
npx nx build admin-frontend
```

Los artefactos se generan en `dist/`.

---

## Variables de entorno

Ver [`.env.example`](.env.example) para la lista completa. Las variables obligatorias para desarrollo son:

| Variable | Descripción |
|---|---|
| `DATABASE_URL` | Connection string de PostgreSQL para Prisma |
| `APP_DB_NAME` | Nombre de la base de datos (usado por Docker Compose) |
| `APP_DB_USER` | Usuario de la DB |
| `APP_DB_PASSWORD` | Contraseña de la DB |
| `APP_DB_PORT` | Puerto expuesto del contenedor (default: `5434`) |
| `GOOGLE_GEN_AI_KEY` | API key de Google AI Studio (para módulo de IA) |
| `KEYCLOAK_REALM_URL` | URL pública del realm de Keycloak para validación JWT |

---

## Puertos por defecto

| Servicio | Puerto |
|---|---|
| NestJS API | `3000` |
| web-game (Angular) | `4300` |
| admin-frontend (Angular) | `4200` |
| PostgreSQL app | `5434` |
| Keycloak (opcional) | `8080` |
| Neo4j HTTP (opcional) | `7474` |
| Neo4j Bolt (opcional) | `7687` |

---

## CORS

El backend tiene CORS configurado para `http://localhost:4300` (web-game). Si necesitás agregar otro origen durante desarrollo, modificar `server/src/main.ts`:

```typescript
app.enableCors({
  origin: ['http://localhost:4300', 'http://localhost:4200'],
  // ...
});
```

---

## Convenciones del proyecto

- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
- **Idioma del código**: inglés (identificadores, comentarios, mensajes de error)
- **Idioma de UI**: español (labels, textos visibles al usuario)
- **Tipado**: TypeScript estricto — no usar `any`. Usar `unknown` + type guards o `Record<string, unknown>`
- **Schemas Prisma**: cada cambio requiere migración, no editar tablas directamente en la DB
- **Ramas**: una rama por feature, PR obligatoria para mergear a `main`
