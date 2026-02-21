// ============================================================
// CO.VER srl — JavaScript navbar
// ============================================================

(function () {
  'use strict';

  // Elementi DOM
  var navbar = document.getElementById('navbar');
  var hamburger = document.getElementById('hamburgerBtn');
  var navMenu = document.getElementById('navMenu');
  var navOverlay = document.getElementById('navOverlay');
  var dropItems = document.querySelectorAll('.navbar__item .navbar__toggle');

  // Timer per ritardo chiusura dropdown (350ms)
  var closeTimers = new Map();

  /**
   * Apre o chiude il menu mobile; opzionalmente forza la chiusura.
   * Blocca/sblocca lo scroll del body.
   */
  function toggleMenu(forceClose) {
    if (!navMenu || !hamburger || !navOverlay) return;
    var shouldOpen = forceClose === true ? false : !navMenu.classList.contains('open');
    if (shouldOpen) {
      navMenu.classList.add('open');
      hamburger.classList.add('open');
      navOverlay.classList.add('visible');
      navOverlay.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    } else {
      navMenu.classList.remove('open');
      hamburger.classList.remove('open');
      navOverlay.classList.remove('visible');
      navOverlay.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    }
  }

  /**
   * Chiude tutti i dropdown; opzionalmente esclude un elemento dal chiudere.
   */
  function closeAllDropdowns(eccezione) {
    document.querySelectorAll('.navbar__item.open').forEach(function (item) {
      if (item !== eccezione) item.classList.remove('open');
    });
  }

  // Click sull'hamburger → apre/chiude menu mobile
  if (hamburger) {
    hamburger.addEventListener('click', function () {
      toggleMenu();
    });
  }

  // Chiude il menu mobile al click su link interni (#sezione)
  document.querySelectorAll('.navbar a[href^="#"]').forEach(function (link) {
    link.addEventListener('click', function () {
      toggleMenu(true);
    });
  });

  // Click sull'overlay → chiudi menu e tutti i dropdown
  if (navOverlay) {
    navOverlay.addEventListener('click', function () {
      toggleMenu(true);
      closeAllDropdowns();
    });
  }

  // Gestione dropdown: hover (solo se hover disponibile), click sul toggle
  if (dropItems && dropItems.length) {
    dropItems.forEach(function (btn) {
      var item = btn.closest('.navbar__item');
      if (!item) return;

      // Hover: apre dropdown solo su dispositivi con hover
      if (window.matchMedia('(hover: hover)').matches) {
        item.addEventListener('mouseenter', function () {
          // Cancella tutti i timer di chiusura attivi
          closeTimers.forEach(function (timer) { clearTimeout(timer); });
          closeTimers.clear();
          // Chiudi immediatamente tutti gli altri dropdown
          closeAllDropdowns(item);
          // Apri questo
          item.classList.add('open');
        });
        item.addEventListener('mouseleave', function () {
          var t = setTimeout(function () {
            item.classList.remove('open');
            closeTimers.delete(item);
          }, 350);
          closeTimers.set(item, t);
        });
      }

      // Click sul toggle → apri/chiudi dropdown
      btn.addEventListener('click', function (e) {
        e.preventDefault();
        e.stopPropagation();
        var isOpen = item.classList.contains('open');
        closeAllDropdowns(item);
        if (!isOpen) {
          item.classList.add('open');
        } else {
          item.classList.remove('open');
        }
      });
    });
  }

  // Click fuori dalla navbar → chiudi tutti i dropdown
  document.addEventListener('click', function (e) {
    if (navbar && !navbar.contains(e.target)) closeAllDropdowns();
  });

  // Tasto ESC → chiudi menu mobile e dropdown
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
      toggleMenu(true);
      closeAllDropdowns();
    }
  });

  // Scroll → aggiungi/rimuovi classe .scrolled sulla navbar
  if (navbar) {
    window.addEventListener('scroll', function () {
      navbar.classList.toggle('scrolled', window.scrollY > 80);
    }, { passive: true });
    // Stato iniziale
    navbar.classList.toggle('scrolled', window.scrollY > 80);
  }

  // Resize: da mobile a desktop (>= 1024) → chiudi tutto
  window.addEventListener('resize', function () {
    if (window.innerWidth >= 1024) {
      toggleMenu(true);
      closeAllDropdowns();
    }
  });
})();

