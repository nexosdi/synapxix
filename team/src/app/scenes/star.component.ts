import { Component, Input, OnInit, inject, signal } from '@angular/core';
import { DomSanitizer, type SafeHtml } from '@angular/platform-browser';
import type { PulseReport } from '../services/pulse-api.service';
import { PulseApiService } from '../services/pulse-api.service';
import { PulseSessionService } from '../services/pulse-session.service';
import { downloadPng, downloadSvg, renderStarSvg } from '../star/star-svg';

/**
 * Escena 7 — Tu Estrella Synapxix (opcional, como pide el documento).
 * El arquetipo es VISTA NARRATIVA: se calcula con lo declarado + señales
 * contextuales, se elige, y jamás vuelve a entrar al motor de decisión.
 */
@Component({
  selector: 'synapxix-star',
  standalone: true,
  template: `
    <section class="scene-panel">
      <span class="eyebrow">VISTA NARRATIVA · OPCIONAL · TUYA</span>
      <h2>Tu Estrella <em>Synapxix</em></h2>
      <p class="scene-lead">
        Una lectura amable de tu energía en esta experiencia — no una etiqueta. Elegí la que más
        te suene: la afinidad es una sugerencia, la identidad es tuya.
      </p>

      <div class="star-layout">
        <div>
          <div class="star-frame" [innerHTML]="svgSafe()"></div>
          <div class="scene-actions" style="margin-top: 16px; justify-content: center">
            <button class="btn btn-soft" (click)="downloadAsSvg()">Descargar SVG</button>
            <button class="btn btn-soft" (click)="downloadAsPng()">Descargar PNG</button>
          </div>
          @if (aiAvailable()) {
            <div class="scene-actions" style="justify-content: center; margin-top: 4px">
              <button class="btn btn-ghost" [disabled]="aiLoading()" (click)="generateAi()">
                {{ aiLoading() ? 'Ilustrando…' : '✨ Versión ilustrada con IA' }}
              </button>
            </div>
          }
          @if (aiImage(); as img) {
            <div class="star-frame" style="margin-top: 16px">
              <img [src]="img" alt="Estrella ilustrada con IA" />
            </div>
          }
        </div>

        <div>
          <div class="archetype-list">
            @for (option of archetypes(); track option.archetype) {
              <button
                class="archetype-row"
                [class.active]="selected() === option.archetype"
                (click)="select(option.archetype)"
              >
                <span class="dot" [style.background]="option.meta.accentA"></span>
                <span>
                  <b>{{ option.meta.label }}</b>
                  <small>{{ option.signals.slice(0, 2).join(' · ') || option.meta.mood }}</small>
                </span>
                <span class="affinity">{{ percent(option.affinity) }}</span>
              </button>
            }
          </div>

          <div class="result-note">
            <b>Por qué esta sugerencia:</b> {{ topSignals() }}.
            <br /><b>Qué no es:</b> diagnóstico, ranking ni predicción. En D.A.L.A., estados — no etiquetas.
          </div>

          @if (saved()) {
            <div class="feedback-banner good">
              Pulso completo. Gracias por prestarle tu curiosidad al sistema que vamos a ofrecerles a los chicos.
              Tu traza queda disponible para vos y para calibrar D.A.L.A.
            </div>
          } @else {
            <div class="scene-actions">
              <span></span>
              <button class="btn btn-primary" [disabled]="saving()" (click)="finish()">
                {{ saving() ? 'Guardando…' : 'Guardar mi estrella y terminar ✔' }}
              </button>
            </div>
          }
        </div>
      </div>
    </section>
  `,
})
export class StarComponent implements OnInit {
  private readonly api = inject(PulseApiService);
  private readonly session = inject(PulseSessionService);
  private readonly sanitizer = inject(DomSanitizer);

  @Input({ required: true }) report!: PulseReport;

  readonly selected = signal('');
  readonly svg = signal('');
  readonly svgSafe = signal<SafeHtml>('');
  readonly saved = signal(false);
  readonly saving = signal(false);
  readonly aiAvailable = signal(true); // se apaga solo si el server dice 503
  readonly aiLoading = signal(false);
  readonly aiImage = signal<string | null>(null);

  archetypes() {
    return this.report.archetypes;
  }

  ngOnInit() {
    const top = this.report.archetypes[0];
    if (top) this.select(top.archetype);
  }

  select(archetype: string) {
    this.selected.set(archetype);
    const option = this.report.archetypes.find((a) => a.archetype === archetype);
    if (!option) return;
    const svg = renderStarSvg({
      name: this.session.memberName(),
      archetype: option.archetype,
      label: option.meta.label,
      accentA: option.meta.accentA,
      accentB: option.meta.accentB,
      mood: option.meta.mood,
      glow: option.affinity,
    });
    this.svg.set(svg);
    // La SVG la generamos nosotros con contenido escapado: es seguro confiarla.
    this.svgSafe.set(this.sanitizer.bypassSecurityTrustHtml(svg));
    this.aiImage.set(null);
  }

  topSignals() {
    const option = this.report.archetypes.find((a) => a.archetype === this.selected());
    return option?.signals.join(', ') || 'tu recorrido en la experiencia';
  }

  percent(x: number) {
    return `${Math.round(x * 100)}%`;
  }

  downloadAsSvg() {
    downloadSvg(this.svg(), `estrella-synapxix-${this.slug()}.svg`);
  }

  downloadAsPng() {
    void downloadPng(this.svg(), `estrella-synapxix-${this.slug()}.png`);
  }

  async generateAi() {
    this.aiLoading.set(true);
    try {
      const result = await this.api.starAi(this.selected());
      this.aiImage.set(`data:${result.mimeType};base64,${result.base64}`);
    } catch {
      // Sin GEMINI_API_KEY (o con fallo): la paramétrica sigue siendo la estrella.
      this.aiAvailable.set(false);
    } finally {
      this.aiLoading.set(false);
    }
  }

  async finish() {
    this.saving.set(true);
    try {
      await this.api.complete(this.selected());
      await this.session.flushAll();
      this.saved.set(true);
    } finally {
      this.saving.set(false);
    }
  }

  private slug() {
    return this.session.memberName().toLowerCase().replace(/\s+/g, '-') || 'pulso';
  }
}
