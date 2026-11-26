// StatDesk Indonesia — router hash dan pengkabelan kontrol.
//
// Rute: #/ (beranda), #/population, #/economy, #/health, #/education,
// #/regions, #/about. Semua halaman dirender ulang dari data.js setiap kali
// rute atau kontrol berubah, jadi yang tampil selalu cocok dengan angkanya.

import { renderHome, renderPopulation, renderEconomy, renderHealth, renderEducation, renderRegions, renderAbout } from './views.js';

const app = document.getElementById('app');
const navLinks = [...document.querySelectorAll('[data-nav]')];

// Keadaan halaman Wilayah (pencarian, urutan, tampilan) dipertahankan selama
// sesi supaya kontrol terasa seperti aplikasi sungguhan.
const regionsState = { query: '', sortKey: 'population', sortDir: 'desc', view: 'table' };
let economyTab = 'growth';
let homeYear = 2024;

const PAGES = {
  home: { render: () => renderHome(homeYear), nav: 'home' },
  population: { render: renderPopulation, nav: 'population' },
  economy: { render: () => renderEconomy(economyTab), nav: 'economy' },
  health: { render: renderHealth, nav: 'health' },
  education: { render: renderEducation, nav: 'education' },
  regions: { render: () => renderRegions(regionsState), nav: 'regions' },
  about: { render: renderAbout, nav: 'about' },
};

function currentPage() {
  const hash = window.location.hash.replace(/^#\/?/, '');
  return PAGES[hash] ? hash : 'home';
}

function render() {
  const page = currentPage();
  app.innerHTML = PAGES[page].render();
  for (const link of navLinks) {
    link.classList.toggle('active', link.dataset.nav === PAGES[page].nav);
  }
  window.scrollTo(0, 0);
}

// Semua kontrol halaman didelegasikan dari satu pendengar klik + satu
// pendengar perubahan, jadi tidak ada atribut onclick di markup.
app.addEventListener('click', (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;
  const action = button.dataset.action;
  if (action === 'tab') {
    economyTab = button.dataset.tab;
    render();
  } else if (action === 'sort') {
    const key = button.dataset.key;
    if (regionsState.sortKey === key) {
      regionsState.sortDir = regionsState.sortDir === 'asc' ? 'desc' : 'asc';
    } else {
      regionsState.sortKey = key;
      regionsState.sortDir = key === 'name' || key === 'island' ? 'asc' : 'desc';
    }
    render();
  } else if (action === 'view') {
    regionsState.view = button.dataset.view;
    render();
  }
});

app.addEventListener('change', (event) => {
  const control = event.target.closest('[data-action]');
  if (!control) return;
  if (control.dataset.action === 'year') {
    homeYear = Number(control.value) || 2024;
    render();
  }
});

app.addEventListener('input', (event) => {
  const control = event.target.closest('[data-action="search"]');
  if (!control) return;
  regionsState.query = control.value;
  // Render ulang tabel saja tanpa memindahkan fokus dari kotak pencari.
  const panel = control.closest('.panel');
  const keepFocus = document.activeElement === control;
  render();
  if (keepFocus) {
    const again = document.getElementById('province-search');
    if (again) {
      again.focus();
      again.setSelectionRange(again.value.length, again.value.length);
    }
  }
});

window.addEventListener('hashchange', render);
render();
