/* =========================
 * File: answer-reveal.core.js
 * ========================= */
(() => {
  window.AnswerReveal = window.AnswerReveal || {};

  // ---------- Helpers ----------
  const arr = (x) => (typeof x === 'function' ? x() : x);

  const isCorrect = (r) => {
    try {
      const c = (typeof r?.correct === 'function') ? r.correct() : r?.correct;
      return c === true || c === 1;
    } catch (e) {
      return false;
    }
  };

  const content = (obj) => {
    try {
      if (obj?._data && typeof obj._data === 'function') {
        const d = obj._data();
        if (d?.[0]?.content !== undefined) {
          return (typeof d[0].content === 'function') ? d[0].content() : d[0].content;
        }
      }
    } catch (e) {}
    for (const k of ['text', 'label', 'value', 'title', 'name']) {
      try {
        if (obj?.[k] !== undefined) {
          return (typeof obj[k] === 'function') ? obj[k]() : obj[k];
        }
      } catch (e) {}
    }
    return '';
  };

  // ---------- API ----------
  AnswerReveal.getCurrentExercise = function getCurrentExercise(vm = window.viewModel) {
    const lab = vm?.labs?.()?.[0];
    if (!lab) throw new Error('No se encontró viewModel.labs()[0]');
    const idx = (typeof lab.selected_exercise === 'function')
      ? lab.selected_exercise()
      : lab.selected_exercise;
    const ex = lab.exercises?.()?.[idx];
    if (!ex) throw new Error('No se encontró el ejercicio actual');
    return ex;
  };

  /**
   * Fallback genérico por capacidades
   */
  AnswerReveal.fallbackGetCorrect = function fallbackGetCorrect(ex) {
    const qs = arr(ex?.questions) || [];
    const items = [];

    // questions -> responses
    if (qs.length && (qs[0]?.responses || typeof qs[0]?.responses === 'function')) {
      qs.forEach((q, qi) => {
        const rs = arr(q.responses) || [];
        rs.forEach((r, ri) => {
          if (!isCorrect(r)) return;
          items.push({ q: qi, r: ri, correct: content(r) });
        });
      });
      return items;
    }

    // plano
    if (
      qs.length &&
      typeof qs[0]?.correct === 'function' &&
      typeof qs[0]?.selected === 'function' &&
      !qs[0]?.responses
    ) {
      qs.forEach((r, i) => {
        if (!isCorrect(r)) return;
        items.push({ i, correct: content(r) });
      });
      return items;
    }

    return items;
  };

  /**
   * Método principal
   */
  AnswerReveal.logCorrect = function logCorrect(vm = window.viewModel) {
    const ex = AnswerReveal.getCurrentExercise(vm);
    const type = (typeof ex.type === 'function') ? ex.type() : ex.type;

    const handler = AnswerReveal.getHandler?.(type);

    let items = [];
    let via = 'fallback';

    if (handler) {
      items = handler.getCorrect(ex) || [];
      via = `handler:${type}`;
    } else {
      items = AnswerReveal.fallbackGetCorrect(ex);
      via = 'fallback:capabilities';
    }

    // ---------- Console output ----------
    console.groupCollapsed(
      `%cAnswerReveal.logCorrect`,
      'color:#0b5ed7;font-weight:bold'
    );
    console.log('Type:', type);
    console.log('Resolver:', via);
    console.log('Items:', items.length);
    console.table(items);
    console.groupEnd();

    return { type, via, items };
  };

  // ---------- Exponer helpers ----------
  AnswerReveal._util = AnswerReveal._util || {};
  AnswerReveal._util.arr = arr;
  AnswerReveal._util.isCorrect = isCorrect;
  AnswerReveal._util.content = content;

  console.log('[AnswerReveal] core loaded (with handler logging)');
})();
