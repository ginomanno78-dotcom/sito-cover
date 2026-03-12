// CO.VER srl — Patch: fix chiusura chatbot su mobile
// Esegui: node patch.js

const fs = require('fs');
function leggi(f) { return fs.readFileSync(f, 'utf8').replace(/\r\n/g, '\n'); }
function scrivi(f, c) { fs.writeFileSync(f, c, 'utf8'); }
function sostituisci(file, vecchio, nuovo, desc) {
  let c = leggi(file);
  if (!c.includes(vecchio)) { console.log('  ✗ NON TROVATO: ' + desc); return; }
  scrivi(file, c.replace(vecchio, nuovo));
  console.log('  ✓ ' + desc);
}

console.log('\n=== CO.VER srl — Patch fix chatbot mobile ===\n');

// PATCH 1: CSS — nascondi trigger quando chat aperta su mobile
sostituisci('asset/js/chatbot.js',
  `    @media (max-width: 480px) {
      .cb-finestra {
        bottom: 0;
        right: 0;
        width: 100vw;
        max-width: 100vw;
        height: 100dvh;
        max-height: 100dvh;
        border-radius: 0;
      }
      .cb-trigger {
        bottom: 20px;
        right: 20px;
      }
    }`,
  `    @media (max-width: 480px) {
      .cb-finestra {
        bottom: 0;
        right: 0;
        width: 100vw;
        max-width: 100vw;
        height: 100dvh;
        max-height: 100dvh;
        border-radius: 0;
      }
      .cb-trigger {
        bottom: 20px;
        right: 20px;
      }
      .cb-trigger.aperto {
        display: none;
      }
      .cb-btn-chiudi {
        display: flex !important;
      }
    }`,
  'CSS: nascondi trigger mobile quando aperto'
);

// PATCH 2: HTML header — aggiungi bottone X nell'header
sostituisci('asset/js/chatbot.js',
  `        <div class="cb-header-info">
          <div class="cb-header-nome">Assistente CO.VER srl</div>
          <div class="cb-header-stato">
            <span class="cb-stato-dot"></span>
            Online — risponde subito
          </div>
        </div>
      </div>`,
  `        <div class="cb-header-info">
          <div class="cb-header-nome">Assistente CO.VER srl</div>
          <div class="cb-header-stato">
            <span class="cb-stato-dot"></span>
            Online — risponde subito
          </div>
        </div>
        <button class="cb-btn-chiudi" id="cb-btn-chiudi" aria-label="Chiudi chat">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>`,
  'HTML: aggiunto bottone X nell header'
);

// PATCH 3: CSS bottone chiudi nell'header
sostituisci('asset/js/chatbot.js',
  `    /* Mobile responsive */`,
  `    /* Bottone chiudi nell'header (visibile solo mobile) */
    .cb-btn-chiudi {
      display: none;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      border: none;
      cursor: pointer;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.2s;
    }
    .cb-btn-chiudi:hover { background: rgba(255,255,255,0.25); }
    .cb-btn-chiudi svg {
      width: 18px;
      height: 18px;
      fill: #ffffff;
    }

    /* Mobile responsive */`,
  'CSS: stile bottone chiudi header'
);

// PATCH 4: JS — collega click bottone chiudi header
sostituisci('asset/js/chatbot.js',
  `    // Mostra badge dopo 5 secondi se non aperto`,
  `    // Bottone chiudi nell'header (mobile)
    const btnChiudiHeader = document.getElementById('cb-btn-chiudi');
    if (btnChiudiHeader) {
      btnChiudiHeader.addEventListener('click', function () {
        aperto = false;
        trigger.classList.remove('aperto');
        finestra.classList.remove('aperta');
        badge.classList.remove('visibile');
      });
    }

    // Mostra badge dopo 5 secondi se non aperto`,
  'JS: evento click bottone chiudi header'
);

console.log('\n=== Fine patch ===\n');
