// StatDesk Indonesia — angka-angka situs.
//
// Setiap angka di sini adalah angka nyata yang diterbitkan sumbernya, dengan
// tahun yang disebut di tempat angka itu tampil. Sumber utama: Badan Pusat
// Statistik (BPS) — Berita Resmi Statistik dan publikasi Statistik Indonesia
// — ditambah Survei Status Gizi Indonesia (SSGI) Kemenkes untuk stunting dan
// Bank Dunia untuk konteks PDB per kapita. Angka memakai koma desimal
// Indonesia (mis. 281,6 = 281.6).

export const YEARS = [2019, 2020, 2021, 2022, 2023, 2024];

// Seri tahunan nasional, 2019–2024. Kosong (null) = tidak diterbitkan seri
// itu untuk tahun tersebut; halaman hanya menampilkan tahun yang ada.
export const SERIES = {
  // Penduduk pertengahan tahun, juta jiwa (BPS; 2020 = hasil Sensus Penduduk).
  population: { 2019: 266.9, 2020: 270.2, 2021: 272.7, 2022: 275.8, 2023: 278.7, 2024: 281.6 },
  // Pertumbuhan PDB, % y-on-y (BPS).
  gdpGrowth: { 2019: 5.02, 2020: -2.07, 2021: 3.7, 2022: 5.31, 2023: 5.05, 2024: 5.03 },
  // Inflasi Desember, % y-on-y (BPS).
  inflation: { 2019: 2.72, 2020: 1.68, 2021: 1.87, 2022: 5.51, 2023: 2.61, 2024: 1.57 },
  // Tingkat pengangguran terbuka, Agustus, % (BPS).
  unemployment: { 2019: 5.28, 2020: 7.07, 2021: 6.49, 2022: 5.86, 2023: 5.32, 2024: 4.91 },
  // Penduduk miskin, September, % (BPS).
  poverty: { 2019: 9.22, 2020: 10.19, 2021: 9.71, 2022: 9.57, 2023: 9.36, 2024: 8.57 },
  // Rasio gini, September (BPS).
  gini: { 2019: 0.38, 2020: 0.385, 2021: 0.381, 2022: 0.381, 2023: 0.379, 2024: 0.381 },
  // Ekspor, miliar dolar AS (BPS).
  exports: { 2019: 167.68, 2020: 163.19, 2021: 231.61, 2022: 291.9, 2023: 258.82, 2024: 264.7 },
  // Impor, miliar dolar AS (BPS).
  imports: { 2019: 170.72, 2020: 141.57, 2021: 196.19, 2022: 237.52, 2023: 221.89, 2024: 233.66 },
  // Indeks Pembangunan Manusia (BPS; 2020: 72,81 — rilis IPM 2024).
  hdi: { 2020: 72.81, 2021: 72.29, 2022: 73.37, 2023: 74.39, 2024: 75.02 },
  // Prevalensi stunting balita, % (SSGI Kemenkes).
  stunting: { 2021: 24.4, 2022: 21.6, 2023: 21.5, 2024: 19.8 },
};

// Angka kunci 2024 (atau tahun terbaru yang disebut di tiap kartu).
export const KEY_2024 = {
  population: { value: 281.6, unit: 'juta jiwa', source: 'BPS, estimasi pertengahan 2024' },
  gdpGrowth: { value: 5.03, unit: '% y-on-y', source: 'BPS, 2024' },
  gdpPerCapita: { value: 78.62, unit: 'juta rupiah', source: 'BPS, 2024 (sekitar US$4.925, Bank Dunia)' },
  inflation: { value: 1.57, unit: '% y-on-y', source: 'BPS, Desember 2024' },
  unemployment: { value: 4.91, unit: '%', source: 'BPS, Agustus 2024' },
  poverty: { value: 8.57, unit: '%', source: 'BPS, September 2024' },
  lifeExpectancy: { value: 74.15, unit: 'tahun', source: 'BPS, 2024 (2020: 73,37 tahun)' },
  hdi: { value: 75.02, unit: 'poin', source: 'BPS, IPM 2024 (2023: 74,39)' },
  meanSchooling: { value: 8.85, unit: 'tahun', source: 'BPS, RLS 2024 (2020: 8,48 tahun)' },
  expectedSchooling: { value: 13.21, unit: 'tahun', source: 'BPS, HLS 2024 (2020: 12,98 tahun)' },
  stunting: { value: 19.8, unit: '% balita', source: 'SSGI Kemenkes, 2024 (2023: 21,5%)' },
  exports: { value: 264.7, unit: 'miliar US$', source: 'BPS, 2024' },
  tradeSurplus: { value: 31.04, unit: 'miliar US$', source: 'BPS, 2024 (ekspor 264,70 − impor 233,66)' },
  labourForce: { value: 152.11, unit: 'juta orang', source: 'BPS, Agustus 2024' },
};

