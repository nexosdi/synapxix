FROM node:22.12.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npx prisma generate --schema libs/prisma/src/schema.prisma
RUN npx nx build server

FROM node:22.12.0-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production

# Copy compiled backend bundle and schema
COPY --from=builder /app/dist/server ./
COPY --from=builder /app/libs/prisma/src/schema.prisma ./schema.prisma

# Install production dependencies for server and generate prisma client
RUN npm ci --omit=dev --legacy-peer-deps
RUN npx prisma generate --schema ./schema.prisma

EXPOSE 3000
CMD ["node", "main.js"]

