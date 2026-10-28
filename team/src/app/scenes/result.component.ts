import { Component, ElementRef, EventEmitter, OnInit, Output, computed, inject, signal } from '@angular/core';
import type { DalaClaim } from '@nexosdi.synapxix/dala/contracts';
import { STAR_WORDS } from '../content';
import { downloadJson, downloadSvg } from '../download';
import type { SceneObservation } from '../scene-observation';
import { PulseApiService, type PulseReport, type ReplayCheck } from '../services/pulse-api.service';
import { PulseSessionService, type EstrellaState } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';
import { EstrellaComponent, topOf } from './estrella.component';
import { GraciasComponent } from './gracias.component';
import { RetratoComponent, type ClaimVerdict } from './retrato.component';

/** Las cinco puntas de la estrella, en orden: un ámbito cada una. */
const STAR_AMBITOS = ['conocimientos', 'pensamiento', 'autorregulacion', 'interaccion', 'intereses'];
const LEVEL: Record<string, number> = { sin_oportunidad_suficiente: 0, hipotesis_provisional: 1, respaldada_en_contexto: 2 };

/** Lo observado, dicho en segunda persona para la frase de la estrella. */
const OBSERVED: Record<string, (n: number, d: number) => string> = {
  persistencia_tras_error: (n, d) => `después de equivocarte seguiste hasta resolver en ${n} de ${d}`,
  autocorreccion_previa: (n, d) => `revisaste antes de enviar en ${n} de ${d}`,
  exploracion_voluntaria: (n, d) => `abriste ${n} de ${d} contenidos opcionales`,
  busqueda_de_ayuda: (n, d) => `pediste ayuda después de intentar en ${n} de ${d}`,
  apoyo_en_personas: (n, d) => `te apoyaste en alguien del equipo en ${n} de ${d} momentos`,
  colaboracion_critica_ia: (n, d) => `abriste las razones de la IA antes de decidir en ${n} de ${d}`,
};

/**
 * Escena retrato. Recalcula la instantánea desde el registro de eventos,
 * comprueba que el recálculo es reproducible y recoge la revisión de la
 * persona sobre cada afirmación (origen declarado: cambia el estado de
 * revisión, nunca el de evidencia).
 */
@Component({
  selector: 'synapxix-result',
  standalone: true,
  imports: [RetratoComponent, EstrellaComponent, GraciasComponent],
  template: `
    @if (report(); as r) {
      @if (star(); as st) {
        <section class="starHero">
          <synapxix-estrella [state]="st.state" [points]="st.points" [label]="'Estrella Synapxix de ' + firstName()" />
          <div class="splitCopy">
            <p class="eyebrow"><b>TU ESTRELLA SYNAPXIX</b></p>
            <h1>{{ firstName() }}, esta es tu estrella.</h1>
            <p class="starPhrase">{{ st.phrase }}</p>
            <p class="beatNote soft">
              Cada marca es algo que contaste o hiciste, y cada punta crece con su evidencia. Es un avatar, no una medición: cambia cuando volvés a jugar.
            </p>
            <div class="starActions">
              <button class="btn secondary" (click)="downloadStar()">DESCARGAR MI ESTRELLA</button>
            </div>
          </div>
        </section>
      }
      <synapxix-gracias />
      <synapxix-retrato
        [report]="r"
        [replay]="replay()"
        [heading]="'Acá está tu modelo longitudinal. Sigamos construyéndolo.'"
        [lead]="'Todo lo que hiciste esta semana, con su evidencia. Cada vez que vuelvas se suma a lo de hoy, y vas a ver qué cambió.'"
        [name]="session.memberName()"
        [reviewable]="true"
        [reviewed]="reviewed()"
        [traceLoader]="traceLoader"
        (review)="review($event.claimKey, $event.verdict)"
      />
      <div class="retratoActions">
        <button class="btn secondary" [disabled]="refreshing()" (click)="refresh()">
          {{ refreshing() ? 'RECALCULANDO…' : 'RECALCULAR CON MIS REVISIONES ↻' }}
        </button>
        <button class="btn ghost" (click)="download()">DESCARGAR MIS DATOS SEUDÓNIMOS</button>
      </div>
      <p class="footNote retratoNote">
        Este retrato es una hipótesis de trabajo para esta experiencia. No sirve para seleccionar,
        clasificar ni comparar personas. Podés pedir el retiro de tus datos cuando quieras.
      </p>
    } @else {
      <div class="feedback" style="margin-top: 40px">
        <b>{{ error() ? 'No pudimos cargar tu retrato.' : 'Proyectando tus eventos…' }}</b>
        {{ error() || 'El motor recorre el registro completo en orden canónico; el mismo registro siempre da el mismo retrato.' }}
      </div>
    }
  `,
})
export class ResultComponent implements OnInit {
  readonly session = inject(PulseSessionService);
  private readonly api = inject(PulseApiService);
  private readonly ui = inject(UiService);

  @Output() observe = new EventEmitter<SceneObservation>();

