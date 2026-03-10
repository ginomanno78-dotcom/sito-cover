const fs = require('fs');
function leggi(f) { return fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n'); }
function scrivi(f, c) { fs.writeFileSync(f, c, 'utf8'); }

let html = leggi('foto-video.html');
html = html.replace(
  'https://img.youtube.com/vi/8sdRiRfQ5hA/maxresdefault.jpg',
  'https://img.youtube.com/vi/8sdRiRfQ5hA/hqdefault.jpg'
);
html = html.replace(
  'https://img.youtube.com/vi/OOhy04DFfLE/maxresdefault.jpg',
  'https://img.youtube.com/vi/OOhy04DFfLE/hqdefault.jpg'
);
scrivi('foto-video.html', html);
console.log('✓ foto-video.html — thumbnail hqdefault');
