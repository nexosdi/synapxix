# NexosDi Synapxix ✨

Educación adaptable para todos. Monorepo administrado con [Nx](https://nx.dev).

---

## Tabla de Contenidos

- [Prerequisitos](#prerequisitos)
- [Instalación desde cero](#instalación-desde-cero)
- [Variables de entorno](#variables-de-entorno)
- [Levantar servicios con Docker](#levantar-servicios-con-docker)
- [Base de datos (Prisma)](#base-de-datos-prisma)
- [Ejecutar los proyectos](#ejecutar-los-proyectos)
- [Estructura del monorepo](#estructura-del-monorepo)
- [CI/CD](#cicd)

---

## Prerequisitos

| Herramienta | Versión requerida | Verificar con |
|-------------|-------------------|---------------|
| **Node.js** | `>= 22.12.0` | `node -v` |
| **npm** | `>= 10` | `npm -v` |
| **Docker** | Latest | `docker --version` |
| **Docker Compose** | Latest | `docker compose version` |

> **Tip:** El proyecto incluye un archivo `.nvmrc`. Si usás [nvm](https://github.com/nvm-sh/nvm), simplemente ejecutá `nvm use` en la raíz del repo para activar la versión correcta de Node.

---

## Instalación desde cero

```bash
# 1. Clonar el repositorio
git clone https://github.com/nexosdi/synapxix.git
cd synapxix

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno (ver sección siguiente)
cp .env.example .env
```

---

## Variables de entorno

Crear un archivo `.env` en la raíz del proyecto basándose en `.env.example`. Las variables necesarias son:

```env
# ── Base de datos de la aplicación (Prisma) ──────────────────
DATABASE_URL=postgresql://postgres:postgres@localhost:5433/synapxix_db
APP_DB_NAME=synapxix_db
APP_DB_USER=postgres
APP_DB_PASSWORD=postgres
APP_DB_PORT=5433

# ── Neo4j (Grafo de aprendizaje) ─────────────────────────────
NEO4J_URI=neo4j://localhost:7687
NEO4J_USERNAME=neo4j
NEO4J_PASSWORD=neo4j_password

# ── Google Generative AI (Módulo de investigación) ───────────
GOOGLE_GEN_AI_KEY=your_api_key_here
```

> **Nota:** Para obtener la API key de Google Generative AI, ingresá a [Google AI Studio](https://aistudio.google.com/) y generá una clave.

---

## Levantar servicios con Docker

El `docker-compose.yml` incluye los siguientes servicios:

| Servicio | Puerto | Descripción |
|----------|--------|-------------|
| `postgres-app` | `5433` (configurable vía `APP_DB_PORT`) | PostgreSQL para la aplicación |
| `neo4j` | `7474` (HTTP) / `7687` (Bolt) | Base de datos de grafos |

```bash
# Levantar todos los servicios
docker compose up -d

# Verificar que estén corriendo
docker compose ps

# Ver logs de un servicio específico
docker compose logs -f keycloak

# Detener todo
docker compose down
```

> **Neo4j** Browser está disponible en `http://localhost:7474`.

---

## Base de datos (Prisma)

El schema de Prisma se encuentra en `libs/prisma/src/schema.prisma` y usa PostgreSQL con multi-schema (`core`, `auth`, `audit`, `communication`, `knowledge`, `psychometrics`).

```bash
# Generar el Prisma Client
npx prisma generate

# Crear las tablas en la base de datos (primera vez)
npx prisma db push

# Crear una migración (cuando modificás el schema)
npx prisma migrate dev --name descripcion_del_cambio

# Abrir Prisma Studio (interfaz visual para la DB)
npx prisma studio
```

> **Importante:** Asegurate de que el servicio `postgres-app` de Docker esté corriendo antes de ejecutar comandos de Prisma.

---

## Ejecutar los proyectos

### Backend (NestJS)

```bash
npx nx serve server
```

El servidor se levanta en `http://localhost:3000/api`.

### Frontend — Web Game (Angular)

```bash
npx nx serve web-game
```

Se levanta en `http://localhost:4300`.

### Admin Frontend (Angular)

```bash
npx nx serve admin-frontend
```

### Ejecutar múltiples proyectos

```bash
# Server + Web Game en paralelo
npx nx run-many -t serve -p server web-game
```

---

## Estructura del monorepo

```
synapxix/
├── server/                  # Backend NestJS (API REST)
│   └── src/app/
│       ├── auth/            # Autenticación JWT/Keycloak
│       ├── economy/         # Sistema de economía/créditos
│       ├── game-session/    # Sesiones de juego
│       ├── learning/        # Módulo de aprendizaje (Neo4j)
│       └── modules/
│           └── research/    # Análisis pedagógico con IA (Gemini)
├── web-game/                # Frontend Angular — Juego educativo
├── admin-frontend/          # Frontend Angular — Panel de administración
├── libs/                    # Librerías compartidas
│   ├── prisma/              # Prisma Client, schema y migraciones
│   ├── baseRepository/      # Repositorio base reutilizable
│   ├── envValidator/        # Validación de variables de entorno
│   ├── game-engine/         # Motor del juego (core)
│   └── learning/            # Modelos compartidos de aprendizaje
├── docker-compose.yml       # Servicios de infraestructura
├── prisma.config.ts         # Configuración de Prisma CLI
├── nx.json                  # Configuración de Nx
└── .env.example             # Template de variables de entorno
```

---

## CI/CD

El pipeline de CI se ejecuta con GitHub Actions en cada push a `main` y en cada pull request.

```bash
# Simular el pipeline localmente
npx nx run-many -t lint test build
```

El pipeline ejecuta:
1. **Lint** — ESLint en todos los proyectos
2. **Test** — Jest en todos los proyectos
3. **Build** — Build de producción de todos los proyectos

---

## Comandos útiles de Nx

```bash
# Ver todos los proyectos del monorepo
npx nx show projects

# Ver targets disponibles de un proyecto
npx nx show project server --web

# Grafo visual de dependencias
npx nx graph

# Ejecutar solo los proyectos afectados por cambios
npx nx affected -t lint test build
```
