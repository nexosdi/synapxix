# ═══════════════════════════════════════════════════════════════════════════
# Synapxix API (NestJS) — imagen de producción.
# Usada por Railway/Fly para servir la API (incluye D.A.L.A. y el Primer
# Pulso del equipo). Las migraciones Prisma corren en el arranque.
# ═══════════════════════════════════════════════════════════════════════════

FROM node:22-alpine AS build
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm ci
COPY . .
RUN npx prisma generate --schema libs/prisma/src/schema.prisma \
  && npx nx build server

FROM node:22-alpine
WORKDIR /app
ENV NODE_ENV=production
# Prisma necesita openssl en alpine
RUN apk add --no-cache openssl
# El bundle genera su propio package.json con las dependencias de runtime
COPY --from=build /app/dist/server ./
COPY --from=build /app/libs/prisma/src/schema.prisma ./prisma/schema.prisma
COPY --from=build /app/libs/prisma/src/migrations ./prisma/migrations
RUN npm ci --omit=dev && npx prisma generate --schema prisma/schema.prisma
EXPOSE 3000
CMD ["sh", "-c", "npx prisma migrate deploy --schema prisma/schema.prisma && node main.js"]
