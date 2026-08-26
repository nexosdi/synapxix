import { Component, EventEmitter, OnInit, Output, computed, inject, signal } from '@angular/core';
import { CYCLE_STEPS, MISSION2_HINT, MISSION2_INSTRUCTIONS } from '../content';
import { PulseSessionService } from '../services/pulse-session.service';
import { UiService } from '../services/ui.service';

/**
 * Misión 02 / Ciclo — instrumento `timeline-order`.
 * Construcción libre + verificación deliberada: colocar es acción,
 * deshacer no cuesta, verificar es la respuesta. "Cambiar enfoque" emite
 * un strategy_changed genuino.
 */
@Component({
  selector: 'synapxix-mission-timeline',
  standalone: true,
  template: `
    <div class="mission">
      <aside class="rail">
        <span class="missionId">MISIÓN 02 / CICLO</span>
        <div class="signalMeter">
          <header><span>SEÑALES</span><b>{{ session.emittedCount() }}</b></header>
          <div class="meter"><i [style.width.%]="meterPct()"></i></div>
        </div>
      </aside>

      <div class="game">
        <div class="gameHead">
          <div>
            <p class="eyebrow"><b>INSTRUMENTO</b> · TIMELINE-ORDER</p>
            <h2>Cierra el ciclo.</h2>
            <p>Ordena las seis piezas. Puedes construir, deshacer y verificar cuando estés lista/o.</p>
          </div>
          <div class="gameTools">
            <button class="tool" (click)="openInstructions()">? Consigna</button>
            <button class="tool" (click)="hint()">✦ Pedir pista</button>
          </div>
        </div>

        <div class="timelinePool">
          @for (step of pool(); track step) {
            <button class="token" [class.used]="selected().includes(step)" (click)="place(step)">
              {{ step }}
            </button>
          }
        </div>

        <div class="timeline">
          @if (selected().length === 0) {
            <span class="timelineEmpty">Toca las piezas para reconstruir el ciclo</span>
          }
          @for (step of selected(); track step) {
            <div class="stepChip">{{ step }}</div>
          }
        </div>

        <div class="timelineControls">
          <div class="approach">
            <button class="btn secondary" (click)="undo()">↶ Deshacer</button>
            <button class="btn soft" (click)="shift()">⇄ Cambiar enfoque</button>
          </div>
          <button class="btn primary" [disabled]="selected().length !== steps.length || verified()" (click)="verify()">
            VERIFICAR CICLO
          </button>
        </div>

        @if (hintVisible()) {
          <div class="hintBox">{{ hintText }}</div>
        }
        @if (feedback(); as fb) {
          <div class="feedback" [class.bad]="!fb.good"><b>{{ fb.title }}</b>{{ fb.text }}</div>
        }
        @if (verified()) {
          <button class="btn primary" style="margin-top: 14px" (click)="continue_()">
            CRUZAR A LA CÁMARA DE ECO →
          </button>
        }
      </div>
    </div>
  `,
})
export class MissionTimelineComponent implements OnInit {
  readonly session = inject(PulseSessionService);
  private readonly ui = inject(UiService);

  @Output() done = new EventEmitter<void>();

  readonly steps = CYCLE_STEPS;
  readonly hintText = MISSION2_HINT;
  readonly pool = signal<string[]>([]);
  readonly selected = signal<string[]>([]);
  readonly verified = signal(false);
  readonly hintVisible = signal(false);
  readonly feedback = signal<{ good: boolean; title: string; text: string } | null>(null);
  readonly meterPct = computed(() => Math.min(100, (this.session.emittedCount() / 55) * 100));

  private readonly taskId = 'ciclo';
  private attempt = 0;
  private adapter: ReturnType<PulseSessionService['startInstrument']> | null = null;

  ngOnInit() {
    this.adapter = this.session.startInstrument('timeline-order');
    this.session.interact({
      kind: 'task_shown',
      taskId: this.taskId,
      skillIds: ['systems_thinking'],
      difficulty: 0.56,
    });
    // Mezcla fija del prototipo: comparable entre personas.
    this.pool.set(['Intervención', 'Estado', 'Actualización', 'Evidencia', 'Outcome', 'Decisión']);
  }

  openInstructions() {
    this.session.interact({ kind: 'instructions_opened', taskId: this.taskId });
    this.ui.openModal(MISSION2_INSTRUCTIONS);
  }

  hint() {
    if (this.verified()) return;
    this.session.interact({ kind: 'hint', taskId: this.taskId, level: 1 });
    this.hintVisible.set(true);
  }

  place(step: string) {
    if (this.verified() || this.selected().includes(step)) return;
    this.selected.update((prev) => [...prev, step]);
    this.session.interact(
      { kind: 'item_action', taskId: this.taskId, detail: { action: 'place', item: step, position: this.selected().length } },
    );
    this.session.tone(600);
  }

  undo() {
    if (this.verified()) return;
    const current = this.selected();
    const last = current[current.length - 1];
    if (!last) return;
    this.selected.update((prev) => prev.slice(0, -1));
    this.session.interact({ kind: 'item_action', taskId: this.taskId, detail: { action: 'undo', item: last } });
  }

  shift() {
    if (this.verified()) return;
    this.session.interact({
      kind: 'strategy_shift',
      taskId: this.taskId,
      from: 'forward_build',
      to: 'outcome_backward',
    });
    this.selected.set([]);
    this.ui.toast('Cambio registrado. Puedes reconstruir desde el efecto hacia atrás.');
    this.session.tone(760);
  }

  verify() {
    this.attempt += 1;
    if (this.attempt > 1) {
      this.session.interact({ kind: 'retry', taskId: this.taskId, attempt: this.attempt });
    }
    const correct = JSON.stringify(this.selected()) === JSON.stringify(this.steps);
    this.session.interact({ kind: 'answer', taskId: this.taskId, correct, attempt: this.attempt });

    if (!correct) {
      this.session.tone(230);
      this.feedback.set({
        good: false,
        title: 'El ciclo todavía queda abierto.',
        text: 'Revisa qué debe existir antes de intervenir y qué debe observarse antes de actualizar.',
      });
      return;
    }

    this.session.tone(760);
    this.session.interact({ kind: 'complete', taskId: this.taskId });
    this.feedback.set({
      good: true,
      title: 'Ciclo cerrado.',
      text: 'La arquitectura no actualiza un estado porque una IA habló; lo actualiza cuando un outcome autorizado demuestra qué ocurrió.',
    });
    this.verified.set(true);
  }

  continue_() {
    void this.session.endInstrument(true, this.adapter ?? undefined).then(() => this.done.emit());
  }
}
