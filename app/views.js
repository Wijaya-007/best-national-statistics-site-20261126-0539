// StatDesk Indonesia — halaman-halaman situs.
// Setiap halaman dirender dari angka di data.js dengan grafik dari charts.js.
// Semua kontrol di halaman ini berfungsi: pemilih tahun, tab, urutkan tabel,
// cari provinsi, dan alih grafik/tabel.

import { SERIES, KEY_2024, SECTORS_2024, PROVINCES_2024, SCHOOLING_SPOTLIGHT, SOURCES, YEARS } from './data.js';
import { fmt, lineChart, barChart, donutChart } from './charts.js';

function sourceLine(text) {
  return `<p class="src-line">Sumber: ${text}</p>`;
}

function seriesPoints(series, years = YEARS) {
  return years.filter((y) => series[y] !== undefined && series[y] !== null)
    .map((y) => ({ year: y, value: series[y] }));
}

function deltaText(series, year, decimals = 1) {
  const now = series[year];
  const prev = series[year - 1];
  if (now === undefined || prev === undefined) return '';
  const diff = now - prev;
  const cls = diff >= 0 ? 'up' : 'down';
  const arrow = diff >= 0 ? '▲' : '▼';
  return `<span class="delta ${cls}">${arrow} ${fmt(Math.abs(diff), decimals)} dari ${year - 1}</span>`;
}

function kpiCard(label, value, unit, source, deltaHtml = '') {
  return `<div class="kpi"><div class="label">${label}</div>`
    + `<div class="value">${value} <span class="unit">${unit}</span></div>`
    + `${deltaHtml}<div class="src">${source}</div></div>`;
}

// --- Beranda: KPI + grafik tren, dengan pemilih tahun yang mengubah angka. ---
export function renderHome(year = 2024) {
  const y = Number(year) || 2024;
  const pop = SERIES.population[y];
  const growth = SERIES.gdpGrowth[y];
  const infl = SERIES.inflation[y];
  const pov = SERIES.poverty[y];
  const options = YEARS.map((yy) => `<option value="${yy}"${yy === y ? ' selected' : ''}>${yy}</option>`).join('');
  return `<section class="page-head"><h1>Indonesia dalam angka</h1>`
    + `<p>Ringkasan statistik nasional terbaru — penduduk, ekonomi, dan kesejahteraan — lengkap dengan sumber dan tahunnya. Pilih tahun untuk melihat angka tahun itu.</p></section>`
    + `<div class="rule"></div>`
    + `<div class="controls"><label for="year-select">Tahun data:</label>`
    + `<select id="year-select" data-action="year">${options}</select>`
    + `<span class="note">Angka kartu dan grafik di bawah mengikuti tahun yang dipilih.</span></div>`
    + `<div class="kpis">`
    + kpiCard('Penduduk', fmt(pop), 'juta jiwa', 'BPS, pertengahan ' + y, deltaText(SERIES.population, y, 1))
    + kpiCard('Pertumbuhan PDB', fmt(growth, 2), '% y-on-y', 'BPS, ' + y, deltaText(SERIES.gdpGrowth, y, 2))
    + kpiCard('Inflasi (Desember)', fmt(infl, 2), '% y-on-y', 'BPS, ' + y, deltaText(SERIES.inflation, y, 2))
    + kpiCard('Penduduk miskin', fmt(pov, 2), '%', 'BPS, September ' + y, deltaText(SERIES.poverty, y, 2))
    + `</div>`
    + `<div class="grid-2">`
    + `<div class="panel"><h2>Pertumbuhan ekonomi, 2019–2024</h2>`
    + `<p class="sub">PDB tumbuh 5,03% pada 2024 setelah kontraksi −2,07% di 2020.</p>`
    + lineChart(seriesPoints(SERIES.gdpGrowth), { title: 'Pertumbuhan PDB 2019–2024', unit: '%', decimals: 2 })
    + sourceLine('BPS, pertumbuhan PDB tahunan.') + `</div>`
    + `<div class="panel"><h2>Penduduk, 2019–2024</h2>`
    + `<p class="sub">281,6 juta jiwa pada pertengahan 2024 — negara keempat terpadat di dunia.</p>`
    + barChart(seriesPoints(SERIES.population).map((p) => ({ label: String(p.year), value: p.value })),
        { title: 'Penduduk Indonesia 2019–2024', unit: ' jt', decimals: 1 })
    + sourceLine('BPS, estimasi pertengahan tahun; 2020 = Sensus Penduduk.') + `</div></div>`
    + `<div class="panel"><h2>Sorotan 2024</h2><div class="highlights">`
    + `<div class="highlight"><b>75,02</b><span>Indeks Pembangunan Manusia 2024 (BPS) — naik dari 74,39 pada 2023.</span></div>`
    + `<div class="highlight"><b>74,15 tahun</b><span>Umur harapan hidup saat lahir 2024 (BPS) — 73,37 tahun pada 2020.</span></div>`
    + `<div class="highlight"><b>US$31,04 miliar</b><span>Surplus perdagangan 2024: ekspor US$264,70 miliar, impor US$233,66 miliar (BPS).</span></div>`
    + `</div>${sourceLine('BPS; rincian di halaman Ekonomi, Kesehatan, dan Pendidikan.')}</div>`;
}

