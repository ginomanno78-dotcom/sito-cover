/* ============================================================
   CO.VER srl — Chatbot Widget
   File: asset/js/chatbot.js
   Widget autonomo: si inietta nel DOM senza dipendenze esterne
   ============================================================ */

(function () {
  'use strict';

  /* ── Stili CSS injettati dinamicamente ── */
  const css = `
    /* Pulsante di apertura */
    .cb-trigger {
      position: fixed;
      bottom: 28px;
      right: 28px;
      width: 60px;
      height: 60px;
      border-radius: 50%;
      background: #282855;
      border: 2px solid rgba(255,255,255,0.15);
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 4px 20px rgba(40,40,85,0.5);
      z-index: 9999;
      transition: transform 0.25s ease, box-shadow 0.25s ease;
    }
    .cb-trigger:hover {
      transform: scale(1.08);
      box-shadow: 0 6px 28px rgba(40,40,85,0.7);
    }
    .cb-trigger svg {
      width: 28px;
      height: 28px;
      fill: #ffffff;
      transition: opacity 0.2s;
    }
    .cb-trigger .cb-icon-close { display: none; }
    .cb-trigger.aperto .cb-icon-chat { display: none; }
    .cb-trigger.aperto .cb-icon-close { display: block; }

    /* Pallino notifica */
    .cb-badge {
      position: absolute;
      top: 2px;
      right: 2px;
      width: 14px;
      height: 14px;
      background: #e74c3c;
      border-radius: 50%;
      border: 2px solid #ffffff;
      display: none;
    }
    .cb-badge.visibile { display: block; }

    /* Finestra chat */
    .cb-finestra {
      position: fixed;
      bottom: 102px;
      right: 28px;
      width: 360px;
      max-width: calc(100vw - 40px);
      height: 500px;
      max-height: calc(100vh - 140px);
      background: #ffffff;
      border-radius: 16px;
      box-shadow: 0 8px 40px rgba(40,40,85,0.25);
      display: flex;
      flex-direction: column;
      z-index: 9998;
      overflow: hidden;
      opacity: 0;
      transform: translateY(16px) scale(0.97);
      pointer-events: none;
      transition: opacity 0.25s ease, transform 0.25s ease;
    }
    .cb-finestra.aperta {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    /* Header */
    .cb-header {
      background: #282855;
      padding: 16px 20px;
      display: flex;
      align-items: center;
      gap: 12px;
      flex-shrink: 0;
    }
    .cb-avatar {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: rgba(255,255,255,0.15);
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
    }
    .cb-avatar svg {
      width: 20px;
      height: 20px;
      fill: #ffffff;
    }
    .cb-header-info { flex: 1; }
    .cb-header-nome {
      font-family: 'Jost', sans-serif;
      font-size: 14px;
      font-weight: 600;
      color: #ffffff;
      line-height: 1.2;
    }
    .cb-header-stato {
      font-size: 11px;
      color: rgba(255,255,255,0.65);
      display: flex;
      align-items: center;
      gap: 5px;
      margin-top: 2px;
    }
    .cb-stato-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #2ecc71;
    }

    /* Area messaggi */
    .cb-messaggi {
      flex: 1;
      overflow-y: auto;
      padding: 16px;
      display: flex;
      flex-direction: column;
      gap: 10px;
      background: #f7f7fb;
      scroll-behavior: smooth;
    }
    .cb-messaggi::-webkit-scrollbar { width: 4px; }
    .cb-messaggi::-webkit-scrollbar-track { background: transparent; }
    .cb-messaggi::-webkit-scrollbar-thumb { background: #d0d0e0; border-radius: 4px; }

    /* Singolo messaggio */
    .cb-msg {
      max-width: 82%;
      padding: 10px 14px;
      border-radius: 14px;
      font-family: 'Gothic', 'Trebuchet MS', sans-serif;
      font-size: 13px;
      line-height: 1.5;
      word-break: break-word;
      animation: cb-entrata 0.2s ease;
    }
    @keyframes cb-entrata {
      from { opacity: 0; transform: translateY(6px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    .cb-msg.bot {
      background: #ffffff;
      color: #1a1a2e;
      border-radius: 4px 14px 14px 14px;
      align-self: flex-start;
      box-shadow: 0 1px 4px rgba(40,40,85,0.1);
    }
    .cb-msg.utente {
      background: #282855;
      color: #ffffff;
      border-radius: 14px 14px 4px 14px;
      align-self: flex-end;
    }

    /* Indicatore di digitazione */
    .cb-typing {
      display: flex;
      align-items: center;
      gap: 4px;
      padding: 10px 14px;
      background: #ffffff;
      border-radius: 4px 14px 14px 14px;
      align-self: flex-start;
      box-shadow: 0 1px 4px rgba(40,40,85,0.1);
    }
    .cb-typing span {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #282855;
      opacity: 0.4;
      animation: cb-bounce 1.2s infinite;
    }
    .cb-typing span:nth-child(2) { animation-delay: 0.2s; }
    .cb-typing span:nth-child(3) { animation-delay: 0.4s; }
    @keyframes cb-bounce {
      0%, 80%, 100% { transform: translateY(0); opacity: 0.4; }
      40%            { transform: translateY(-5px); opacity: 1; }
    }

    /* Input area */
    .cb-input-area {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 12px 14px;
      background: #ffffff;
      border-top: 1px solid #ebebf5;
      flex-shrink: 0;
    }
    .cb-input {
      flex: 1;
      border: 1.5px solid #e0e0ee;
      border-radius: 22px;
      padding: 9px 16px;
      font-family: 'Gothic', 'Trebuchet MS', sans-serif;
      font-size: 13px;
      color: #1a1a2e;
      background: #f7f7fb;
      outline: none;
      resize: none;
      transition: border-color 0.2s;
      line-height: 1.4;
      max-height: 90px;
      overflow-y: auto;
    }
    .cb-input:focus { border-color: #282855; background: #ffffff; }
    .cb-input::placeholder { color: #a0a0b8; }
    .cb-invia {
      width: 38px;
      height: 38px;
      border-radius: 50%;
      background: #282855;
      border: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      transition: background 0.2s, transform 0.15s;
    }
    .cb-invia:hover { background: #3a3a7a; transform: scale(1.05); }
    .cb-invia:disabled { background: #c0c0d8; cursor: not-allowed; transform: none; }
    .cb-invia svg {
      width: 18px;
      height: 18px;
      fill: #ffffff;
    }

    /* Bottone chiudi nell'header (visibile solo mobile) */
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

    /* Mobile responsive */
    @media (max-width: 480px) {
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
    }
  `;

  /* ── Messaggio di benvenuto ── */
  const BENVENUTO = 'Ciao! Sono l\'assistente virtuale di CO.VER srl. Posso risponderti su servizi, mezzi, certificazioni e modalità operative. Come posso aiutarti?';

  /* ── Stato conversazione ── */
  let messaggi = [];
  let inAttesa = false;

  /* ── Costruzione HTML ── */
  function creaWidget() {
    // Inject CSS
    const style = document.createElement('style');
    style.textContent = css;
    document.head.appendChild(style);

    // Trigger button
    const trigger = document.createElement('button');
    trigger.className = 'cb-trigger';
    trigger.setAttribute('aria-label', 'Apri assistente virtuale CO.VER');
    trigger.innerHTML = `
      <svg class="cb-icon-chat" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z"/>
      </svg>
      <svg class="cb-icon-close" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
      <span class="cb-badge" id="cb-badge"></span>
    `;

    // Finestra chat
    const finestra = document.createElement('div');
    finestra.className = 'cb-finestra';
    finestra.setAttribute('role', 'dialog');
    finestra.setAttribute('aria-label', 'Assistente virtuale CO.VER srl');
    finestra.innerHTML = `
      <div class="cb-header">
        <div class="cb-avatar">
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
          </svg>
        </div>
        <div class="cb-header-info">
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
      </div>
      <div class="cb-messaggi" id="cb-messaggi"></div>
      <div class="cb-input-area">
        <textarea
          class="cb-input"
          id="cb-input"
          placeholder="Scrivi un messaggio..."
          rows="1"
          aria-label="Messaggio per l'assistente"
        ></textarea>
        <button class="cb-invia" id="cb-invia" aria-label="Invia messaggio" disabled>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/>
          </svg>
        </button>
      </div>
    `;

    document.body.appendChild(trigger);
    document.body.appendChild(finestra);

    return { trigger, finestra };
  }

  /* ── Aggiunge un messaggio nella chat ── */
  function aggiungiMessaggio(testo, tipo) {
    const contenitore = document.getElementById('cb-messaggi');
    const msg = document.createElement('div');
    msg.className = 'cb-msg ' + tipo;
    msg.textContent = testo;
    contenitore.appendChild(msg);
    contenitore.scrollTop = contenitore.scrollHeight;
    return msg;
  }

  /* ── Mostra/nasconde indicatore di digitazione ── */
  function mostraTyping(visible) {
    const contenitore = document.getElementById('cb-messaggi');
    let typing = document.getElementById('cb-typing');
    if (visible && !typing) {
      typing = document.createElement('div');
      typing.className = 'cb-typing';
      typing.id = 'cb-typing';
      typing.innerHTML = '<span></span><span></span><span></span>';
      contenitore.appendChild(typing);
      contenitore.scrollTop = contenitore.scrollHeight;
    } else if (!visible && typing) {
      typing.remove();
    }
  }

  /* ── Invia messaggio a /api/chat ── */
  async function invia(testo) {
    if (!testo.trim() || inAttesa) return;
    inAttesa = true;

    const btnInvia = document.getElementById('cb-invia');
    const input = document.getElementById('cb-input');

    // Aggiunge messaggio utente
    aggiungiMessaggio(testo, 'utente');
    messaggi.push({ role: 'user', content: testo });

    // Resetta input
    input.value = '';
    input.style.height = 'auto';
    btnInvia.disabled = true;

    // Mostra typing
    mostraTyping(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messaggi: messaggi })
      });

      const dati = await res.json();
      mostraTyping(false);

      if (dati.risposta) {
        aggiungiMessaggio(dati.risposta, 'bot');
        messaggi.push({ role: 'assistant', content: dati.risposta });
      } else {
        aggiungiMessaggio('Mi dispiace, si è verificato un errore. Riprova o contattaci al 0823 704255.', 'bot');
      }
    } catch (err) {
      mostraTyping(false);
      aggiungiMessaggio('Connessione assente. Riprova più tardi o contattaci al 0823 704255.', 'bot');
    }

    inAttesa = false;
    btnInvia.disabled = false;
    input.focus();
  }

  /* ── Inizializzazione ── */
  function init() {
    const { trigger, finestra } = creaWidget();
    const badge = document.getElementById('cb-badge');
    const input = document.getElementById('cb-input');
    const btnInvia = document.getElementById('cb-invia');
    let aperto = false;
    let benvenutoMostrato = false;

    // Apri/chiudi finestra
    trigger.addEventListener('click', function () {
      aperto = !aperto;
      trigger.classList.toggle('aperto', aperto);
      finestra.classList.toggle('aperta', aperto);
      badge.classList.remove('visibile');

      // Mostra benvenuto al primo apertura
      if (aperto && !benvenutoMostrato) {
        benvenutoMostrato = true;
        setTimeout(function () {
          mostraTyping(true);
          setTimeout(function () {
            mostraTyping(false);
            aggiungiMessaggio(BENVENUTO, 'bot');
          }, 800);
        }, 200);
      }

      if (aperto) {
        setTimeout(function () { input.focus(); }, 300);
      }
    });

    // Abilita/disabilita bottone invio
    input.addEventListener('input', function () {
      btnInvia.disabled = !this.value.trim();
      // Auto-resize textarea
      this.style.height = 'auto';
      this.style.height = Math.min(this.scrollHeight, 90) + 'px';
    });

    // Invio con Enter (Shift+Enter per andare a capo)
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        if (!btnInvia.disabled) invia(this.value.trim());
      }
    });

    // Click bottone invia
    btnInvia.addEventListener('click', function () {
      invia(input.value.trim());
    });

    // Bottone chiudi nell'header (mobile)
    const btnChiudiHeader = document.getElementById('cb-btn-chiudi');
    if (btnChiudiHeader) {
      btnChiudiHeader.addEventListener('click', function () {
        aperto = false;
        trigger.classList.remove('aperto');
        finestra.classList.remove('aperta');
        badge.classList.remove('visibile');
      });
    }

    // Mostra badge dopo 5 secondi se non aperto
    setTimeout(function () {
      if (!aperto) badge.classList.add('visibile');
    }, 5000);
  }

  // Avvia quando il DOM è pronto
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