  readonly report = signal<PulseReport | null>(null);
  readonly replay = signal<ReplayCheck | null>(null);
  readonly reviewed = signal<Record<string, ClaimVerdict>>({});
  readonly refreshing = signal(false);
  readonly error = signal('');

  readonly traceLoader = (claimKey: string) => this.api.traceClaim(claimKey);
  private readonly host = inject(ElementRef<HTMLElement>);

  firstName() {
    return this.session.memberName().split(' ')[0];
  }

  /**
   * La estrella: las marcas de lo que contó e hizo en la semana, y las
   * puntas de la evidencia de cada ámbito. La frase pone ambos lado a lado.
   */
  readonly star = computed(() => {
    const r = this.report();
    const state = this.session.estrella();
    if (!r || !state.superpoderes.length) return null;
    const claims = r.snapshot.claims.filter((c) => c.observation.denominator > 0);
    const points = STAR_AMBITOS.map((a) => Math.max(0, ...claims.filter((c) => c.ambito === a).map((c) => LEVEL[c.evidenceStatus] ?? 0)));
    return { state, points, phrase: phraseFor(state, claims) };
  });

  downloadStar() {
    const svg = (this.host.nativeElement as HTMLElement).querySelector('.starHero svg') as SVGSVGElement | null;
    if (svg) downloadSvg(svg, `estrella-synapxix-${this.firstName().toLowerCase()}.svg`);
  }

  async ngOnInit() {
    await this.load();
    void this.api.complete().catch(() => undefined);
  }

  review(claimKey: string, verdict: ClaimVerdict) {
    this.observe.emit({
      type: 'claim_reviewed',
      opportunity: { id: `retrato:${claimKey}`, kind: 'revision_afirmacion' },
      origin: 'reported',
      payload: { claimKey, verdict },
    });
    this.reviewed.update((prev) => ({ ...prev, [claimKey]: verdict }));
    this.ui.tone(650);
  }

  async refresh() {
    this.refreshing.set(true);
    try {
      await this.load();
      this.ui.toast('Nueva instantánea encadenada a la anterior.');
    } finally {
      this.refreshing.set(false);
    }
  }

  async download() {
    downloadJson(await this.api.exportOwn(), `dala-export-${this.session.subjectId()?.slice(0, 8)}.json`);
  }

  private async load() {
    try {
      await this.session.flush();
      // Con la instantánea A, el retrato muestra qué cambió con la semana.
      this.report.set(await this.api.report(this.session.snapshotA()));
      this.replay.set(null);
      this.replay.set(await this.api.replay());
    } catch {
      this.error.set('Revisá la conexión y volvé a intentar: tus eventos siguen guardados.');
    }
  }
}

/** Une una lista en castellano: «a, b y c». */
function joinList(items: string[]) {
  return items.length > 1 ? `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}` : items.join('');
}

/**
 * «Lo que contaste» y «lo que vimos» en dos frases, sin etiquetas: lo que
 * le sale natural, lo que la mueve y cómo trabaja; y de lo observado, cómo
 * actuó en equipo y el hecho con más oportunidades entre los que pasan de
 * la mitad (o el desempeño en el desafío si ninguno lo hace).
 */
function phraseFor(state: EstrellaState, claims: DalaClaim[]) {
  const motivacion = topOf(state.motivaciones);
  const forma = state.trabajo['forma'];
  const said = [
    `te sale natural ${joinList(state.superpoderes.map((s) => s.label.toLowerCase()))}`,
    motivacion ? `te mueve ${STAR_WORDS.motivacion[motivacion]}` : '',
    forma ? `trabajás mejor ${STAR_WORDS.forma[forma]}` : '',
  ].filter(Boolean);
  const seen: string[] = [];
  const estilo = claims.find((c) => c.key === 'estilo_colaboracion');
  const top = String(estilo?.observation.detail['top'] ?? '');
  if (estilo && top) {
    seen.push(`en equipo elegiste «${top.toLowerCase()}» en ${estilo.observation.numerator} de ${estilo.observation.denominator} situaciones`);
  }
  const strong = claims
    .filter((c) => OBSERVED[c.key] && c.observation.numerator * 2 >= c.observation.denominator)
    .sort((a, b) => b.observation.denominator - a.observation.denominator)[0];
  const tasks = claims.filter((c) => c.key.startsWith('desempeno_independiente:') && c.scope.scenes.some((sc) => sc.startsWith('desafio_')));
  const n = tasks.reduce((a, c) => a + c.observation.numerator, 0);
  const d = tasks.reduce((a, c) => a + c.observation.denominator, 0);
  if (strong) seen.push(OBSERVED[strong.key](strong.observation.numerator, strong.observation.denominator));
  else if (d) seen.push(`resolviste sin ayuda ${n} de ${d} tareas del desafío`);
  const first = `Contaste que ${joinList(said)}.`;
  return seen.length ? `${first} Y esta semana vimos que ${joinList(seen)}.` : first;
}
