/* =========================
 * File: answer-reveal.handler.MMM.js
 * Adaptador MMM basado en tu solución actual (auto-discovery, solo consola)
 * ========================= */
(() => {
  window.AnswerReveal = window.AnswerReveal || {};
  if (typeof AnswerReveal.register !== 'function') {
    console.warn('[AnswerReveal] registry no cargado. Ejecuta primero answer-reveal.registry.js');
    return;
  }

  const arr = AnswerReveal._util?.arr || ((x) => (typeof x === 'function' ? x() : x));
  const content = AnswerReveal._util?.content || ((obj) => {
    try {
      if (obj && obj._data && typeof obj._data === 'function') {
        const d = obj._data();
        if (d && d.length && d[0] && d[0].content) {
          return typeof d[0].content === 'function' ? d[0].content() : d[0].content;
        }
      }
    } catch (e) {}
    for (const k of ['text', 'label', 'value', 'title', 'name']) {
      try { if (obj?.[k] !== undefined) return (typeof obj[k] === 'function') ? obj[k]() : obj[k]; } catch (e) {}
    }
    return '';
  });

  const getVal = (obj, names) => {
    for (const n of names) {
      if (!obj) continue;
      try {
        if (typeof obj[n] === 'function') return obj[n]();
        if (obj[n] !== undefined) return obj[n];
      } catch (e) {}
    }
    return undefined;
  };

  const extractCorrectFromResponses = (container, qIndexLabel) => {
    const rs = arr(container?.responses) || [];
    const rows = [];
    rs.forEach((r, ri) => {
      const c = getVal(r, ['correct']);
      const ok = c === true || c === 1;
      if (!ok) return;
      rows.push({
        q: qIndexLabel,
        r: ri,
        correct: content(r) || getVal(r, ['text', 'label', 'value']) || ''
      });
    });
    return rows;
  };

  const discoverArrays = (ex) => {
    const keys = [
      'pairs', 'targets', 'slots', 'items', 'gaps', 'fields',
      'dragdrop', 'rows', 'cols', 'cells', 'matrix', 'mapping',
      'questions'
    ];
    const out = [];
    keys.forEach((k) => {
      if (typeof ex[k] === 'function' || Array.isArray(ex[k])) {
        const a = arr(ex[k]);
        if (Array.isArray(a) && a.length) out.push({ key: k, arr: a });
      }
    });
    return out;
  };

  /**
   * MMM:
   * 1) Si questions[0] tiene responses -> usar correct() de responses
   * 2) Si no, auto-descubrimiento de estructuras (pairs/targets/slots/...)
   * Retorna SOLO correctas para consola.
   */
  AnswerReveal.register('MMM', {
    getCorrect(ex) {
      // 1) questions con responses
      const qs = arr(ex?.questions) || [];
      if (Array.isArray(qs) && qs.length && (qs[0]?.responses || typeof qs[0]?.responses === 'function')) {
        const rows = [];
        qs.forEach((q, qi) => rows.push(...extractCorrectFromResponses(q, qi)));
        if (rows.length) return rows;
      }

      // 2) auto-discovery (misma lógica que tu función general)
      const discovered = discoverArrays(ex);
      const rows = [];

      for (const d of discovered) {
        const a0 = d.arr[0] || {};
        const keys = Object.keys(a0);

        // A) correct_item_id / correct_id / correct_target_id
        if (keys.includes('correct_item_id') || keys.includes('correct_id') || keys.includes('correct_target_id')) {
          d.arr.forEach((it, i) => {
            const correct = getVal(it, ['correct_item_id', 'correct_id', 'correct_target_id']);
            rows.push({ struct: d.key, i, correct });
          });
          continue;
        }

        // B) correct directo (no boolean)
        if (keys.includes('correct')) {
          d.arr.forEach((it, i) => {
            const correct = getVal(it, ['correct']);
            if (typeof correct === 'boolean') return;
            rows.push({ struct: d.key, i, correct });
          });
          continue;
        }

        // C) left/right (matching)
        if (keys.includes('left') && keys.includes('right')) {
          d.arr.forEach((p, i) => {
            const left  = getVal(p, ['left', 'left_id', 'left_text']) ?? content(p.left) ?? '';
            const right = getVal(p, ['right', 'right_id', 'right_text']) ?? content(p.right) ?? '';
            const cr = getVal(p, ['correct_right', 'correct_right_id', 'correct_right_text']);
            const cl = getVal(p, ['correct_left', 'correct_left_id', 'correct_left_text']);
            rows.push({
              struct: d.key,
              i,
              correct: (cr !== undefined || cl !== undefined)
                ? { correct_left: cl, correct_right: cr }
                : { left, right }
            });
          });
          continue;
        }

        // D) answer/solution/expected
        if (keys.some(k => ['answer', 'solution', 'expected', 'right_answer', 'key'].includes(k))) {
          d.arr.forEach((it, i) => {
            const correct = getVal(it, ['answer', 'solution', 'expected', 'right_answer', 'key']);
            rows.push({ struct: d.key, i, correct });
          });
          continue;
        }

        // E) responses internas
        if (keys.includes('responses') && (a0.responses || typeof a0.responses === 'function')) {
          d.arr.forEach((qLike, i) => rows.push(...extractCorrectFromResponses(qLike, `${d.key}:${i}`)));
          continue;
        }
      }

      return rows;
    }
  });

  console.log('[AnswerReveal] handler MMM loaded');
})();
