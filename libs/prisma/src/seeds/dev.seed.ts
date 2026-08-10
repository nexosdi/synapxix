import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Identificador del usuario de desarrollo.
 * Debe coincidir con `MOCK_USER_ID` en server/src/app/auth/mock-jwt.guard.ts:
 * cuando `DISABLE_AUTH=true`, los controladores usan ese id como `user_id`,
 * y sin una fila real en `auth.app_user` toda escritura falla por clave foránea.
 */
const DEV_USER_ID = '00000000-0000-4000-8000-000000000001';

const storeItems = [
  { store_item_id: '00000000-0000-4000-8000-0000000000a1', name: 'Avatar Explorador', type: 'avatar', price: 100 },
  { store_item_id: '00000000-0000-4000-8000-0000000000a2', name: 'Avatar Científica', type: 'avatar', price: 150 },
  { store_item_id: '00000000-0000-4000-8000-0000000000b1', name: 'Banner Galaxia', type: 'banner', price: 200 },
];

async function main() {
  console.log('Seeding datos de desarrollo...');

  // Upsert para que el script se pueda correr varias veces sin romper
  await prisma.app_user.upsert({
    where: { user_id: DEV_USER_ID },
    update: {},
    create: {
      user_id: DEV_USER_ID,
      username: 'teacher_dev',
      email: 'teacher@dev.local',
      firstname: 'Docente',
      lastname: 'Desarrollo',
      role: 'teacher',
      credits: 1000,
      experience_points: 0,
    },
  });
  console.log(`  usuario de desarrollo listo (${DEV_USER_ID})`);

  for (const item of storeItems) {
    await prisma.storeItem.upsert({
      where: { store_item_id: item.store_item_id },
      update: {},
      create: { ...item, is_active: true },
    });
  }
  console.log(`  ${storeItems.length} artículos de tienda listos`);

  console.log('Seed de desarrollo completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