// --- Penduduk ---
export function renderPopulation() {
  return `<section class="page-head"><h1>Penduduk</h1>`
    + `<p>Jumlah, pertumbuhan, dan sebaran penduduk Indonesia menurut provinsi.</p></section><div class="rule"></div>`
    + `<div class="kpis">`
    + kpiCard('Penduduk 2024', '281,6', 'juta jiwa', 'BPS, pertengahan 2024')
    + kpiCard('Tumbuh 2020–2024', '+11,4', 'juta jiwa', 'BPS (270,2 → 281,6 juta)')
    + kpiCard('Provinsi terbanyak', 'Jawa Barat', '50,35 juta', 'BPS, 2024')
    + kpiCard('Pangsa 10 provinsi teratas', '71,7', '% penduduk', 'BPS, 2024 — dihitung dari tabel di bawah')
    + `</div>`
    + `<div class="panel"><h2>Tren penduduk, 2019–2024</h2>`
    + lineChart(seriesPoints(SERIES.population), { title: 'Penduduk Indonesia 2019–2024', unit: ' jt' })
    + sourceLine('BPS, estimasi pertengahan tahun; 2020 = Sensus Penduduk.') + `</div>`
    + `<div class="panel"><h2>Sepuluh provinsi terpadat, 2024</h2>`
    + `<p class="sub">Jawa menampung lebih dari separuh penduduk Indonesia.</p>`
    + barChart(PROVINCES_2024.map((p) => ({ label: p.name.replace('Jawa ', 'J. ').replace('Sumatera ', 'Sum. '), value: p.population })),
        { title: 'Penduduk per provinsi 2024', unit: ' jt', horizontal: true })
    + sourceLine('BPS, estimasi pertengahan 2024, juta jiwa. Tabel lengkap ada di halaman Wilayah.') + `</div>`;
}

