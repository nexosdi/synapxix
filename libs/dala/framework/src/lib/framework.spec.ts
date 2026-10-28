import { PULSO_WEB_FRAMEWORK } from './pulso-web.framework';
import { validateFramework } from './validate';

describe('marco pulso-web@0.4', () => {
  it('es íntegro: referencias, versiones, alternativas y contrastes', () => {
    expect(validateFramework(PULSO_WEB_FRAMEWORK)).toEqual([]);
  });

  it('cubre los 7 ámbitos del Fundacional', () => {
    expect(PULSO_WEB_FRAMEWORK.ambitos.map((a) => a.id)).toEqual([
      'conocimientos',
      'pensamiento',
      'autorregulacion',
      'interaccion',
      'intereses',
      'digital_ia',
      'contexto',
    ]);
  });

  it('ningún umbral se presenta como calibrado', () => {
    for (const c of PULSO_WEB_FRAMEWORK.constructs) {
      expect(c.sufficiency.calibrated).toBe(false);
    }
  });

  it('detecta un marco roto', () => {
    const roto = {
      ...PULSO_WEB_FRAMEWORK,
      constructs: [
        { ...PULSO_WEB_FRAMEWORK.constructs[0], ambito: 'personalidad' as never, alternatives: [] },
      ],
    };
    const errors = validateFramework(roto);
    expect(errors.some((e) => e.includes('ámbito inexistente'))).toBe(true);
    expect(errors.some((e) => e.includes('sin explicaciones alternativas'))).toBe(true);
  });
});

describe('escenas 06–09 del documento de trabajo', () => {
  it('toda escena con tareas declara la habilidad que ejercita', () => {
    for (const scene of PULSO_WEB_FRAMEWORK.scenes) {
      if (scene.opportunities.some((o) => o.kind === 'tarea')) expect(scene.skill).toBeDefined();
    }
  });

  it('el registro empieza en el núcleo, antes de la primera semana', () => {
    const ids = PULSO_WEB_FRAMEWORK.scenes.map((s) => s.id);
    expect(ids.slice(0, 5)).toEqual(['nucleo', 'caso', 'fuentes', 'instantanea', 'superpoderes']);
  });
});
