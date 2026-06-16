import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const audioEvaluationPrompt = `
You are an AI teacher evaluating a student's reading aloud exercise.
The student was supposed to read the following text:
"{EXPECTED_TEXT}"

Listen to the attached audio file of the student reading.
Evaluate if they read the text correctly.
Respond ONLY with a JSON object in the following format:
{
  "isCorrect": boolean,
  "score": number, // 0 to 100
  "feedback": "Your pedagogical feedback here"
}
`;

async function main() {
  console.log('Seeding AiPrompt table...');

  // Using upsert so this script can be run multiple times safely
  const prompts = [
    {
      game_type: 'read-aloud',
      category: 'AUDIO_EVALUATION',
      name: 'Default Read Aloud Evaluation',
      content: audioEvaluationPrompt.trim(),
    },
    {
      game_type: 'avatar',
      category: 'SYSTEM_ANALYSIS',
      name: 'Avatar Activity Analysis',
      content: 'You are a pedagogical analyst evaluating an avatar activity',
    },
    {
      game_type: 'read-select',
      category: 'SYSTEM_ANALYSIS',
      name: 'Read Select Analysis',
      content: 'You are a pedagogical analyst evaluating a read-select activity',
    },
    {
      game_type: 'listen-type',
      category: 'SYSTEM_ANALYSIS',
      name: 'Listen Type Analysis',
      content: 'You are a pedagogical analyst evaluating a listen-type activity',
    },
    {
      game_type: 'fill-in-the-blank',
      category: 'SYSTEM_ANALYSIS',
      name: 'Fill in the Blank Analysis',
      content: 'You are a pedagogical analyst evaluating a fill-in-the-blank activity',
    },
    {
      game_type: 'read-aloud',
      category: 'SYSTEM_ANALYSIS',
      name: 'Read Aloud Analysis',
      content: 'You are a pedagogical analyst evaluating a read-aloud activity',
    },
    {
      game_type: 'speak-about-photo',
      category: 'SYSTEM_ANALYSIS',
      name: 'Speak About Photo Analysis',
      content: 'You are a pedagogical analyst evaluating a speak-about-photo activity',
    },
  ];

  for (const prompt of prompts) {
    await prisma.aiPrompt.upsert({
      where: {
        game_type_category_version: {
          game_type: prompt.game_type,
          category: prompt.category,
          version: 1,
        },
      },
      update: {},
      create: {
        ...prompt,
        version: 1,
        is_active: true,
      },
    });
  }

  console.log('AiPrompt seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
