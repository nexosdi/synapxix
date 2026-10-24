import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '@nexosdi.synapxix/prisma';
import { NotificationsService } from '../../notifications/notifications.service';

@Injectable()
export class ArchetypeService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly notificationsService: NotificationsService,
  ) {}

  async calculateArchetype(userId: string) {
    // 1. Fetch user cognitive metrics
    const metrics = await this.prisma.cognitiveMetric.findMany({
      where: { user_id: userId },
      orderBy: { created_at: 'asc' },
    });

    const sessionCount = metrics.length;
    if (sessionCount < 3) {
      return {
        status: 'insufficient_data',
        sessionCount,
        requiredSessions: 3,
      };
    }

    // 2. Fetch archetypes and dimensions with weights
    const archetypes = await this.prisma.archetype.findMany({
      include: {
        weights: {
          include: { dimension: true },
        },
      },
    });

    if (!archetypes || archetypes.length === 0) {
      throw new NotFoundException('No archetypes found in database. Did you run the seed?');
    }

    // 3. Average metrics
    let totalAccuracy = 0;
    let totalCognitiveLoad = 0;
    let totalMemory = 0;
    let totalAttention = 0;
    let totalReactionTime = 0;
    let validMemoryCount = 0;
    let validAttentionCount = 0;
    let validReactionCount = 0;

    metrics.forEach((m) => {
      totalAccuracy += m.accuracy;
      totalCognitiveLoad += m.cognitive_load;
      
      if (m.memory_retention !== null) {
        totalMemory += m.memory_retention;
        validMemoryCount++;
      }
      if (m.attention_span !== null) {
        totalAttention += m.attention_span;
        validAttentionCount++;
      }
      if (m.reaction_time !== null) {
        totalReactionTime += m.reaction_time;
        validReactionCount++;
      }
    });

    const avgAccuracy = totalAccuracy / sessionCount;
    const avgCognitiveLoad = totalCognitiveLoad / sessionCount;
    const avgMemory = validMemoryCount > 0 ? totalMemory / validMemoryCount : 0.5;
    const avgAttention = validAttentionCount > 0 ? totalAttention / validAttentionCount : 0.5;
    const avgReactionTime = validReactionCount > 0 ? totalReactionTime / validReactionCount : 3000;

    // Normalize metrics
    // Lógica = accuracy
    const valLogica = avgAccuracy;
    
    // Creatividad = inverso de cognitive_load (asumiendo max 100)
    const valCreatividad = Math.max(0, Math.min(1, 1 - (avgCognitiveLoad / 100)));
    
    // Memoria = memory_retention
    const valMemoria = avgMemory;
    
    // Atención = attention_span
    const valAtencion = avgAttention;
    
    // Velocidad = inverso de reaction_time (asumiendo max 5000ms para puntaje 0)
    const valVelocidad = Math.max(0, Math.min(1, 1 - (avgReactionTime / 5000)));

    const dimensionValues = {
      'Lógica': valLogica,
      'Creatividad': valCreatividad,
      'Memoria': valMemoria,
      'Atención': valAtencion,
      'Velocidad': valVelocidad,
    };

    // 4. Calculate scores for each archetype
    const scores: Record<string, number> = {};
    let dominantArchetype = null;
    let maxScore = -1;

    for (const archetype of archetypes) {
      let score = 0;
      for (const w of archetype.weights) {
        const dimName = w.dimension.name;
        const val = dimensionValues[dimName as keyof typeof dimensionValues] || 0;
        score += w.weight * val;
      }
      
      scores[archetype.name] = score;

      if (score > maxScore) {
        maxScore = score;
        dominantArchetype = archetype;
      }
    }

    if (sessionCount === 3 && dominantArchetype) {
      const existing = await this.prisma.notification.findFirst({
        where: { user_id: userId, title: '¡Arquetipo descubierto!' },
      });
      if (!existing) {
        await this.notificationsService.create(
          {
            userId,
            title: '¡Arquetipo descubierto!',
            message: `Has completado tus primeras 3 sesiones. Tu arquetipo dominante es: ${dominantArchetype.name}.`,
          },
          undefined,
          true
        ).catch(e => console.error('Error enviando notificación de arquetipo', e));
      }
    }

    return {
      status: 'calculated',
      archetype: dominantArchetype ? {
        id: dominantArchetype.archetype_id,
        name: dominantArchetype.name,
        description: dominantArchetype.description,
      } : null,
      scores,
      dimensions: dimensionValues,
      sessionCount,
    };
  }
}
