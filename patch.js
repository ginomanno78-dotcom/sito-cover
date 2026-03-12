// CO.VER srl — Patch: aggiunta widget chatbot a tutte le pagine
// Esegui: node patch.js

const fs = require('fs');

function leggi(f) { return fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n'); }
function scrivi(f, c) { fs.writeFileSync(f, c, 'utf8'); }

const pagine = [
  'index.html',
  'edilizia.html',
  'trasporti.html',
  'ambiente.html',
  'automezzi.html',
  'foto-video.html'
];

const scriptTag = `  <!-- Widget Chatbot CO.VER -->\n  <script src="asset/js/chatbot.js" defer></script>`;

console.log('\n=== CO.VER srl — Patch chatbot widget ===\n');

pagine.forEach(function (pagina) {
  if (!fs.existsSync(pagina)) {
    console.log('  ⚠ SALTATO (non trovato): ' + pagina);
    return;
  }
  let c = leggi(pagina);
  if (c.includes('chatbot.js')) {
    console.log('  ○ GIA PRESENTE: ' + pagina);
    return;
  }
  const nuovo = c.replace('</body>', scriptTag + '\n</body>');
  if (nuovo === c) {
    console.log('  ✗ </body> NON TROVATO: ' + pagina);
    return;
  }
  scrivi(pagina, nuovo);
  console.log('  ✓ ' + pagina);
});

console.log('\n=== Fine patch ===\n');
