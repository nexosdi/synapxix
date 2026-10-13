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
- npm (incluido con Node.js)

### 1. Clonar y configurar entorno

```bash
git clone <repo-url>
cd synapxix

# Copiar variables de entorno y completar los valores
cp .env.example .env
```

Editar `.env` según el flujo que vayas a probar. `APP_DB_NAME`, `APP_DB_USER`, `APP_DB_PASSWORD` y `APP_DB_PORT` deben coincidir con `DATABASE_URL`. Los valores de `.env.example` son solo para desarrollo local; reemplazalos antes de compartir el entorno.

### 2. Instalar dependencias

```bash
npm install --legacy-peer-deps
```

> `--legacy-peer-deps` es necesario por la dependencia transitiva entre `ng2-charts@10` y `@angular/cdk@22` en un proyecto Angular 20.

### 3. Preparar la base de datos

Atajo que levanta PostgreSQL de la aplicación y Redis, genera el cliente de Prisma, aplica las migraciones y carga el seed de desarrollo:

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

### 5. Elegir el modo de autenticación

Hay dos modos. Elegí uno según lo que necesites probar.

#### Modo rápido: saltear la validación (`DISABLE_AUTH`)

Usalo para probar la API y el `admin-frontend`, no el flujo web de `web-game`. En `.env`:

```env
DISABLE_AUTH=true
```

El backend usa `MockJwtGuard`, que inyecta un usuario docente fijo; ejecutá el seed de desarrollo para que ese usuario exista en la base. Este modo omite la validación JWT de la API, pero el `web-game` tiene su propio guard de Keycloak en el frontend: sus rutas protegidas requieren una sesión real. No uses mock-auth como sustituto del login web.

#### Modo completo: Keycloak local

Necesario para probar el `web-game` de punta a punta.

```bash
docker compose --profile keycloak up -d postgres-keycloak keycloak
```

El realm `Synapxix` y el cliente `synapxix-app` se importan solos desde
`keycloak/realm-synapxix.json` en el primer arranque. Variables en `.env`:

```env
DISABLE_AUTH=false
KEYCLOAK_ADMIN=admin
KEYCLOAK_ADMIN_PASSWORD=local-only-change-me
KEYCLOAK_DB_NAME=keycloak
KEYCLOAK_DB_USER=keycloak_user
KEYCLOAK_DB_PASSWORD=local-only-change-me
```

Compose publica Keycloak en `8081` por defecto y el frontend local apunta a ese mismo origen. `.env.example` ya define `KEYCLOAK_PORT=8081`, `KEYCLOAK_PUBLIC_URL=http://localhost:8081` y `KEYCLOAK_REALM_URL=http://localhost:8081/realms/Synapxix`; los valores de credenciales `local-only-*` son solo para pruebas locales. Compose mapea el puerto del host al `8080` interno. Si cambiás el puerto, actualizá estas variables y `keycloak.url` en `web-game/src/environments/environment.ts`.

Crear el usuario de prueba es un paso manual. Entrá a la consola de admin en `http://localhost:8081`, elegí el realm **Synapxix** → *Users* → *Add user*, y asignale una contraseña desde *Credentials*. Si necesitás un rol, asigná `teacher` o `student` desde *Role mapping*. Luego abrí `http://localhost:4300/`, iniciá sesión y usá el botón para entrar al juego. La ruta de mapa es `/history/<historyId>/map`; el identificador mock de desarrollo se obtiene del código, no lo inventes.

> Para usar otro servidor Keycloak, configurá `KEYCLOAK_REALM_URL` para la API y `keycloak.url` en `web-game/src/environments/environment.ts` para el frontend. Ambos deben apuntar al mismo realm.

### Probar la API y el panel con mock-auth

Con `DISABLE_AUTH=true`, la base migrada y el seed aplicado, la API acepta llamadas sin un JWT válido usando la identidad docente fija. Usá `http://localhost:4200` para el panel. Esto permite desarrollar API/admin, pero no verifica login, roles ni tokens de Keycloak en el juego.

### Probar el juego con Keycloak

Usá `DISABLE_AUTH=false`, levantá el perfil `keycloak` y asegurate de que `KEYCLOAK_REALM_URL` y `web-game/src/environments/environment.ts` apunten al mismo realm y puerto. Entrá por `http://localhost:4300/`; el botón inicia el login y vuelve al mapa protegido. El proxy de desarrollo envía `/api` al backend en el puerto 3000.

> Si el acceso al mapa vuelve repetidamente al inicio, revisá la navegación del guard/resolver y que estés usando la historia mock de desarrollo. No confundas ese ciclo de navegación con un error de API: el POST de consentimiento puede devolver HTTP 500 y no se considera resuelto por esta guía.

