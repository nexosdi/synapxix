/**
 * Estrella Synapxix paramétrica.
 *
 * Ilustración vectorial determinista según el documento "Tu Estrella
 * Synapxix": estrella antropomórfica, formas redondeadas, azul brillante
 * predominante, acentos de la paleta extendida por arquetipo, fondo con
 * degradado celeste suave. La expresión y la pose varían por arquetipo.
 */

export interface StarOptions {
  name: string;
  archetype: string;
  label: string;
  accentA: string;
  accentB: string;
  mood: string;
  /** 0..1 — intensidad del brillo central (afinidad). */
  glow: number;
}

/** Contorno de estrella de 5 puntas con puntas redondeadas (path suave). */
function starPath(cx: number, cy: number, outer: number, inner: number): string {
  const points: Array<[number, number]> = [];
  for (let i = 0; i < 10; i++) {
    const radius = i % 2 === 0 ? outer : inner;
    const angle = -Math.PI / 2 + (i * Math.PI) / 5;
    points.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
  }
  // Curvas cuadráticas entre vértices para "formas redondeadas, amables".
  let d = '';
  for (let i = 0; i < 10; i++) {
    const [x1, y1] = points[i];
    const [x2, y2] = points[(i + 1) % 10];
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    if (i === 0) d += `M ${mx.toFixed(1)} ${my.toFixed(1)} `;
    else {
      d += `Q ${x1.toFixed(1)} ${y1.toFixed(1)} ${mx.toFixed(1)} ${my.toFixed(1)} `;
    }
  }
  const [fx, fy] = points[0];
  const [lx, ly] = points[9];
  d += `Q ${lx.toFixed(1)} ${ly.toFixed(1)} ${((lx + fx) / 2).toFixed(1)} ${((ly + fy) / 2).toFixed(1)} Z`;
  return d;
}

interface Face {
  eyes: string;
  mouth: string;
  tilt: number;
}

/** Expresión por arquetipo (documento Estrella: rasgos según personalidad). */
function faceFor(archetype: string): Face {
  const eyeOpen = (dx: number) =>
    `<circle cx="${200 + dx}" cy="190" r="13" fill="#0A4FBF"/><circle cx="${204 + dx}" cy="185" r="4.5" fill="#FFFFFF"/>`;
  const eyeFocused = (dx: number) =>
    `<path d="M ${186 + dx} 190 a 14 14 0 0 1 28 0 Z" fill="#0A4FBF"/><circle cx="${204 + dx}" cy="186" r="3.5" fill="#FFFFFF"/>`;
  const eyeDreamy = (dx: number) =>
    `<path d="M ${186 + dx} 192 q 14 -16 28 0" stroke="#0A4FBF" stroke-width="6" stroke-linecap="round" fill="none"/>`;
  const eyeCalm = (dx: number) =>
    `<path d="M ${186 + dx} 190 q 14 10 28 0" stroke="#0A4FBF" stroke-width="6" stroke-linecap="round" fill="none"/>`;

  const smileWide = `<path d="M 176 222 q 24 26 48 0" stroke="#0A4FBF" stroke-width="7" stroke-linecap="round" fill="none"/>`;
  const smileOpen = `<path d="M 178 220 q 22 30 44 0 Z" fill="#0A4FBF"/><path d="M 188 231 q 12 10 24 0 l 0 4 q -12 8 -24 0 Z" fill="#FF7A89"/>`;
  const smileGentle = `<path d="M 182 224 q 18 14 36 0" stroke="#0A4FBF" stroke-width="6" stroke-linecap="round" fill="none"/>`;

  switch (archetype) {
    case 'explorador_creativo':
      return { eyes: eyeOpen(-32) + eyeOpen(32), mouth: smileOpen, tilt: -6 };
    case 'analitico_metodico':
      return { eyes: eyeFocused(-32) + eyeFocused(32), mouth: smileGentle, tilt: 0 };
    case 'artista_expresivo':
      return { eyes: eyeDreamy(-32) + eyeDreamy(32), mouth: smileWide, tilt: 8 };
    case 'colaborador_empatico':
      return { eyes: eyeCalm(-32) + eyeCalm(32), mouth: smileWide, tilt: -3 };
    case 'emprendedor_audaz':
      return { eyes: eyeFocused(-32) + eyeOpen(32), mouth: smileOpen, tilt: -8 };
    default:
      return { eyes: eyeCalm(-32) + eyeCalm(32), mouth: smileGentle, tilt: 3 };
  }
}

