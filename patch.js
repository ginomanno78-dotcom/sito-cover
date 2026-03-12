// CO.VER srl — Patch: rimozione action dal form (evita redirect Formspree)
// Esegui: node patch.js

const fs = require('fs');
function leggi(f) { return fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n'); }
function scrivi(f, c) { fs.writeFileSync(f, c, 'utf8'); }

let c = leggi('index.html');
const nuovo = c.replace(
  /(<form[^>]*id="contatti-form")[^>]*(novalidate>)/,
  '$1 $2'
);
if (nuovo === c) { console.log('✗ NON TROVATO'); }
else { scrivi('index.html', nuovo); console.log('✓ index.html — action e method rimossi dal form'); }
