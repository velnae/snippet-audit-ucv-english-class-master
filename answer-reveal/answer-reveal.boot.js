/* =========================
 * File: answer-reveal.boot.js
 * ========================= */
(() => {
  window.AnswerReveal = window.AnswerReveal || {};

  const ready =
    typeof AnswerReveal.register === 'function' &&
    typeof AnswerReveal.logCorrect === 'function';

  if (!ready) {
    console.warn('[AnswerReveal] boot: faltan registry/core. Ejecuta primero answer-reveal.registry.js y answer-reveal.core.js');
    return;
  }

  console.log('[AnswerReveal] ready ✅');
  console.log('Comando: AnswerReveal.logCorrect()');
  console.log('Handlers registrados:', AnswerReveal.listHandlers());

  // Atajo opcional
  window.logCorrectAnswers = () => AnswerReveal.logCorrect();
})();
