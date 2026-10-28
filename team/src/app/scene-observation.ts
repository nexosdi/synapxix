/**
 * Lo único que una escena sabe de D.A.L.A.: el vocabulario de observaciones.
 * Las escenas no conocen sujeto, sesión, transporte ni consentimiento; eso
 * lo agrega el puente en la cáscara (arquitectura del piloto, §19).
 */
export type { Observation as SceneObservation } from '@nexosdi.synapxix/dala/instrumentation';

/** Escenas D.A.L.A. del piloto y su clave en el marco. */
export const SCENE_OF_SCREEN: Record<string, string> = {
  nucleo: 'nucleo',
  caso: 'caso',
  fuentes: 'fuentes',
  instantanea: 'instantanea',
  superpoderes: 'superpoderes',
  motivaciones: 'motivaciones',
  desafio: 'desafio',
  equipo: 'equipo',
  trabajo: 'trabajo',
  shadow: 'decision',
  result: 'retrato',
};
