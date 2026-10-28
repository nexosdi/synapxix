import { Component, Input } from '@angular/core';
import { FAMILY_ACCENT, MOTIVATORS } from '../content';
import type { EstrellaState } from '../services/pulse-session.service';

const CX = 200;
const CY = 208;

/** Destellos posibles alrededor de la estrella (se encienden con lo resuelto). */
const SPARKLES = [
  { x: 74, y: 92 },
  { x: 334, y: 120 },
  { x: 58, y: 270 },
  { x: 346, y: 300 },
  { x: 128, y: 356 },
  { x: 286, y: 54 },
];

/** Lugares de las gemas: tres superpoderes y, aparte, lo que quiere aprender. */
const GEM_SLOTS = [
  { x: 112, y: 132 },
  { x: 292, y: 140 },
  { x: 200, y: 360 },
];
const LEARN_SLOT = { x: 314, y: 262 };

/** Estrellas compañeras según cómo prefiere trabajar. */
const COMPANIONS: Record<string, Array<{ x: number; y: number; r: number }>> = {
  solo: [],
  pareja: [{ x: 338, y: 62, r: 26 }],
  alterno: [
    { x: 338, y: 62, r: 24 },
    { x: 60, y: 344, r: 18 },
  ],
  equipo: [
    { x: 338, y: 62, r: 24 },
    { x: 56, y: 70, r: 18 },
    { x: 346, y: 352, r: 20 },
  ],
};

/** El cielo según el momento del día en que rinde más. */
const SKY: Record<string, string> = { manana: '#FFF4D6', tarde: '#FFE6D9', noche: '#E4E6FF', flexible: '#E8F7EE' };
const CANAL_GLYPH: Record<string, string> = { chat: '···', llamada: '☏', persona: '◉', mail: '✉' };
const FEEDBACK_GLYPH: Record<string, string> = { directo: '!', ejemplos: '“ ”', escrito: '≡', charla: '◡◡' };

/** Una cuenta sobre un arco del aura: motivaciones arriba, equipo abajo. */
function onArc(i: number, count: number, from: number, to: number, r: number) {
  const step = count > 1 ? (to - from) / (count - 1) : 0;
  const a = ((from + i * step) * Math.PI) / 180;
  return { x: CX + r * Math.cos(a), y: CY + r * Math.sin(a) };
}

/**
 * Estrella Synapxix: un avatar narrativo, no una medición. Cada respuesta
 * deja una marca visible: una gema por superpoder (y una abierta por lo que
 * quiere aprender), el aura y una cuenta por cada elección de motivación,
 * el borde del color del desafío elegido, destellos por lo resuelto, una
 * cuenta por cada momento con el equipo y, de cómo trabaja, el cielo, las
 * compañeras, el globo de devolución, el canal, el ritmo y la expresión.
 * Las puntas crecen con la evidencia de cada ámbito. Determinista: mismos
 * datos, misma estrella.
 */
