/* =========================
 * File: answer-reveal.handler.TYP.js
 * ========================= */
(() => {
  window.AnswerReveal = window.AnswerReveal || {};
  if (typeof AnswerReveal.register !== 'function') {
    console.warn('[AnswerReveal] registry no cargado. Ejecuta primero answer-reveal.registry.js');
    return;
  }

  const arr = AnswerReveal._util?.arr || ((x) => (typeof x === 'function' ? x() : x));

  AnswerReveal.register('TYP', {
    /**
     * TYP: preguntas de “rellenar / escribir”.
     * En tu modelo, cada question expone TYP_get_answer().
     * Retorna solo para consola (no toca UI).
     */
    getCorrect(ex) {
      const qs = arr(ex?.questions) || [];
      const items = [];

      qs.forEach((q, i) => {
        const ans = (typeof q?.TYP_get_answer === 'function') ? q.TYP_get_answer() : null;
        items.push({ i, correct: ans ?? '' });
      });

      return items;
    }
  });

  console.log('[AnswerReveal] handler TYP loaded');
})();
