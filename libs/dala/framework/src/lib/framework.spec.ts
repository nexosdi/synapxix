import { PULSO_WEB_FRAMEWORK } from './pulso-web.framework';
import { validateFramework } from './validate';

describe('marco pulso-web@0.2', () => {
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