// --- Ekonomi ---
export function renderEconomy(tab = 'growth') {
  const tabs = `<div class="tabs" role="tablist">`
    + `<button data-action="tab" data-tab="growth" aria-pressed="${tab === 'growth'}">Pertumbuhan</button>`
    + `<button data-action="tab" data-tab="sectors" aria-pressed="${tab === 'sectors'}">Struktur PDB</button>`
    + `<button data-action="tab" data-tab="trade" aria-pressed="${tab === 'trade'}">Perdagangan</button></div>`;
  let body = '';
  if (tab === 'sectors') {
    body = `<div class="panel"><h2>Struktur PDB menurut lapangan usaha, 2024</h2>`
      + `<p class="sub">Industri pengolahan tetap penyumbang terbesar PDB.</p>`
      + donutChart(SECTORS_2024, { title: 'Pangsa PDB 2024' })
      + sourceLine('BPS, pangsa PDB harga berlaku 2024.') + `</div>`;
  } else if (tab === 'trade') {
    body = `<div class="panel"><h2>Ekspor dan impor, 2019–2024</h2>`
      + `<p class="sub">Miliar dolar AS. Surplus 2024: US$31,04 miliar.</p>`
      + barChart(seriesPoints(SERIES.exports).map((p) => ({ label: String(p.year), value: p.value })),
          { title: 'Ekspor Indonesia 2019–2024', unit: '', decimals: 0 })
      + `<div class="legend"><span><span class="swatch" style="background:#0f4c4a"></span>Ekspor</span>`
      + `<span>Impor 2024: US$233,66 miliar (BPS)</span></div>`
      + sourceLine('BPS, nilai ekspor dan impor tahunan.') + `</div>`
      + `<div class="panel"><h2>Neraca perdagangan 2024</h2><div class="highlights">`
      + `<div class="highlight"><b>US$264,70 M</b><span>Ekspor 2024 (BPS).</span></div>`
      + `<div class="highlight"><b>US$233,66 M</b><span>Impor 2024 (BPS).</span></div>`
      + `<div class="highlight"><b>US$31,04 M</b><span>Surplus 2024 (BPS).</span></div></div></div>`;
  } else {
    body = `<div class="panel"><h2>Pertumbuhan PDB, 2019–2024</h2>`
      + `<p class="sub">Ekonomi tumbuh 5,03% pada 2024; PDB per kapita Rp78,62 juta.</p>`
      + lineChart(seriesPoints(SERIES.gdpGrowth), { title: 'Pertumbuhan PDB 2019–2024', unit: '%', decimals: 2 })
      + sourceLine('BPS, pertumbuhan PDB tahunan.') + `</div>`
      + `<div class="grid-2"><div class="panel"><h2>Inflasi, 2019–2024</h2>`
      + lineChart(seriesPoints(SERIES.inflation), { title: 'Inflasi Desember 2019–2024', unit: '%', decimals: 2 })
      + sourceLine('BPS, inflasi Desember y-on-y.') + `</div>`
      + `<div class="panel"><h2>Pengangguran terbuka, 2019–2024</h2>`
      + lineChart(seriesPoints(SERIES.unemployment), { title: 'Pengangguran Agustus 2019–2024', unit: '%', decimals: 2 })
      + sourceLine('BPS, Agustus tiap tahun. Angkatan kerja Agustus 2024: 152,11 juta orang.') + `</div></div>`;
  }
  return `<section class="page-head"><h1>Ekonomi</h1>`
    + `<p>Pertumbuhan, harga, lapangan kerja, dan perdagangan luar negeri.</p></section><div class="rule"></div>`
    + `<div class="kpis">`
    + kpiCard('PDB tumbuh 2024', '5,03', '% y-on-y', 'BPS, 2024')
    + kpiCard('PDB per kapita 2024', 'Rp78,62', 'juta', 'BPS, 2024 (≈ US$4.925, Bank Dunia)')
    + kpiCard('Inflasi Des 2024', '1,57', '% y-on-y', 'BPS')
    + kpiCard('Pengangguran Agu 2024', '4,91', '%', 'BPS')
    + `</div><div class="controls">${tabs}</div>${body}`;
}

// --- Kesehatan ---
export function renderHealth() {
  return `<section class="page-head"><h1>Kesehatan</h1>`
    + `<p>Umur harapan hidup, pembangunan manusia, dan gizi balita.</p></section><div class="rule"></div>`
    + `<div class="kpis">`
    + kpiCard('Umur harapan hidup', '74,15', 'tahun', 'BPS, 2024 (2020: 73,37)')
    + kpiCard('IPM 2024', '75,02', 'poin', 'BPS (2023: 74,39)')
    + kpiCard('Stunting balita 2024', '19,8', '%', 'SSGI Kemenkes (2023: 21,5%)')
    + kpiCard('Pengeluaran riil/kapita', 'Rp12,34', 'juta/thn', 'BPS, 2024')
    + `</div>`
    + `<div class="grid-2"><div class="panel"><h2>IPM, 2020–2024</h2>`
    + `<p class="sub">Indeks Pembangunan Manusia naik 0,63 poin pada 2024.</p>`
    + lineChart(seriesPoints(SERIES.hdi), { title: 'IPM Indonesia 2020–2024', unit: '', decimals: 2 })
    + sourceLine('BPS, rilis IPM 2024 (15 November 2024).') + `</div>`
    + `<div class="panel"><h2>Stunting balita, 2021–2024</h2>`
    + `<p class="sub">Prevalensi turun 4,6 poin dalam tiga tahun.</p>`
    + barChart(seriesPoints(SERIES.stunting).map((p) => ({ label: String(p.year), value: p.value })),
        { title: 'Stunting balita 2021–2024', unit: '%', decimals: 1 })
    + sourceLine('Kementerian Kesehatan, Survei Status Gizi Indonesia (SSGI).') + `</div></div>`
    + `<div class="panel"><h2>Yang berubah 2020 → 2024</h2><ul class="tight">`
    + `<li>Umur harapan hidup naik 0,78 tahun (73,37 → 74,15 tahun, BPS).</li>`
    + `<li>Harapan lama sekolah naik 0,23 tahun (12,98 → 13,21 tahun, BPS).</li>`
    + `<li>Rata-rata lama sekolah naik 0,37 tahun (8,48 → 8,85 tahun, BPS).</li>`
    + `<li>Pengeluaran riil per kapita naik 3,71% pada 2024 saja (BPS).</li></ul>`
    + sourceLine('BPS, rilis IPM 2024.') + `</div>`;
}