@Component({
  selector: 'synapxix-estrella',
  standalone: true,
  template: `
    <svg class="starAvatar" viewBox="0 0 400 400" role="img" [attr.aria-label]="label">
      <circle cx="200" cy="200" r="192" class="starSky" [style.fill]="sky()" />
      @switch (aura()) {
        @case ('aprender') {
          <circle cx="200" cy="208" r="172" class="starAura dotted" />
        }
        @case ('impacto') {
          <path [attr.d]="wave()" class="starAura" />
        }
        @case ('autonomia') {
          <rect x="44" y="52" width="312" height="312" rx="64" class="starAura" />
        }
        @case ('equipo') {
          <circle cx="200" cy="208" r="172" class="starAura" />
          <circle cx="200" cy="208" r="160" class="starAura" />
        }
      }
      @for (b of beads(); track $index) {
        <circle [attr.cx]="b.x" [attr.cy]="b.y" r="8" class="starBead" [attr.fill]="b.color" />
      }
      @for (g of gems(); track $index) {
        <circle [attr.cx]="g.x" [attr.cy]="g.y" r="13" class="starGem" [attr.fill]="g.color" />
      }
      @if (learn(); as l) {
        <circle [attr.cx]="l.x" [attr.cy]="l.y" r="12" class="starGem learn" [style.stroke]="l.color" />
      }
      @for (c of companions(); track $index) {
        <path [attr.d]="star(c.x, c.y, c.r, c.r * 0.5, [0, 0, 0, 0, 0])" class="starCompanion" />
      }
      @for (s of sparkleList(); track $index) {
        <path [attr.d]="sparkle(s.x, s.y)" class="starSparkle" [attr.fill]="accentColor() ?? '#1E90FF'" />
      }
      @if (ritmo() === 'rapido') {
        <path d="M 30 186 h 34 M 22 206 h 42 M 34 226 h 30" class="starMark" />
      }
      <path
        [attr.d]="star(cx, cy, 116, 64, points)"
        class="starBody"
        [style.stroke]="rim()"
        [style.stroke-width]="state.desafio?.mode === 'sin_pista' ? 12 : 8"
      />
      @if (ritmo() === 'pulido' || ritmo() === 'depende') {
        <path [attr.d]="star(cx, cy, 96, 52, [0, 0, 0, 0, 0])" class="starInner" [class.dashed]="ritmo() === 'depende'" />
      }
      @if (accentColor(); as a) {
        <circle [attr.cx]="cx - 46" [attr.cy]="cy + 24" r="12" [attr.fill]="a" opacity="0.8" />
        <circle [attr.cx]="cx + 46" [attr.cy]="cy + 24" r="12" [attr.fill]="a" opacity="0.8" />
      }
      @if (feedbackGlyph(); as f) {
        <g class="starBadge" transform="translate(-12 -12)">
          <path d="M 236 112 h 44 a 10 10 0 0 1 10 10 v 22 a 10 10 0 0 1 -10 10 h -26 l -12 10 v -10 h -6 a 10 10 0 0 1 -10 -10 v -22 a 10 10 0 0 1 10 -10 z" />
          <text x="258" y="139" text-anchor="middle" dominant-baseline="middle">{{ f }}</text>
        </g>
      }
      @if (canalGlyph(); as g) {
        <g class="starBadge">
          <circle cx="122" cy="298" r="20" />
          <text x="122" y="299" text-anchor="middle" dominant-baseline="middle">{{ g }}</text>
        </g>
      }
      @switch (reaccion()) {
        @case ('ayuda') {
          <path [attr.d]="arcUp(cx - 30)" class="starStroke" />
          <path [attr.d]="arcUp(cx + 30)" class="starStroke" />
          <path [attr.d]="'M ' + (cx - 22) + ' ' + (cy + 22) + ' q 22 26 44 0 z'" class="starMouthFill" />
        }
        @case ('pausa') {
          <path [attr.d]="arcDown(cx - 30)" class="starStroke" />
          <path [attr.d]="arcDown(cx + 30)" class="starStroke" />
          <path [attr.d]="'M ' + (cx - 16) + ' ' + (cy + 26) + ' q 16 12 32 0'" class="starStroke" />
        }
        @case ('investigo') {
          <circle [attr.cx]="cx - 30" [attr.cy]="cy - 6" r="12" class="starEye" />
          <circle [attr.cx]="cx + 30" [attr.cy]="cy - 6" r="12" class="starEye" />
          <rect [attr.x]="cx - 44" [attr.y]="cy - 22" width="28" height="9" rx="4" class="starLid" />
          <rect [attr.x]="cx + 16" [attr.y]="cy - 22" width="28" height="9" rx="4" class="starLid" />
          <path [attr.d]="'M ' + (cx - 12) + ' ' + (cy + 28) + ' q 12 8 24 0'" class="starStroke" />
        }
        @default {
          <circle [attr.cx]="cx - 30" [attr.cy]="cy - 4" r="12" class="starEye" />
          <circle [attr.cx]="cx + 30" [attr.cy]="cy - 4" r="12" class="starEye" />
          <circle [attr.cx]="cx - 26" [attr.cy]="cy - 9" r="4" class="starGlint" />
          <circle [attr.cx]="cx + 34" [attr.cy]="cy - 9" r="4" class="starGlint" />
          @if (reaccion() === 'reintento') {
            <path [attr.d]="'M ' + (cx - 42) + ' ' + (cy - 26) + ' q 12 -9 24 -2'" class="starStroke" />
            <path [attr.d]="'M ' + (cx + 42) + ' ' + (cy - 26) + ' q -12 -9 -24 -2'" class="starStroke" />
          }
          <path [attr.d]="'M ' + (cx - 18) + ' ' + (cy + 22) + ' q 18 18 36 0'" class="starStroke" />
        }
      }
    </svg>
  `,
})
export class EstrellaComponent {
  @Input({ required: true }) state!: EstrellaState;
  /** Evidencia por punta (0 sin oportunidad, 1 hipótesis, 2 respaldada). */
  @Input() points: number[] = [0, 0, 0, 0, 0];
  @Input() label = 'Tu estrella Synapxix';

  readonly cx = CX;
  readonly cy = CY;

  /** Familia que más se repite entre sus superpoderes (empate: la primera). */
  family() {
    return topOf(this.state.superpoderes.map((s) => s.family));
  }

