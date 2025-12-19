/* =========================
 * File: answer-reveal.handler.EXPLORE_DFL.js
 * ========================= */
(() => {
  window.AnswerReveal = window.AnswerReveal || {};
  if (typeof AnswerReveal.register !== 'function') {
    console.warn('[AnswerReveal] registry no cargado. Ejecuta primero answer-reveal.registry.js');
    return;
  }

  const arr = AnswerReveal._util?.arr || ((x) => (typeof x === 'function' ? x() : x));
  const isCorrect = AnswerReveal._util?.isCorrect || ((r) => {
    const c = (typeof r?.correct === 'function') ? r.correct() : r?.correct;
    return c === true || c === 1;
  });
  const content = AnswerReveal._util?.content || ((obj) => {
    try {
      if (obj?._data && typeof obj._data === 'function') {
        const d = obj._data();
        if (d?.[0]?.content !== undefined) {
          return (typeof d[0].content === 'function') ? d[0].content() : d[0].content;
        }
      }
    } catch (e) {}
    for (const k of ['text', 'label', 'value', 'title', 'name']) {
      try { if (obj?.[k] !== undefined) return (typeof obj[k] === 'function') ? obj[k]() : obj[k]; } catch (e) {}
    }
    return '';
  });

  AnswerReveal.register('EXPLORE_DFL', {
    /**
     * EXPLORE_DFL en tu caso:
     * ex.questions -> q.responses (len>0) -> r.correct()
     * Retorna SOLO correctas para consola.
     */
    getCorrect(ex) {
      const qs = arr(ex?.questions) || [];
      const items = [];

      qs.forEach((q, qi) => {
        const rs = arr(q?.responses) || [];
        rs.forEach((r, ri) => {
          if (!isCorrect(r)) return;
          items.push({
            q: qi,
            r: ri,
            correct: content(r)
          });
        });
      });

      return items;
    }
  });

  console.log('[AnswerReveal] handler EXPLORE_DFL loaded');
})();