// --- Pendidikan ---
export function renderEducation() {
  return `<section class="page-head"><h1>Pendidikan</h1>`
    + `<p>Lama sekolah, harapan sekolah, dan kesenjangan antarwilayah.</p></section><div class="rule"></div>`
    + `<div class="kpis">`
    + kpiCard('Harapan lama sekolah', '13,21', 'tahun', 'BPS, HLS 2024 (2020: 12,98)')
    + kpiCard('Rata-rata lama sekolah', '8,85', 'tahun', 'BPS, RLS 2024 (2020: 8,48)')
    + kpiCard('HLS tertinggi', '15,70', 'tahun', 'BPS, DI Yogyakarta 2024')
    + kpiCard('HLS terendah', '9,63', 'tahun', 'BPS, Papua Tengah 2024')
    + `</div>`
    + `<div class="panel"><h2>Harapan lama sekolah menurut wilayah, 2024</h2>`
    + `<p class="sub">Selisih 6,07 tahun antara provinsi tertinggi dan terendah — gambaran kesenjangan akses pendidikan.</p>`
    + barChart(SCHOOLING_SPOTLIGHT.map((s) => ({ label: s.name, value: s.hls })),
        { title: 'HLS per provinsi 2024', unit: ' th', decimals: 2, horizontal: true })
    + sourceLine('BPS, Harapan Lama Sekolah 2024.') + `</div>`
    + `<div class="panel"><h2>Membaca angka ini</h2><ul class="tight">`
    + `<li><b>HLS 13,21 tahun</b> berarti anak Indonesia rata-rata berpeluang menempuh pendidikan formal lebih dari 13 tahun — setara tamat SMA (BPS, 2024).</li>`
    + `<li><b>RLS 8,85 tahun</b> berarti penduduk usia 25 tahun ke atas rata-rata baru bersekolah setara SMP kelas 3 (BPS, 2024).</li>`
    + `<li>Selama 2020–2024, HLS naik rata-rata 0,44% per tahun dan RLS 1,07% per tahun (BPS).</li></ul>`
    + sourceLine('BPS, Berita Resmi Statistik IPM 2024.') + `</div>`;
}

