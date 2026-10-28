/** Descarga un objeto como JSON. Solo datos seudónimos: nunca nombre ni correo. */
export function downloadJson(data: unknown, filename: string) {
  downloadBlob(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }), filename);
}

/** Descarga un elemento SVG como archivo .svg. */
export function downloadSvg(svg: SVGSVGElement, filename: string) {
  const clone = svg.cloneNode(true) as SVGSVGElement;
  clone.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  // Los colores viven en CSS: se copian al archivo para que se vea igual fuera de la app.
  const live = svg.querySelectorAll('*');
  clone.querySelectorAll('*').forEach((el, i) => {
    const style = getComputedStyle(live[i]);
    (el as SVGElement).setAttribute('style', `fill:${style.fill};stroke:${style.stroke};stroke-width:${style.strokeWidth};opacity:${style.opacity}`);
  });
  downloadBlob(new Blob([clone.outerHTML], { type: 'image/svg+xml' }), filename);
}

/** Descarga un archivo binario tal como llegó. */
export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
