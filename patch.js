// CO.VER srl — Patch: rimuove offuscamento email Cloudflare da tutti i file HTML
// Esegui: node patch.js

const fs = require('fs');

const files = [
  'index.html',
  'edilizia.html',
  'trasporti.html',
  'ambiente.html',
  'automezzi.html',
  'foto-video.html'
];

// Email reali da ripristinare
const EMAIL_1 = 'verrengiacover@covercostruzioni.it';
const EMAIL_2 = 'amministrazione@covercostruzioni.it';

// Pattern Cloudflare — sostituisce l'intero tag <a> offuscato con il testo email semplice
const CF_PATTERN = /<a href="\/cdn-cgi\/l\/email-protection"[^>]*class="__cf_email__"[^>]*>[^<]*<\/a>/g;

console.log('\n=== CO.VER srl — Rimozione offuscamento email ===\n');

files.forEach(file => {
  if (!fs.existsSync(file)) return;

  let c = fs.readFileSync(file, 'utf8').replace(/\r\n/g, '\n');
  const matches = c.match(CF_PATTERN);
  if (!matches) { console.log(`  - ${file}: nessuna email offuscata trovata`); return; }

  // Sostituisce in ordine di apparizione: prima occorrenza = EMAIL_1, seconda = EMAIL_2
  let count = 0;
  c = c.replace(CF_PATTERN, () => {
    count++;
    return count === 1 ? EMAIL_1 : EMAIL_2;
  });

  fs.writeFileSync(file, c, 'utf8');
  console.log(`  ✓ ${file} — ${count} email ripristinate`);
});

console.log('\n=== Fine patch ===\n');
