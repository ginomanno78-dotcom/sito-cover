const fs = require('fs');
function leggi(f) { return fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n'); }
function scrivi(f, c) { fs.writeFileSync(f, c, 'utf8'); }

let css = leggi('style.css');

// Griglia: altezza riga fissa = altezza del verticale (120px × 16/9 ≈ 213px)
css = css.replace(
`  grid-template-columns: 1fr 1fr 120px;
  gap: 10px;
  margin-top: 40px;
  max-width: 520px;
  margin-left: auto;
  margin-right: auto;
  align-items: stretch;
}`,
`  grid-template-columns: 213px 213px 120px;
  gap: 10px;
  margin-top: 40px;
  max-width: 570px;
  margin-left: auto;
  margin-right: auto;
  align-items: start;
}`
);

// Facade orizzontale: altezza fissa uguale al verticale
css = css.replace(
`/* Facade orizzontale — si adatta all'altezza del verticale */
.fv-video__facade {
  position: relative;
  width: 100%;
  aspect-ratio: unset;
  flex: 1;`,
`/* Facade orizzontale — stessa altezza del verticale */
.fv-video__facade {
  position: relative;
  width: 100%;
  height: 213px;
  aspect-ratio: unset;`
);

scrivi('style.css', css);
console.log('✓ style.css — orizzontali 213×213px, allineati al verticale');
