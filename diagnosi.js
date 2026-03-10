// Esegui: node diagnosi.js
const fs = require('fs');

const files = ['edilizia.html','trasporti.html','ambiente.html','automezzi.html','foto-video.html'];

console.log('\n=== DIAGNOSI NAVBAR ===\n');

files.forEach(file => {
  if (!fs.existsSync(file)) { console.log(`✗ NON TROVATO: ${file}`); return; }
  const c = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');

  const hasMainJs    = c.includes('src="main.js"');
  const toggleCount  = (c.match(/navbar__toggle/g) || []).length;
  const hasDropdown  = c.includes('navbar__dropdown');
  const scriptPos    = c.indexOf('main.js');
  const bodyClose    = c.indexOf('</body>');
  const scriptBefore = scriptPos !== -1 && bodyClose !== -1 && scriptPos < bodyClose;

  console.log(`${file}`);
  console.log(`  main.js presente:      ${hasMainJs  ? '✓' : '✗ MANCANTE — QUESTO È IL BUG'}`);
  console.log(`  main.js prima di </body>: ${scriptBefore ? '✓' : '✗'}`);
  console.log(`  Toggle buttons:        ${toggleCount}`);
  console.log(`  Dropdown presente:     ${hasDropdown ? '✓' : '✗'}`);
  console.log('');
});