  /** Motivación más elegida hasta ahora: da la forma del aura. */
  aura() {
    return topOf(this.state.motivaciones);
  }

  accentColor() {
    const f = this.family();
    return f ? FAMILY_ACCENT[f] ?? null : null;
  }

  gems() {
    return this.state.superpoderes.slice(0, GEM_SLOTS.length).map((s, i) => ({ ...GEM_SLOTS[i], color: FAMILY_ACCENT[s.family] ?? '#1E90FF' }));
  }

  learn() {
    const l = this.state.aprender;
    return l ? { ...LEARN_SLOT, color: FAMILY_ACCENT[l.family] ?? '#1E90FF' } : null;
  }

  /** Motivaciones en el arco de arriba, momentos de equipo en el de abajo. */
  beads() {
    const top = this.state.motivaciones.slice(0, 6).map((m, i) => ({ ...onArc(i, 6, -150, -30, 176), color: MOTIVATORS[m]?.color ?? '#1E90FF' }));
    const bottom = this.state.equipo.slice(0, 7).map((color, i) => ({ ...onArc(i, 7, 32, 148, 176), color }));
    return [...top, ...bottom];
  }

  rim() {
    const d = this.state.desafio;
    return d ? FAMILY_ACCENT[d.family] ?? null : null;
  }

  sky() {
    return SKY[this.state.trabajo['horario'] ?? ''] ?? null;
  }

  companions() {
    return COMPANIONS[this.state.trabajo['forma'] ?? ''] ?? [];
  }

  reaccion() {
    return this.state.trabajo['reaccion'] ?? null;
  }

  ritmo() {
    return this.state.trabajo['ritmo'] ?? null;
  }

  feedbackGlyph() {
    return FEEDBACK_GLYPH[this.state.trabajo['feedback'] ?? ''] ?? null;
  }

  canalGlyph() {
    return CANAL_GLYPH[this.state.trabajo['canal'] ?? ''] ?? null;
  }

  sparkleList() {
    return SPARKLES.slice(0, Math.max(0, Math.min(SPARKLES.length, this.state.logros)));
  }

  /** Anillo ondulado (lo que hace llega lejos). */
  wave() {
    const n = 24;
    let d = '';
    for (let i = 0; i <= n; i++) {
      const a = (i / n) * 2 * Math.PI;
      const r = 170 + (i % 2 === 0 ? 8 : -8);
      const x = 200 + r * Math.cos(a);
      const y = 208 + r * Math.sin(a);
      d += i === 0 ? `M ${x.toFixed(1)} ${y.toFixed(1)} ` : `L ${x.toFixed(1)} ${y.toFixed(1)} `;
    }
    return d + 'Z';
  }

  /** Estrella de cinco puntas redondeadas; cada punta crece con su nivel. */
  star(cx: number, cy: number, outer: number, inner: number, levels: number[]) {
    const pts = Array.from({ length: 10 }, (_, i) => {
      const r = i % 2 === 0 ? outer + 24 * (levels[i / 2] ?? 0) : inner;
      const a = -Math.PI / 2 + (i * Math.PI) / 5;
      return [cx + r * Math.cos(a), cy + r * Math.sin(a)];
    });
    const mid = (i: number) => [(pts[i][0] + pts[(i + 1) % 10][0]) / 2, (pts[i][1] + pts[(i + 1) % 10][1]) / 2];
    let d = `M ${mid(9)[0].toFixed(1)} ${mid(9)[1].toFixed(1)} `;
    for (let i = 0; i < 10; i++) {
      d += `Q ${pts[i][0].toFixed(1)} ${pts[i][1].toFixed(1)} ${mid(i)[0].toFixed(1)} ${mid(i)[1].toFixed(1)} `;
    }
    return d + 'Z';
  }

  sparkle(x: number, y: number) {
    return `M ${x} ${y - 13} Q ${x + 2} ${y - 2} ${x + 13} ${y} Q ${x + 2} ${y + 2} ${x} ${y + 13} Q ${x - 2} ${y + 2} ${x - 13} ${y} Q ${x - 2} ${y - 2} ${x} ${y - 13} Z`;
  }

  arcUp(x: number) {
    return `M ${x - 12} ${this.cy - 2} q 12 -16 24 0`;
  }

  arcDown(x: number) {
    return `M ${x - 12} ${this.cy - 6} q 12 12 24 0`;
  }
}

/** El valor más repetido (empate: el que apareció primero). */
export function topOf(values: string[]) {
  const counts = new Map<string, number>();
  for (const v of values) counts.set(v, (counts.get(v) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null;
}
