// CO.VER srl — Patch: collegamento form contatto a Formspree
// Esegui: node patch.js

const fs = require('fs');
function leggi(f) { return fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n'); }
function scrivi(f, c) { fs.writeFileSync(f, c, 'utf8'); }
function sostituisci(file, vecchio, nuovo, desc) {
  let c = leggi(file);
  if (!c.includes(vecchio)) { console.log(`  ✗ NON TROVATO in ${file} — ${desc}`); return; }
  scrivi(file, c.replace(vecchio, nuovo));
  console.log(`  ✓ ${file} — ${desc}`);
}

console.log('\n=== CO.VER srl — Patch form Formspree ===\n');

// ── PATCH 1: index.html — aggiunge action e method al form
sostituisci('index.html',
  `<form class="contatti__form" id="contatti-form" novalidate>`,
  `<form class="contatti__form" id="contatti-form" action="https://formspree.io/f/mkoqropr" method="POST" novalidate>`,
  'Form: aggiunto action Formspree'
);

// ── PATCH 2: main.js — sostituisce il finto submit con fetch reale
sostituisci('main.js',
  `    if (valido) {
      form.style.display = 'none';
      if (conferma) conferma.style.display = 'flex';
    }`,
  `    if (valido) {
      var submitBtn = form.querySelector('.form__submit');
      submitBtn.textContent = 'Invio in corso...';
      submitBtn.disabled = true;

      var dati = new FormData(form);

      fetch('https://formspree.io/f/mkoqropr', {
        method: 'POST',
        body: dati,
        headers: { 'Accept': 'application/json' }
      })
      .then(function(risposta) {
        if (risposta.ok) {
          // Successo: nasconde form e mostra conferma
          form.style.display = 'none';
          if (conferma) conferma.style.display = 'flex';
        } else {
          // Errore server Formspree
          submitBtn.textContent = 'Invia Richiesta';
          submitBtn.disabled = false;
          mostraErrore('errore-messaggio', 'Errore nell\'invio. Riprova o contattaci per telefono.');
        }
      })
      .catch(function() {
        // Errore di rete
        submitBtn.textContent = 'Invia Richiesta';
        submitBtn.disabled = false;
        mostraErrore('errore-messaggio', 'Connessione assente. Riprova più tardi.');
      });
    }`,
  'main.js: submit con fetch Formspree'
);

console.log('\n=== Fine patch ===\n');