// ------------------------------------------------------------
// Slideshow hero — cambio automatico ogni 5 secondi con fade
// ------------------------------------------------------------
(function () {
  var slides = document.querySelectorAll('.hero__slide');
  var dots = document.querySelectorAll('.hero__dot');
  if (!slides.length) return;
  var current = 0;
  var timer;

  /* Testi corrispondenti a ogni slide */
  var slideTexts = ['Edilizia', 'Ambiente', 'Trasporti'];

  function goTo(index) {
    slides[current].classList.remove('active');
    dots[current].classList.remove('active');
    current = (index + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current].classList.add('active');

    /* Overlay su hero-2 (slide 1) e hero-3 (slide 2) */
    var heroOverlay2 = document.querySelector('.hero__overlay--2');
    var heroOverlay3 = document.querySelector('.hero__overlay--3');
    if (heroOverlay2) heroOverlay2.style.opacity = current === 1 ? '1' : '0';
    if (heroOverlay3) heroOverlay3.style.opacity = current === 2 ? '1' : '0';

    /* Animazione testo dinamico */
    var slideText = document.getElementById('heroSlideText');
    if (slideText) {
      /* Rimuovi e riapplica la classe per riavviare l'animazione */
      slideText.classList.remove('animate-start');
      slideText.classList.add('animate');
      slideText.textContent = slideTexts[current];
      /* Forza il reflow del browser per riavviare l'animazione */
      void slideText.offsetWidth;
      slideText.classList.remove('animate');
      slideText.classList.add('animate-start');
    }
  }

  function startTimer() {
    timer = setInterval(function () {
      goTo(current + 1);
    }, 5000);
  }

  // Click sui dot — resetta il timer
  dots.forEach(function (dot, i) {
    dot.addEventListener('click', function () {
      clearInterval(timer);
      goTo(i);
      startTimer();
    });
  });

  startTimer();
})();

// ------------------------------------------------------------
// Counter animati — si attivano quando la sezione Azienda entra nel viewport
// ------------------------------------------------------------
(function () {
  var counters = document.querySelectorAll('.counter__numero');
  if (!counters.length) return;

  var animated = false;

  function animateCounters() {
    if (animated) return;
    animated = true;
    counters.forEach(function (counter) {
      var target = parseInt(counter.getAttribute('data-target'), 10);
      var duration = 2000;
      var start = null;

      function step(timestamp) {
        if (!start) start = timestamp;
        var progress = Math.min((timestamp - start) / duration, 1);
        counter.textContent = Math.floor(progress * target);
        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          counter.textContent = target;
        }
      }
      requestAnimationFrame(step);
    });
  }

  // IntersectionObserver — parte quando la sezione è visibile (30%)
  var observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        animateCounters();
        observer.disconnect();
      }
    });
  }, { threshold: 0.3 });

  var sezione = document.querySelector('.azienda');
  if (sezione) observer.observe(sezione);
})();

// ------------------------------------------------------------
// Validazione form contatti
// ------------------------------------------------------------
(function () {
  var form = document.getElementById('contatti-form');
  var conferma = document.getElementById('form-conferma');
  if (!form) return;

  function mostraErrore(id, messaggio) {
    var el = document.getElementById(id);
    var input = document.getElementById(id.replace('errore-', ''));
    if (el) el.textContent = messaggio;
    if (input) input.classList.add('errore');
  }

  function pulisciErrore(id) {
    var el = document.getElementById(id);
    var input = document.getElementById(id.replace('errore-', ''));
    if (el) el.textContent = '';
    if (input) input.classList.remove('errore');
  }

  function validaEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function validaTelefono(tel) {
    return /^[\d\s\+\-]{9,}$/.test(tel);
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var valido = true;

    // Reset errori
    ['nome', 'email', 'telefono', 'messaggio'].forEach(function (campo) {
      pulisciErrore('errore-' + campo);
    });

    // Nome
    var nome = document.getElementById('nome').value.trim();
    if (!nome) {
      mostraErrore('errore-nome', 'Il nome è obbligatorio');
      valido = false;
    }

    // Email
    var email = document.getElementById('email').value.trim();
    if (!email) {
      mostraErrore('errore-email', "L'email è obbligatoria");
      valido = false;
    } else if (!validaEmail(email)) {
      mostraErrore('errore-email', "Inserisci un'email valida");
      valido = false;
    }

    // Telefono (opzionale ma se compilato deve essere valido)
    var telefono = document.getElementById('telefono').value.trim();
    if (telefono && !validaTelefono(telefono)) {
      mostraErrore('errore-telefono', 'Inserisci un numero valido (min. 9 cifre)');
      valido = false;
    }

    // Messaggio
    var messaggio = document.getElementById('messaggio').value.trim();
    if (!messaggio) {
      mostraErrore('errore-messaggio', 'Il messaggio è obbligatorio');
      valido = false;
    } else if (messaggio.length < 20) {
      mostraErrore('errore-messaggio', 'Il messaggio deve essere di almeno 20 caratteri');
      valido = false;
    }

    // Se tutto ok mostra conferma
    if (valido) {
      form.style.display = 'none';
      if (conferma) conferma.style.display = 'flex';
    }
  });
})();
