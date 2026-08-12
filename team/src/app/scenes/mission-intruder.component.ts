import { Component, EventEmitter, OnInit, Output, computed, inject, signal } from '@angular/core';
import { MISSION3_ROUNDS } from '../content';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';

/**
 * Misión 03 / Cámara de eco — instrumento `intruder`.
 * Seleccionar y verificar: entre lecturas que respetan la evidencia, una
 * dice más de lo que puede sostener.
 */
@Component({
  selector: 'synapxix-mission-intruder',
  standalone: true,
  template: `
    <div class="mission">
      <aside class="rail">
        <span class="missionId">MISIÓN 03 / CÁMARA DE ECO</span>
        <h3>Detecta la sobreinferencia.</h3>
        <p>Una lectura responsable describe conducta situada. No convierte un momento en identidad.</p>
        <div class="signalMeter">
          <header><span>SEÑALES CAPTURADAS</span><b>{{ session.emittedCount() }}</b></header>
          <div class="meter"><i [style.width.%]="meterPct()"></i></div>
        </div>
        <div class="capture">
          <b>D.A.L.A. observa:</b><br />
          selección, latencia, revisión y uso de apoyo.
        </div>
      </aside>

      <div class="game">
        <div class="gameHead">
          <div>
            <p class="eyebrow"><b>INSTRUMENTO</b> · INTRUDER</p>
            <h2>Encuentra la frase peligrosa.</h2>
            <p>Tres frases respetan la evidencia. Una dice más de lo que puede sostener.</p>
          </div>
          <div class="gameTools">
            <button class="tool" [disabled]="hinted() || solved()" (click)="hint()">✦ Descartar una</button>
          </div>
        </div>

        <div class="intruderGrid">
          @for (claim of round().claims; track claim.text; let i = $index) {
            <button
              class="claim"
              [class.selected]="selected() === i"
              [class.discarded]="discarded().includes(i)"
              [disabled]="solved()"
              (click)="select(i)"
            >
              <small>AFIRMACIÓN {{ pad(i + 1) }}</small>
              <p>“{{ claim.text }}”</p>
            </button>
          }
        </div>

        <div class="timelineControls">
          <span class="eyebrow" style="margin: 0"><b>RONDA {{ pad(roundIndex() + 1) }}</b> / 02</span>
          <button class="btn primary" [disabled]="selected() === null || solved()" (click)="verify()">
            VERIFICAR ELECCIÓN
          </button>
        </div>

        @if (feedback(); as fb) {
          <div class="feedback" [class.bad]="!fb.good"><b>{{ fb.title }}</b>{{ fb.text }}</div>
        }
        @if (finished()) {
          <button class="btn primary" style="margin-top: 14px" (click)="continue_()">
            ABRIR SHADOW MODE →
          </button>
        }
      </div>
    </div>
  `,
})
export class MissionIntruderComponent implements OnInit {
  readonly session = inject(PulseSessionService);
  private readonly ui = inject(UiService);

  @Output() done = new EventEmitter<void>();

  readonly rounds = MISSION3_ROUNDS;
  readonly roundIndex = signal(0);
  readonly selected = signal<number | null>(null);
  readonly discarded = signal<number[]>([]);
  readonly hinted = signal(false);
  readonly solved = signal(false);
  readonly finished = signal(false);
  readonly feedback = signal<{ good: boolean; title: string; text: string } | null>(null);
  readonly meterPct = computed(() => Math.min(100, (this.session.emittedCount() / 78) * 100));

  private attempt = 0;
  private shownAt = Date.now();
  private adapter: ReturnType<PulseSessionService['startInstrument']> | null = null;

  ngOnInit() {
    this.adapter = this.session.startInstrument('intruder');
    this.presentRound();
  }

  round() {
    return this.rounds[this.roundIndex()];
  }

  pad(n: number) {
    return String(n).padStart(2, '0');
  }

  private presentRound() {
    const round = this.round();
    this.session.interact(
      { kind: 'task_shown', taskId: round.taskId, skillIds: [round.skillId], difficulty: 0.62 },
    );
    this.selected.set(null);
    this.discarded.set([]);
    this.hinted.set(false);
    this.solved.set(false);
    this.feedback.set(null);
    this.attempt = 0;
    this.shownAt = Date.now();
  }

  select(index: number) {
    if (this.solved() || this.discarded().includes(index)) return;
    this.selected.set(index);
    this.session.interact({
      kind: 'item_action',
      taskId: this.round().taskId,
      detail: { action: 'select', item: index },
    });
  }

  hint() {
    if (this.hinted() || this.solved()) return;
    this.hinted.set(true);
    this.session.interact({ kind: 'hint', taskId: this.round().taskId, level: 1 });
    const safe = this.round().claims.findIndex((c, i) => !c.bad && !this.discarded().includes(i));
    if (safe >= 0) {
      this.discarded.update((prev) => [...prev, safe]);
      if (this.selected() === safe) this.selected.set(null);
    }
    this.ui.toast('Una afirmación responsable fue descartada.');
  }

  verify() {
    const index = this.selected();
    if (index === null) return;
    this.attempt += 1;
    if (this.attempt > 1) {
      this.session.interact({ kind: 'retry', taskId: this.round().taskId, attempt: this.attempt });
    }
    const correct = this.round().claims[index].bad;
    this.session.interact({
      kind: 'answer',
      taskId: this.round().taskId,
      correct,
      latencyMs: Date.now() - this.shownAt,
      attempt: this.attempt,
    });

    if (!correct) {
      this.session.tone(230);
      this.feedback.set({
        good: false,
        title: 'Esa frase mantiene el alcance.',
        text: 'Busca la que transforma una conducta puntual en una identidad permanente.',
      });
      return;
    }

    this.session.tone(760);
    this.solved.set(true);
    this.session.interact({ kind: 'complete', taskId: this.round().taskId });
    this.feedback.set({
      good: true,
      title: 'Sobreinferencia detectada.',
      text: 'La frase convierte una señal contextual en un rasgo estable. D.A.L.A. no está autorizado a hacer eso.',
    });
    setTimeout(() => {
      if (this.roundIndex() < this.rounds.length - 1) {
        this.roundIndex.update((i) => i + 1);
        this.presentRound();
      } else {
        this.finished.set(true);
      }
    }, 1600);
  }

  continue_() {
    void this.session.endInstrument(true, this.adapter ?? undefined).then(() => this.done.emit());
  }
}
