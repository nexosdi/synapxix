import { config as loadEnv } from 'dotenv';
import { defineConfig } from 'prisma/config';

loadEnv({
  path: './.env' // <--- Faltaba el punto antes de env
})

export default defineConfig({
  schema: './libs/prisma/src/schema.prisma',
})