export function renderStarSvg(options: StarOptions): string {
  const face = faceFor(options.archetype);
  const glowOpacity = (0.35 + options.glow * 0.45).toFixed(2);
  const body = starPath(200, 205, 150, 78);
  const sparkA = starPath(78, 96, 20, 9);
  const sparkB = starPath(330, 82, 14, 6.5);
  const sparkC = starPath(340, 300, 17, 8);

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 470" width="400" height="470" role="img" aria-label="Estrella Synapxix: ${options.label}">
  <defs>
    <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#EAF3FF"/>
      <stop offset="1" stop-color="#C9E0FF"/>
    </linearGradient>
    <radialGradient id="bodyGlow" cx="0.5" cy="0.42" r="0.75">
      <stop offset="0" stop-color="#52A8FF"/>
      <stop offset="0.62" stop-color="#1E90FF"/>
      <stop offset="1" stop-color="#1573D6"/>
    </radialGradient>
    <radialGradient id="halo" cx="0.5" cy="0.5" r="0.5">
      <stop offset="0" stop-color="${options.accentA}" stop-opacity="${glowOpacity}"/>
      <stop offset="1" stop-color="${options.accentA}" stop-opacity="0"/>
    </radialGradient>
  </defs>

  <rect width="400" height="470" rx="32" fill="url(#sky)"/>

  <!-- órbitas sutiles: tecnología humana, movimiento leve -->
  <ellipse cx="200" cy="210" rx="172" ry="120" fill="none" stroke="#93C6FF" stroke-width="2" stroke-dasharray="1 10" stroke-linecap="round" opacity="0.7"/>
  <circle cx="28" cy="210" r="7" fill="${options.accentB}"/>

  <circle cx="200" cy="205" r="168" fill="url(#halo)"/>

  <g transform="rotate(${face.tilt} 200 205)">
    <path d="${body}" fill="url(#bodyGlow)"/>
    <path d="${body}" fill="none" stroke="#0A4FBF" stroke-opacity="0.18" stroke-width="3"/>
    <!-- mejillas -->
    <ellipse cx="148" cy="216" rx="13" ry="9" fill="${options.accentB}" opacity="0.55"/>
    <ellipse cx="252" cy="216" rx="13" ry="9" fill="${options.accentB}" opacity="0.55"/>
    ${face.eyes}
    ${face.mouth}
  </g>

  <g fill="${options.accentA}"><path d="${sparkA}"/><path d="${sparkC}"/></g>
  <g fill="${options.accentB}"><path d="${sparkB}"/></g>

  <text x="200" y="408" text-anchor="middle" font-family="Nunito, sans-serif" font-size="27" font-weight="800" fill="#0A4FBF">${escapeXml(options.name)}</text>
  <text x="200" y="436" text-anchor="middle" font-family="Nunito, sans-serif" font-size="16" font-weight="700" fill="#4C6C9A">${escapeXml(options.label)} · ${escapeXml(options.mood)}</text>
</svg>`;
}

function escapeXml(text: string): string {
  return text.replace(/[<>&"']/g, (c) => ({ '<': '&lt;', '>': '&gt;', '&': '&amp;', '"': '&quot;', "'": '&apos;' })[c] ?? c);
}

/** Descarga la estrella como SVG. */
export function downloadSvg(svg: string, filename: string) {
  const blob = new Blob([svg], { type: 'image/svg+xml' });
  triggerDownload(URL.createObjectURL(blob), filename);
}

/** Descarga la estrella como PNG (2x) vía canvas. */
export async function downloadPng(svg: string, filename: string) {
  const url = URL.createObjectURL(new Blob([svg], { type: 'image/svg+xml' }));
  try {
    const image = new Image();
    await new Promise<void>((resolve, reject) => {
      image.onload = () => resolve();
      image.onerror = () => reject(new Error('svg_load_failed'));
      image.src = url;
    });
    const canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 940;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.drawImage(image, 0, 0, 800, 940);
    triggerDownload(canvas.toDataURL('image/png'), filename);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function triggerDownload(href: string, filename: string) {
  const link = document.createElement('a');
  link.href = href;
  link.download = filename;
  link.click();
}
