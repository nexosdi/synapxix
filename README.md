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

### 3. Levantar la base de datos

```bash
# Solo PostgreSQL (modo dev — sin Keycloak ni Neo4j)
docker compose up -d postgres-app
```

Para levantar Keycloak o Neo4j:
```bash
docker compose --profile keycloak up -d
docker compose --profile neo4j up -d
```

### 4. Generar cliente Prisma y correr migraciones

```bash
# Generar el cliente de Prisma (SIEMPRE después de un git pull que toque el schema)
npx prisma generate --config prisma.config.ts

# Aplicar migraciones a la base de datos
npx prisma migrate deploy --config prisma.config.ts
```

### 5. Levantar los servicios

Cada servicio en una terminal separada:

```bash
# Backend NestJS (puerto 3000)
npx nx serve server

# Frontend de juegos (puerto 4300)
npx nx serve web-game

# Frontend admin (puerto 4200)
npx nx serve admin-frontend
```

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

```bash
# Todos los tests
npx nx test

# Test de un proyecto específico
npx nx test server
npx nx test web-game

# Con cobertura
npx nx test server --coverage
```

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
