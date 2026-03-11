// CO.VER srl — Patch: fix SyntaxError apostrofo in main.js
// Esegui: node patch.js

const fs = require('fs');
function leggi(f) { return fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n'); }
function scrivi(f, c) { fs.writeFileSync(f, c, 'utf8'); }

let c = leggi('main.js');
const nuovo_c = c.replace(
  `mostraErrore('errore-messaggio', 'Errore nell'invio. Riprova o contattaci per telefono.');`,
  `mostraErrore('errore-messaggio', "Errore nell'invio. Riprova o contattaci per telefono.");`
);
if (nuovo_c === c) { console.log('✗ NON TROVATO'); }
else { scrivi('main.js', nuovo_c); console.log('✓ main.js — apostrofo corretto'); }