// Pangsa PDB menurut lapangan usaha, 2024, % (BPS).
export const SECTORS_2024 = [
  { name: 'Industri pengolahan', share: 18.7 },
  { name: 'Perdagangan', share: 13.0 },
  { name: 'Pertanian, kehutanan, perikanan', share: 12.5 },
  { name: 'Konstruksi', share: 10.0 },
  { name: 'Pertambangan dan penggalian', share: 8.3 },
  { name: 'Transportasi dan pergudangan', share: 5.9 },
  { name: 'Lapangan usaha lainnya', share: 31.6 },
];

// Sepuluh provinsi berpenduduk terbanyak, pertengahan 2024, juta jiwa (BPS).
export const PROVINCES_2024 = [
  { name: 'Jawa Barat', population: 50.35, island: 'Jawa' },
  { name: 'Jawa Timur', population: 41.81, island: 'Jawa' },
  { name: 'Jawa Tengah', population: 37.89, island: 'Jawa' },
  { name: 'Sumatera Utara', population: 15.59, island: 'Sumatera' },
  { name: 'Banten', population: 12.43, island: 'Jawa' },
  { name: 'DKI Jakarta', population: 10.56, island: 'Jawa' },
  { name: 'Sulawesi Selatan', population: 9.49, island: 'Sulawesi' },
  { name: 'Lampung', population: 9.42, island: 'Sumatera' },
  { name: 'Sumatera Selatan', population: 8.85, island: 'Sumatera' },
  { name: 'Riau', population: 6.69, island: 'Sumatera' },
];

// Harapan Lama Sekolah (HLS) 2024 per provinsi, tahun (BPS) — tertinggi dan
// terendah nasional, untuk perbandingan pada halaman Pendidikan.
export const SCHOOLING_SPOTLIGHT = [
  { name: 'DI Yogyakarta (tertinggi)', hls: 15.7 },
  { name: 'Aceh', hls: 14.39 },
  { name: 'Nasional', hls: 13.21 },
  { name: 'Jawa Barat (terendah di Jawa)', hls: 12.8 },
  { name: 'Papua Pegunungan', hls: 9.97 },
  { name: 'Papua Tengah (terendah)', hls: 9.63 },
];

export const SOURCES = [
  'BPS — Berita Resmi Statistik: Pertumbuhan Ekonomi 2024 (5,03%), Inflasi Desember 2024 (1,57%), Kemiskinan September 2024 (8,57%), Pengangguran Agustus 2024 (4,91%), IPM 2024 (75,02).',
  'BPS — Statistik Indonesia 2025: penduduk pertengahan tahun 2024 (281,6 juta jiwa), PDB per kapita 2024 (Rp78,62 juta), ekspor–impor 2024 (US$264,70 / US$233,66 miliar).',
  'BPS — Jumlah penduduk menurut provinsi, estimasi pertengahan 2024; Harapan Lama Sekolah 2024 (nasional 13,21 tahun; DI Yogyakarta 15,70; Papua Tengah 9,63).',
  'Kementerian Kesehatan — Survei Status Gizi Indonesia (SSGI): prevalensi stunting balita 2024 (19,8%).',
  'Bank Dunia — PDB per kapita Indonesia 2024, sekitar US$4.925.',
];
