// StatDesk Indonesia — grafik SVG murni, tanpa pustaka.
// Semua grafik digambar dari angka di data.js; tidak ada gambar luar.

const TEAL = '#0f4c4a';
const AMBER = '#e8a317';
const LIGHT_TEAL = '#7fb3ae';
const GRID = '#e3e7e2';
const INK = '#1d2b2a';
const MUTED = '#5c6b69';

export function fmt(value, decimals = 1) {
  return value.toFixed(decimals).replace('.', ',').replace('-', '−');
}

function svgOpen(width, height, label) {
  // SVG sebaris di HTML tidak butuh atribut xmlns; menghilangkannya juga
  // menjaga sumber situs bebas dari URL absolut mana pun.
  return `<svg class="chart" viewBox="0 0 ${width} ${height}" role="img" aria-label="${label}">`;
}

// Grafik garis untuk satu seri tahunan: points = [{year, value}].
export function lineChart(points, { title, unit = '', decimals = 1, height = 240 } = {}) {
  const width = 640;
  const padL = 52, padR = 16, padT = 14, padB = 30;
  const values = points.map((p) => p.value);
  let min = Math.min(...values);
  let max = Math.max(...values);
  if (min === max) { min -= 1; max += 1; }
  const span = max - min;
  min -= span * 0.15;
  max += span * 0.15;
  const x = (i) => padL + (i * (width - padL - padR)) / (points.length - 1);
  const y = (v) => padT + ((max - v) / (max - min)) * (height - padT - padB);
  const gridLines = [0.25, 0.5, 0.75].map((f) => {
    const v = min + (max - min) * f;
    const yy = y(v);
    return `<line x1="${padL}" y1="${yy}" x2="${width - padR}" y2="${yy}" stroke="${GRID}" stroke-width="1"/>`
      + `<text x="${padL - 8}" y="${yy + 4}" text-anchor="end" font-size="11" fill="${MUTED}">${fmt(v, decimals)}${unit}</text>`;
  }).join('');
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'}${x(i).toFixed(1)},${y(p.value).toFixed(1)}`).join(' ');
  const dots = points.map((p, i) =>
    `<circle cx="${x(i).toFixed(1)}" cy="${y(p.value).toFixed(1)}" r="4" fill="${AMBER}" stroke="#fff" stroke-width="1.5"/>`
    + `<text x="${x(i)}" y="${y(p.value) - 10}" text-anchor="middle" font-size="12" font-weight="700" fill="${INK}">${fmt(p.value, decimals)}</text>`).join('');
  const years = points.map((p, i) =>
    `<text x="${x(i)}" y="${height - 8}" text-anchor="middle" font-size="12" fill="${MUTED}">${p.year}</text>`).join('');
  return `${svgOpen(width, height, title)}${gridLines}`
    + `<path d="${path}" fill="none" stroke="${TEAL}" stroke-width="2.5" stroke-linejoin="round"/>${dots}${years}</svg>`;
}

// Grafik batang untuk label + nilai: bars = [{label, value}].
export function barChart(bars, { title, unit = '', decimals = 1, height = 260, horizontal = false } = {}) {
  const width = 640;
  if (!horizontal) {
    const padL = 48, padR = 8, padT = 10, padB = 34;
    const max = Math.max(...bars.map((b) => b.value)) * 1.1;
    const bw = (width - padL - padR) / bars.length;
    const barW = Math.min(46, bw * 0.62);
    const y = (v) => padT + (1 - v / max) * (height - padT - padB);
    const rects = bars.map((b, i) => {
      const cx = padL + bw * i + bw / 2;
      return `<rect x="${(cx - barW / 2).toFixed(1)}" y="${y(b.value).toFixed(1)}" width="${barW}" height="${(height - padB - y(b.value)).toFixed(1)}" rx="3" fill="${i === bars.length - 1 ? AMBER : TEAL}"/>`
        + `<text x="${cx.toFixed(1)}" y="${(y(b.value) - 6).toFixed(1)}" text-anchor="middle" font-size="12" font-weight="700" fill="${INK}">${fmt(b.value, decimals)}${unit}</text>`
        + `<text x="${cx.toFixed(1)}" y="${height - 8}" text-anchor="middle" font-size="11.5" fill="${MUTED}">${b.label}</text>`;
    }).join('');
    return `${svgOpen(width, height, title)}${rects}</svg>`;
  }
  // Batang horizontal: label di kiri, nilai di ujung batang.
  const rowH = 34;
  const h = Math.max(height, bars.length * rowH + 16);
  const max = Math.max(...bars.map((b) => b.value)) * 1.08;
  const labelW = 150;
  const rows = bars.map((b, i) => {
    const y = 8 + i * rowH;
    const w = ((width - labelW - 64) * b.value) / max;
    return `<text x="0" y="${y + 15}" font-size="12.5" fill="${INK}">${b.label}</text>`
      + `<rect x="${labelW}" y="${y}" width="${w.toFixed(1)}" height="20" rx="3" fill="${i === 0 ? AMBER : TEAL}"/>`
      + `<text x="${(labelW + w + 6).toFixed(1)}" y="${y + 15}" font-size="12.5" font-weight="700" fill="${INK}">${fmt(b.value, decimals)}${unit}</text>`;
  }).join('');
  return `${svgOpen(width, h, title)}${rows}</svg>`;
}

// Donat pangsa: slices = [{name, share}] dengan warna bergantian.
export function donutChart(slices, { title, size = 260 } = {}) {
  const colors = [TEAL, AMBER, '#3a8a7d', '#c97e1f', '#94a8a4', '#6b7f8a', '#d9c27a'];
  const r = 100;
  const cx = size / 2;
  const cy = size / 2;
  let angle = -Math.PI / 2;
  const paths = slices.map((s, i) => {
    const start = angle;
    angle += (s.share / 100) * Math.PI * 2;
    const end = angle;
    const large = end - start > Math.PI ? 1 : 0;
    const x1 = cx + r * Math.cos(start);
    const y1 = cy + r * Math.sin(start);
    const x2 = cx + r * Math.cos(end);
    const y2 = cy + r * Math.sin(end);
    return `<path d="M${cx},${cy} L${x1.toFixed(1)},${y1.toFixed(1)} A${r},${r} 0 ${large} 1 ${x2.toFixed(1)},${y2.toFixed(1)} Z" fill="${colors[i % colors.length]}"/>`;
  }).join('');
  const legend = slices.map((s, i) =>
    `<div><span class="swatch" style="background:${colors[i % colors.length]}"></span>${s.name} — ${fmt(s.share)}%</div>`).join('');
  return `<div style="display:flex;gap:18px;flex-wrap:wrap;align-items:center">`
    + `${svgOpen(size, size, title).replace('class="chart"', 'class="chart" style="max-width:260px"')}${paths}`
    + `<circle cx="${cx}" cy="${cy}" r="58" fill="#fff"/><text x="${cx}" y="${cy - 2}" text-anchor="middle" font-size="13" fill="${MUTED}">PDB 2024</text>`
    + `<text x="${cx}" y="${cy + 18}" text-anchor="middle" font-size="15" font-weight="700" fill="${INK}">100%</text></svg>`
    + `<div class="legend" style="flex-direction:column;gap:6px">${legend}</div></div>`;
}
