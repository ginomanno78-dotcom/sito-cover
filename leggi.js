// Esegui: node leggi.js
// Legge la sezione video attuale di foto-video.html
const fs = require('fs');
const c = fs.readFileSync('foto-video.html', 'utf8').replace(/\r\n/g, '\n');
const i = c.indexOf('Video');
console.log(c.slice(i - 50, i + 500));
