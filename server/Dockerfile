FROM node:22.12.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npx prisma generate --schema libs/prisma/src/schema.prisma
RUN npx nx build server

FROM node:22.12.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY package*.json ./
RUN npm ci --omit=dev
COPY --from=builder /app/node_modules/@prisma/client ./node_modules/@prisma/client
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/dist/server ./dist/server
COPY --from=builder /app/libs/prisma/src/schema.prisma ./schema.prisma

EXPOSE 3000
CMD ["node", "dist/server/main.js"]
