import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const dimensions = [
  { dimension_id: 'd0000000-0000-4000-8000-000000000001', name: 'Lógica', description: 'Razonamiento y precisión (accuracy)' },
  { dimension_id: 'd0000000-0000-4000-8000-000000000002', name: 'Creatividad', description: 'Baja carga cognitiva ante problemas nuevos' },
  { dimension_id: 'd0000000-0000-4000-8000-000000000003', name: 'Memoria', description: 'Retención de memoria (memory retention)' },
  { dimension_id: 'd0000000-0000-4000-8000-000000000004', name: 'Atención', description: 'Capacidad de atención sostenida (attention span)' },
  { dimension_id: 'd0000000-0000-4000-8000-000000000005', name: 'Velocidad', description: 'Tiempo de reacción (reaction time)' },
];

const archetypes = [
  { archetype_id: 'a0000000-0000-4000-8000-000000000001', name: 'Analítico', description: 'Destaca en lógica y retención estructurada' },
  { archetype_id: 'a0000000-0000-4000-8000-000000000002', name: 'Creativo', description: 'Alta fluidez cognitiva e intuición rápida' },
  { archetype_id: 'a0000000-0000-4000-8000-000000000003', name: 'Estratégico', description: 'Equilibrio entre lógica y memoria a largo plazo' },
  { archetype_id: 'a0000000-0000-4000-8000-000000000004', name: 'Explorador', description: 'Altamente adaptable, gran velocidad y creatividad' },
  { archetype_id: 'a0000000-0000-4000-8000-000000000005', name: 'Resiliente', description: 'Sostiene alta atención y memoria bajo presión' },
  { archetype_id: 'a0000000-0000-4000-8000-000000000006', name: 'Equilibrado', description: 'Perfil armónico en todas las dimensiones' },
];

const weights = [
  // Analítico
  { archetype_id: archetypes[0].archetype_id, dimension_id: dimensions[0].dimension_id, weight: 0.35 },
  { archetype_id: archetypes[0].archetype_id, dimension_id: dimensions[1].dimension_id, weight: 0.10 },
  { archetype_id: archetypes[0].archetype_id, dimension_id: dimensions[2].dimension_id, weight: 0.20 },
  { archetype_id: archetypes[0].archetype_id, dimension_id: dimensions[3].dimension_id, weight: 0.20 },
  { archetype_id: archetypes[0].archetype_id, dimension_id: dimensions[4].dimension_id, weight: 0.15 },
  
  // Creativo
  { archetype_id: archetypes[1].archetype_id, dimension_id: dimensions[0].dimension_id, weight: 0.10 },
  { archetype_id: archetypes[1].archetype_id, dimension_id: dimensions[1].dimension_id, weight: 0.35 },
  { archetype_id: archetypes[1].archetype_id, dimension_id: dimensions[2].dimension_id, weight: 0.15 },
  { archetype_id: archetypes[1].archetype_id, dimension_id: dimensions[3].dimension_id, weight: 0.15 },
  { archetype_id: archetypes[1].archetype_id, dimension_id: dimensions[4].dimension_id, weight: 0.25 },
  
  // Estratégico
  { archetype_id: archetypes[2].archetype_id, dimension_id: dimensions[0].dimension_id, weight: 0.25 },
  { archetype_id: archetypes[2].archetype_id, dimension_id: dimensions[1].dimension_id, weight: 0.20 },
  { archetype_id: archetypes[2].archetype_id, dimension_id: dimensions[2].dimension_id, weight: 0.25 },
  { archetype_id: archetypes[2].archetype_id, dimension_id: dimensions[3].dimension_id, weight: 0.15 },
  { archetype_id: archetypes[2].archetype_id, dimension_id: dimensions[4].dimension_id, weight: 0.15 },

  // Explorador
  { archetype_id: archetypes[3].archetype_id, dimension_id: dimensions[0].dimension_id, weight: 0.15 },
  { archetype_id: archetypes[3].archetype_id, dimension_id: dimensions[1].dimension_id, weight: 0.25 },
  { archetype_id: archetypes[3].archetype_id, dimension_id: dimensions[2].dimension_id, weight: 0.15 },
  { archetype_id: archetypes[3].archetype_id, dimension_id: dimensions[3].dimension_id, weight: 0.15 },
  { archetype_id: archetypes[3].archetype_id, dimension_id: dimensions[4].dimension_id, weight: 0.30 },

  // Resiliente
  { archetype_id: archetypes[4].archetype_id, dimension_id: dimensions[0].dimension_id, weight: 0.20 },
  { archetype_id: archetypes[4].archetype_id, dimension_id: dimensions[1].dimension_id, weight: 0.15 },
  { archetype_id: archetypes[4].archetype_id, dimension_id: dimensions[2].dimension_id, weight: 0.25 },
  { archetype_id: archetypes[4].archetype_id, dimension_id: dimensions[3].dimension_id, weight: 0.25 },
  { archetype_id: archetypes[4].archetype_id, dimension_id: dimensions[4].dimension_id, weight: 0.15 },

  // Equilibrado
  { archetype_id: archetypes[5].archetype_id, dimension_id: dimensions[0].dimension_id, weight: 0.20 },
  { archetype_id: archetypes[5].archetype_id, dimension_id: dimensions[1].dimension_id, weight: 0.20 },
  { archetype_id: archetypes[5].archetype_id, dimension_id: dimensions[2].dimension_id, weight: 0.20 },
  { archetype_id: archetypes[5].archetype_id, dimension_id: dimensions[3].dimension_id, weight: 0.20 },
  { archetype_id: archetypes[5].archetype_id, dimension_id: dimensions[4].dimension_id, weight: 0.20 },
];

async function main() {
  console.log('Seeding dimensiones y arquetipos cognitivos...');

  for (const dim of dimensions) {
    await prisma.dimension.upsert({
      where: { dimension_id: dim.dimension_id },
      update: dim,
      create: dim,
    });
  }

  for (const arch of archetypes) {
    await prisma.archetype.upsert({
      where: { archetype_id: arch.archetype_id },
      update: arch,
      create: arch,
    });
  }

  // Clear existing weights and re-insert
  await prisma.archetypeDimensionWeight.deleteMany({});
  await prisma.archetypeDimensionWeight.createMany({
    data: weights,
  });

  console.log('Seed de arquetipos completado.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
