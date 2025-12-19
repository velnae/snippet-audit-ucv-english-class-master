/* =========================
 * File: answer-reveal.handler.TAB.js  (v2: content robusto)
 * ========================= */
(() => {
  window.AnswerReveal = window.AnswerReveal || {};
  if (typeof AnswerReveal.register !== 'function') {
    console.warn('[AnswerReveal] registry no cargado. Ejecuta primero answer-reveal.registry.js');
    return;
  }

  const arr = AnswerReveal._util?.arr || ((x) => (typeof x === 'function' ? x() : x));

  // EXTRAER TEXTO robusto para TAB:
  // - r._data() puede ser Array u Object
  // - content puede ser string o fn
  // - a veces viene como contents (plural) o dentro de contents[0].content
  const extractText = (r) => {
    // 1) _data()
    try {
      if (r?._data && typeof r._data === 'function') {
        const d = r._data();

        // Caso A: array de objetos [{content, ...}]
        if (Array.isArray(d) && d[0]) {
          const c = d[0].content ?? d[0].contents;
          if (c !== undefined) return (typeof c === 'function') ? c() : c;

          // Caso A2: contents es array
          if (Array.isArray(d[0].contents) && d[0].contents[0]) {
            const c2 = d[0].contents[0].content ?? d[0].contents[0].text;
            if (c2 !== undefined) return (typeof c2 === 'function') ? c2() : c2;
          }
        }

        // Caso B: objeto {content, type}
        if (d && typeof d === 'object' && !Array.isArray(d)) {
          const c = d.content ?? d.contents;
          if (c !== undefined) return (typeof c === 'function') ? c() : c;

          // Caso B2: contents array
          if (Array.isArray(d.contents) && d.contents[0]) {
            const c2 = d.contents[0].content ?? d.contents[0].text;
            if (c2 !== undefined) return (typeof c2 === 'function') ? c2() : c2;
          }
        }
      }
    } catch (e) {}

    // 2) fallbacks comunes fuera de _data
    for (const k of ['content', 'text', 'label', 'value', 'title', 'name']) {
      try {
        if (r?.[k] !== undefined) return (typeof r[k] === 'function') ? r[k]() : r[k];
      } catch (e) {}
    }

    return '';
  };

  const isCorrect = (r) => {
    try {
      const c = (typeof r?.correct === 'function') ? r.correct() : r?.correct;
      return c === true || c === 1;
    } catch (e) {
      return false;
    }
  };

  AnswerReveal.register('TAB', {
    getCorrect(ex) {
      const qs = arr(ex?.questions) || [];
      const items = [];

      qs.forEach((q, qi) => {
        const rs = arr(q?.responses) || [];
        rs.forEach((r, ri) => {
          if (!isCorrect(r)) return;
          items.push({ q: qi, r: ri, correct: extractText(r) });
        });
      });

      // Diagnóstico opcional si hay correctas sin texto
      const missing = items.filter(x => !x.correct);
      if (missing.length) {
        console.warn('[TAB] Correctas sin texto detectadas:', missing);
        try {
          const m = missing[0];
          const q = qs[m.q];
          const rs = arr(q.responses) || [];
          const r = rs[m.r];
          const d = r?._data?.();
          console.log('[TAB] Ejemplo _data() de una correcta sin texto:', d);
        } catch (e) {}
      }

      return items;
    }
  });

  console.log('[AnswerReveal] handler TAB loaded (v2 robust content)');
})();
