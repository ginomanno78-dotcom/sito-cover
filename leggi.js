// Esegui: node leggi.js
const fs = require('fs');
const c = fs.readFileSync('index.html', 'utf8').replace(/\r\n/g, '\n');
const inizio = c.indexOf('<section class="azienda"');
const fine = c.indexOf('</section>', inizio) + 10;
console.log(c.slice(inizio, fine));
