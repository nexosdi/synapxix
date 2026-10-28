/**
 * D.A.L.A.™ — Marco de referencia como código (Fundacional §5).
 *
 * El marco es el conjunto versionado de definiciones que conecta lo que
 * queremos conocer con lo que una experiencia permite observar. Vive como
 * datos tipados: la mesa metodológica lo revisa por pull request, el CI lo
 * valida y el motor lo ejecuta. Cambiar una ficha es cambiar el estándar:
 * exige nueva versión.
 */
import type { DalaAmbitoId, DalaEventTypeV2 } from '@nexosdi.synapxix/dala/contracts';

/** Ámbito de referencia (§4): familia de preguntas, no dimensión psicológica. */
export interface AmbitoDef {
  id: DalaAmbitoId;
  name: string;
  question: string;
  /** Qué se necesitaría para observarlo cuando la experiencia no lo permite. */
  withoutOpportunity: string;
}

/** Tipos de oportunidad que una escena puede abrir. */
export type OpportunityKind =
  | 'declaracion'
  | 'consigna'
  | 'tarea'
  | 'exploracion'
  | 'eleccion_formato'
  | 'recomendacion_ia'
  | 'revision_afirmacion'
  | 'preferencia'
  | 'eleccion_ruta'
  | 'eleccion_desafio'
  | 'eleccion_apoyo'
  | 'habilidad'
  | 'motivacion'
  | 'eleccion_tarea'
  | 'situacion_equipo';

/**
 * Métodos de estimación versionados (§8 "Métodos según la pregunta"). La
 * ficha declara qué método usa; el método vive en el dominio, puro y
 * reproducible. En el piloto todos son descriptivos: numerador sobre
 * oportunidades válidas, sin probabilidades.
 */
export type MethodRef =
  | 'tasa_independiente@0.1'
  | 'ayuda_tras_intento@0.1'
  | 'persistencia@0.1'
  | 'consigna_previa@0.1'
  | 'cambio_tras_fallo@0.1'
  | 'revision_previa@0.1'
  | 'exploracion@0.1'
  | 'revision_ia@0.1'
  | 'desafio@0.1'
  | 'colaboracion@0.1'
  | 'habilidades@0.1'
  | 'motivaciones@0.1'
  | 'estilo_equipo@0.1'
  | 'coherencia_habilidad@0.1';

/** Requisitos para cada estado de evidencia. Provisionales: se calibran. */
export interface Sufficiency {
  /** Mínimo de oportunidades válidas para abrir una hipótesis. */
  provisional: { minOpportunities: number };
  /** Para "respaldada en el contexto": cantidad, diversidad y consistencia. */
  supported: { minOpportunities: number; minScenes: number; consistency: number };
  /** Declaración explícita de que los umbrales no están calibrados. */
  calibrated: false;
}

/** Ficha de constructo (§5 y Anexo 22). */
export interface ConstructSheet {
  id: string;
  version: string;
  ambito: DalaAmbitoId;
  name: string;
  question: string;
  operationalDefinition: string;
  opportunityKind: OpportunityKind;
  observables: string[];
  method: MethodRef;
  /**
   * Frase de la afirmación. Marcadores: {n} {d} {skill} {declared} {verdict}
   * y {detail.<clave>}. Describe alcance y evidencia; nunca una etiqueta.
   */
  claimTemplate: string;
  /** Frases adicionales que se agregan solo si su detalle es mayor que cero. */
  claimExtras?: Array<{ when: string; text: string }>;
  alternatives: string[];
  nextCheck: string;
  /** Qué inferencias exceden su alcance (§5 "Ficha de constructo"). */
  limits: string;
  sufficiency: Sufficiency;
  decisionsInformed: string[];
  /** Si la afirmación se abre por habilidad (alcance curricular). */
  perSkill?: boolean;
}

/** Oportunidad declarada por una escena (Anexo 23 "Decisiones disponibles"). */
export interface SceneOpportunity {
  kind: OpportunityKind;
  description: string;
  exposureEvents: DalaEventTypeV2[];
  actionEvents: DalaEventTypeV2[];
}

/** SceneSpec: contrato de una escena (§6 y Anexo 23). */
export interface SceneSpec {
  id: string;
  version: string;
  title: string;
  purpose: string;
  /** Habilidad curricular que la escena ejercita, si la hay. */
  skill?: string;
  opportunities: SceneOpportunity[];
  /** Capacidades de la escena que habilitan ciertos indicadores. */
  affordances: { strategyOption?: boolean; revisable?: boolean; skipAfterError?: boolean };
  variablesToControl: string[];
  exclusions: string[];
  contrast: string;
}

/** Opción del catálogo de decisiones (§12 "Contrato de decisión"). */
export interface DecisionOption {
  id: string;
  label: string;
  purpose: string;
  /** Configuración del contenido que se asigna si se elige esta opción. */
  content: { scene: string; hintAvailable: boolean };
  verification: string;
  expectedOutcome: { metric: string; description: string };
}

export interface DalaFramework {
  version: string;
  ambitos: AmbitoDef[];
  skills: Record<string, string>;
  constructs: ConstructSheet[];
  scenes: SceneSpec[];
  decisions: DecisionOption[];
  /** Equivalencias para triangular lo declarado con lo elegido. */
  declaredToChoice: Record<string, string>;
  /** Opción no personalizada asignada cuando se rechaza una recomendación. */
  baselineDecision: string;
}
