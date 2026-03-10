// CO.VER srl — Patch: foto uffici — margine + bordo
// Esegui: node patch.js

const fs = require('fs');
function leggi(f) { return fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n'); }
function scrivi(f, c) { fs.writeFileSync(f, c, 'utf8'); }

let c = leggi('style.css');
c = c.replace(
  `  margin-top: 58px;
}

.azienda__foto {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 4px;
  display: block;
}`,
  `  margin-top: 96px;
}

.azienda__foto {
  width: 100%;
  height: 220px;
  object-fit: cover;
  border-radius: 4px;
  display: block;
  border: 2px solid #ffffff;
}`
);
scrivi('style.css', c);
console.log('✓ style.css — foto: margine aumentato + bordo bianco 2px');
