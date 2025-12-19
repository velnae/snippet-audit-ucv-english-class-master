/* =========================
 * File: answer-reveal.handler.EXPLORE_SLS.js
 * ========================= */
(() => {
  window.AnswerReveal = window.AnswerReveal || {};
  if (typeof AnswerReveal.register !== 'function') {
    console.warn('[AnswerReveal] registry no cargado');
    return;
  }

  const arr = AnswerReveal._util.arr;
  const content = AnswerReveal._util.content;

  AnswerReveal.register('EXPLORE_SLS', {
    getCorrect(ex) {
      const qs = arr(ex.questions) || [];
      const rows = [];

      if (!qs.length) return rows;

      // -------------------------------------------------
      // Caso 1: PLANO → questions = responses
      // -------------------------------------------------
      if (
        typeof qs[0]?.correct === 'function' &&
        typeof qs[0]?.selected === 'function' &&
        !qs[0]?.responses
      ) {
        qs.forEach((r, i) => {
          if (r.correct() === true || r.correct() === 1) {
            rows.push({
              i,
              correct: content(r) ?? ''
            });
          }
        });
        return rows;
      }

      // -------------------------------------------------
      // Caso 2: QUESTIONS → RESPONSES
      // -------------------------------------------------
      qs.forEach((q, qi) => {
        const rs = arr(q.responses) || [];
        rs.forEach((r, ri) => {
          if (r.correct() === true || r.correct() === 1) {
            rows.push({
              q: qi,
              r: ri,
              correct: content(r) ?? ''
            });
          }
        });
      });

      return rows;
    }
  });

  console.log('[AnswerReveal] handler EXPLORE_SLS loaded');
})();
