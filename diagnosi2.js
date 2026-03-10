// Incolla questo nel Console del browser mentre sei su edilizia.html
// Apri DevTools (F12) → Console → incolla tutto e premi Invio

(function() {
  const toggle = document.querySelector('.navbar__toggle');
  if (!toggle) { console.log('✗ Toggle non trovato'); return; }

  const li = toggle.closest('.navbar__item');
  const dropdown = li.querySelector('.navbar__dropdown');

  console.log('=== DIAGNOSI NAVBAR EDILIZIA ===');

  // 1. Simula l'apertura del dropdown
  li.classList.add('open');
  const stileDropdown = window.getComputedStyle(dropdown);
  console.log('Visibility:', stileDropdown.visibility);
  console.log('Opacity:', stileDropdown.opacity);
  console.log('Z-index dropdown:', stileDropdown.zIndex);
  console.log('Display:', stileDropdown.display);
  console.log('Position:', stileDropdown.position);

  // 2. Controlla se qualcosa sopra il dropdown ha z-index alto
  const navbar = document.getElementById('navbar');
  const stileNavbar = window.getComputedStyle(navbar);
  console.log('Z-index navbar:', stileNavbar.zIndex);
  console.log('Overflow navbar:', stileNavbar.overflow);

  // 3. Controlla il primo elemento dopo la navbar (potrebbe coprire)
  const main = document.querySelector('main') || document.querySelector('.hero-mini') || document.querySelector('.page-hero');
  if (main) {
    const stileMain = window.getComputedStyle(main);
    console.log('Z-index main/hero:', stileMain.zIndex);
    console.log('Overflow main/hero:', stileMain.overflow);
    // Rect del dropdown vs rect del main
    const rDrop = dropdown.getBoundingClientRect();
    const rMain = main.getBoundingClientRect();
    console.log('Dropdown top:', Math.round(rDrop.top), '— Main top:', Math.round(rMain.top));
    console.log('Si sovrappongono:', rDrop.bottom > rMain.top ? '⚠ SÌ — il main potrebbe coprire il dropdown' : '✓ NO');
  }

  // 4. Controlla errori JS che potrebbero bloccare i listener
  console.log('Listener mouseenter attivo:', typeof li.onmouseenter);

  li.classList.remove('open');
  console.log('=== FINE ===');
})();
