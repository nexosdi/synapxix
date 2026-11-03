import { ARCHETYPE_META, computeArchetypeAffinity, TEAM_ARCHETYPES } from './archetype';

describe('afinidad de arquetipos (vista narrativa)', () => {
  it('es determinista: misma entrada, misma salida', () => {
    const input = {
      declared: { entryMode: 'explore' as const, workRhythm: 'prototype' as const },
      constructs: { persistence: { value: 0.8, confidence: 0.6, status: 'supported' } },
    };
    const a = computeArchetypeAffinity(input.declared, input.constructs);
    const b = computeArchetypeAffinity(input.declared, input.constructs);
    expect(a).toEqual(b);
  });

  it('devuelve los 6 arquetipos ordenados por afinidad, en 0..1', () => {
    const result = computeArchetypeAffinity(
      { entryMode: 'map', workRhythm: 'align', feedbackMode: 'questions', shareConditions: true },
      {},
    );
    expect(result).toHaveLength(TEAM_ARCHETYPES.length);
    expect(result[0].affinity).toBe(1);
    for (const row of result) {
      expect(row.affinity).toBeGreaterThanOrEqual(0);
      expect(row.affinity).toBeLessThanOrEqual(1);
    }
    const sorted = [...result].sort((a, b) => b.affinity - a.affinity);
    expect(result).toEqual(sorted);
  });

  it('lo declarado pesa: quien pide el mapa y alinea tiende a analitico_metodico', () => {
    const result = computeArchetypeAffinity(
      { entryMode: 'map', workRhythm: 'align', feedbackMode: 'direct' },
      {},
    );
    expect(result[0].archetype).toBe('analitico_metodico');
    expect(result[0].signals.length).toBeGreaterThan(0);
  });

  it('ignora constructos sin evidencia suficiente (no etiqueta sin base)', () => {
    const withInsufficient = computeArchetypeAffinity(
      { entryMode: 'explore' },
      { help_seeking: { value: 0.9, confidence: 0.9, status: 'insufficient_evidence' } },
    );
    const without = computeArchetypeAffinity({ entryMode: 'explore' }, {});
    expect(withInsufficient).toEqual(without);
  });

  it('cada arquetipo tiene metadatos de presentación con la paleta del documento', () => {
    for (const archetype of TEAM_ARCHETYPES) {
      expect(ARCHETYPE_META[archetype].label).toBeTruthy();
      expect(ARCHETYPE_META[archetype].accentA).toMatch(/^#/);
    }
  });
});
