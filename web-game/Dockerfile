FROM node:22.12.0-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --legacy-peer-deps
COPY . .
RUN npx nx build web-game --configuration=production

FROM nginx:alpine AS runner
COPY --from=builder /app/dist/web-game/browser /usr/share/nginx/html
COPY web-game/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
