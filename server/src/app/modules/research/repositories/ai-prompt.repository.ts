import { Injectable } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { AiPrompt } from '@prisma/client';
import { CreateAiPromptDto } from '../dto/create-ai-prompt.dto';

@Injectable()
export class AiPromptRepository {
  constructor(private readonly prisma: PrismaService) {}

  /**
   * Retrieves the currently active prompt with the highest version
   * for a given game type and category.
   */
  async findActivePrompt(gameType: string, category: string): Promise<AiPrompt | null> {
    return this.prisma.aiPrompt.findFirst({
      where: {
        game_type: gameType,
        category: category,
        is_active: true,
      },
      orderBy: {
        version: 'desc',
      },
    });
  }

  /**
   * Creates a new prompt record in the database.
   */
  async createPrompt(data: CreateAiPromptDto): Promise<AiPrompt> {
    const version = data.version ?? 1;
    return this.prisma.aiPrompt.create({
      data: {
        game_type: data.gameType,
        category: data.category,
        name: data.name,
        content: data.content,
        version: version,
      },
    });
  }

  /**
   * Lists all prompts, optionally filtered by game type.
   */
  async findAll(gameType?: string): Promise<AiPrompt[]> {
    return this.prisma.aiPrompt.findMany({
      where: gameType ? { game_type: gameType } : undefined,
      orderBy: [
        { game_type: 'asc' },
        { category: 'asc' },
        { version: 'desc' },
      ],
    });
  }
}