// --- Wilayah: tabel provinsi yang bisa dicari, diurutkan, dan dialihkan ke grafik. ---
export function renderRegions(state = {}) {
  const query = (state.query || '').toLowerCase();
  const sortKey = state.sortKey || 'population';
  const sortDir = state.sortDir || 'desc';
  const view = state.view || 'table';
  const total = PROVINCES_2024.reduce((sum, p) => sum + p.population, 0);
  const rows = PROVINCES_2024
    .filter((p) => !query || p.name.toLowerCase().includes(query) || p.island.toLowerCase().includes(query))
    .slice()
    .sort((a, b) => {
      const av = sortKey === 'name' ? a.name : sortKey === 'island' ? a.island : a.population;
      const bv = sortKey === 'name' ? b.name : sortKey === 'island' ? b.island : b.population;
      const cmp = typeof av === 'string' ? av.localeCompare(bv, 'id') : av - bv;
      return sortDir === 'asc' ? cmp : -cmp;
    });
  const arrow = (key) => (sortKey === key ? (sortDir === 'asc' ? ' ▲' : ' ▼') : '');
  const table = `<div class="table-scroll"><table><thead><tr>`
    + `<th><button class="sort" data-action="sort" data-key="name">Provinsi${arrow('name')}</button></th>`
    + `<th><button class="sort" data-action="sort" data-key="island">Pulau${arrow('island')}</button></th>`
    + `<th class="num"><button class="sort" data-action="sort" data-key="population">Penduduk (juta)${arrow('population')}</button></th>`
    + `<th class="num">Pangsa nasional</th></tr></thead><tbody>`
    + rows.map((p) => `<tr><td>${p.name}</td><td>${p.island}</td><td class="num">${fmt(p.population, 2)}</td><td class="num">${fmt((p.population / 281.6) * 100, 1)}%</td></tr>`).join('')
    + `</tbody></table></div>`
    + `<p class="note">${rows.length} dari 10 provinsi ditampilkan · jumlah 10 provinsi: ${fmt(total, 2)} juta jiwa (71,7% penduduk nasional).</p>`;
  const chart = barChart(rows.map((p) => ({ label: p.name, value: p.population })),
    { title: 'Penduduk per provinsi 2024', unit: ' jt', decimals: 2, horizontal: true });
  return `<section class="page-head"><h1>Wilayah</h1>`
    + `<p>Sepuluh provinsi berpenduduk terbanyak — cari, urutkan, atau lihat sebagai grafik.</p></section><div class="rule"></div>`
    + `<div class="panel"><div class="controls">`
    + `<label for="province-search">Cari provinsi:</label>`
    + `<input type="search" id="province-search" data-action="search" placeholder="mis. Jawa, Papua, Riau" value="${(state.query || '').replace(/"/g, '&quot;')}">`
    + `<button class="ghost" data-action="view" data-view="table" aria-pressed="${view === 'table'}">Tabel</button>`
    + `<button class="ghost" data-action="view" data-view="chart" aria-pressed="${view === 'chart'}">Grafik</button>`
    + `</div>${view === 'chart' ? chart : table}`
    + sourceLine('BPS, estimasi penduduk pertengahan 2024, juta jiwa; pangsa dihitung terhadap penduduk nasional 281,6 juta.') + `</div>`;
}

// --- Tentang ---
export function renderAbout() {
  return `<section class="page-head"><h1>Tentang StatDesk</h1>`
    + `<p>Apa situs ini, dari mana angkanya, dan bagaimana membacanya.</p></section><div class="rule"></div>`
    + `<div class="panel"><h2>Situs independen, bukan situs resmi</h2>`
    + `<p>StatDesk Indonesia adalah situs contoh independen yang disusun untuk menampilkan statistik nasional Indonesia dengan cara yang mudah dibaca. Situs ini <b>bukan</b> situs resmi Badan Pusat Statistik (BPS), pemerintah, atau instansi mana pun, dan tidak meniru merek atau tampilan situs resmi.</p>`
    + `<p>Setiap angka di situs ini mencantumkan sumber dan tahunnya. Bila sebuah angka memakai tahun yang berbeda dari halaman itu, tahunnya ditulis di samping angka tersebut.</p></div>`
    + `<div class="panel"><h2>Metodologi singkat</h2><ul class="tight">`
    + `<li>Angka diambil dari publikasi resmi: Berita Resmi Statistik dan Statistik Indonesia (BPS) serta SSGI (Kementerian Kesehatan).</li>`
    + `<li>Seri tahunan memakai definisi yang sama tiap tahun: penduduk = estimasi pertengahan tahun; inflasi = Desember y-on-y; pengangguran = Agustus; kemiskinan = September.</li>`
    + `<li>Angka 2020 untuk penduduk memakai hasil Sensus Penduduk 2020.</li>`
    + `<li>Semua grafik digambar dari angka yang sama dengan yang tampil di tabel dan kartu — tidak ada angka hiasan.</li>`
    + `<li>Situs ini berjalan luring: tidak ada permintaan jaringan, pelacak, atau cookie.</li></ul></div>`
    + `<div class="panel"><h2>Daftar sumber</h2><ul class="tight">`
    + SOURCES.map((s) => `<li>${s}</li>`).join('')
    + `</ul><p class="note">Terakhir diperbarui: November 2026. Cakupan data: 2019–2024.</p></div>`;
}
