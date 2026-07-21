import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const newUser = await prisma.app_user.create({
    data: {
      username: 'soperez',
      email: 'soperez@example.com',
      firstname: 'sofia',
      lastname: 'perez',
      role: 'user',
      credits: 1000,
      experience_points: 100,
    },
  });
  console.log('¡Usuario creado con éxito!', newUser);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });