(async () => {
  const STORAGE_KEY = 'ANSWER_REVEAL_BASE_URL';

  // 1) Resolver BASE_URL
  let BASE_URL =
    window.ANSWER_REVEAL_BASE_URL ||
    localStorage.getItem(STORAGE_KEY);

  if (!BASE_URL) {
    BASE_URL = prompt(
      'Ingrese BASE URL para AnswerReveal (ej: https://raw.githubusercontent.com/usuario/repo/main)'
    );
    if (!BASE_URL) {
      console.warn('[AnswerReveal] Loader cancelado (sin BASE_URL)');
      return;
    }
    localStorage.setItem(STORAGE_KEY, BASE_URL);
  }

  BASE_URL = BASE_URL.replace(/\/$/, ''); // sin slash final

  console.log('[AnswerReveal] BASE_URL =', BASE_URL);

  // 2) Archivos a cargar (orden importa)
  const files = [
    '/answer-reveal/answer-reveal.registry.js',
    '/answer-reveal/answer-reveal.core.js',
    '/answer-reveal/answer-reveal.boot.js',

    // handlers
    '/answer-reveal/handlers/answer-reveal.handler.EXPLORE_DFL.js',
    '/answer-reveal/handlers/answer-reveal.handler.EXPLORE_SLS.js',
    '/answer-reveal/handlers/answer-reveal.handler.MMM.js',
    '/answer-reveal/handlers/answer-reveal.handler.TAB.js',
    '/answer-reveal/handlers/answer-reveal.handler.TYP.js',
  ];

  // 3) Loader secuencial (respeta orden)
  const loadScript = (url) =>
    new Promise((resolve, reject) => {
      const s = document.createElement('script');
      s.src = url + '?v=' + Date.now(); // cache-buster
      s.onload = resolve;
      s.onerror = () => reject(new Error('No se pudo cargar ' + url));
      document.head.appendChild(s);
    });

  try {
    for (const f of files) {
      await loadScript(BASE_URL + f);
    }
    console.log('[AnswerReveal] Loader OK ✅');
    console.log('Comando disponible: AnswerReveal.logCorrect()');
  } catch (err) {
    console.error('[AnswerReveal] Error cargando archivos', err);
  }
})();