### Configuración de staging

`docker-compose.staging.yml` usa Keycloak `start-dev` y está destinado exclusivamente a pruebas locales/de integración; no es una configuración de producción. No tiene TLS ni un diseño de proxy/ingress productivo. Para un staging remoto, terminá HTTPS en un reverse proxy/ingress confiable y configurá el hostname público HTTPS de Keycloak antes de exponerlo; no uses el puerto HTTP publicado como ingress público. Antes de levantar este compose, exportá credenciales únicas para `APP_DB_*`, `KEYCLOAK_DB_*`, `KEYCLOAK_ADMIN*`, `REDIS_PASSWORD`, `NEO4J_*` y `GOOGLE_GEN_AI_KEY`; Compose falla explícitamente si falta alguna. Definí también `KEYCLOAK_PUBLIC_URL` (por ejemplo `https://auth.example.com`, sin barra final): Keycloak lo anuncia como hostname y la API valida el issuer `${KEYCLOAK_PUBLIC_URL}/realms/Synapxix`. Para que el cliente web también funcione en un entorno remoto, su `keycloak.url` debe apuntar al mismo hostname HTTPS antes de compilar la imagen. Además, el realm importado limita `frame-ancestors` a orígenes locales: antes de usar otro dominio, actualizá la política CSP del realm para permitir el origen HTTPS exacto del frontend; no uses comodines. `KEYCLOAK_REALM_URL` dentro del contenedor API permanece como endpoint interno de discovery/JWKS (`http://keycloak:8080/realms/Synapxix`), separado del issuer público. No reutilices los valores locales de `.env.example` en staging. Keycloak publica un solo puerto (`KEYCLOAK_PORT`, por defecto `8081`).

---


## Workflows de desarrollo

### Agregar un nuevo endpoint

1. Crear el DTO en `server/src/app/<módulo>/dto/`
2. Agregar el método en el `Service`
3. Registrar la ruta en el `Controller`
4. Si hay cambio de schema → crear migración: `npx prisma migrate dev --config prisma.config.ts --name <nombre>`
5. Regenerar el cliente: `npx prisma generate --config prisma.config.ts`

### Resolver conflictos en package-lock.json

El repositorio usa `.gitattributes` con `merge=ours` para `package-lock.json`.
Si un merge toca dependencias:

1. Completar el merge normalmente (el lockfile se auto-resuelve)
2. Correr `npm install --legacy-peer-deps` para regenerar el lockfile con la mezcla correcta
3. Commitear el lockfile actualizado

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

# Test de un proyecto con target configurado
npx nx test server
npx nx test admin-frontend

# Con cobertura
npx nx test server --coverage
```

### E2E Testing

No hay un target E2E `web-game` declarado en `web-game/project.json` en esta configuración. Consultá los targets disponibles con `npx nx show project web-game` antes de asumir que Playwright está configurado.

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
| `KEYCLOAK_PORT` | Puerto publicado de Keycloak (Compose usa `8081` si no se define) |
| `DISABLE_AUTH` | `true` activa mock-auth de la API en desarrollo; no omite el guard del frontend |

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

## Identidad visual

La interfaz sigue el Manual de Marca de Synapxix. Las reglas de uso están en
**[BRAND.md](BRAND.md)**: leelo antes de escribir estilos.

Regla corta: **ningún color, tipografía o radio se escribe a mano.** Todo sale de
los tokens en [`libs/brand/src/tokens.css`](libs/brand/src/tokens.css).

```css
/* mal */            /* bien */
color: #1e90ff;      color: var(--sx-blue);
border-radius: 4px;  border-radius: var(--sx-radius-sm);
```

En `web-game` y `libs` también existen las utilidades de Tailwind equivalentes
(`bg-synapxix`, `text-blue-deep`, `rounded-sx-lg`).

## Convenciones del proyecto

- **Marca**: ver [BRAND.md](BRAND.md). Sin colores ni fuentes hardcodeadas.
- **Commits**: Conventional Commits (`feat:`, `fix:`, `chore:`, etc.)
- **Idioma del código**: inglés (identificadores, comentarios, mensajes de error)
- **Idioma de UI**: español (labels, textos visibles al usuario)
- **Tipado**: TypeScript estricto — no usar `any`. Usar `unknown` + type guards o `Record<string, unknown>`
- **Schemas Prisma**: cada cambio requiere migración, no editar tablas directamente en la DB
- **Ramas**: una rama por feature, PR obligatoria para mergear a `main`
