/* =========================
 * File: answer-reveal.registry.js
 * ========================= */
(() => {
  window.AnswerReveal = window.AnswerReveal || {};

  // Map de handlers por tipo (TYP, SFL, etc.)
  AnswerReveal.handlers = AnswerReveal.handlers || Object.create(null);

  /**
   * Registra un handler para un type.
   * handler debe exponer: getCorrect(ex) => Array<object>
   */
  AnswerReveal.register = function register(type, handler) {
    if (!type || typeof type !== 'string') throw new Error('register(type, handler): type inválido');
    if (!handler || typeof handler.getCorrect !== 'function') {
      throw new Error(`register(${type}): handler debe exponer getCorrect(ex)`);
    }
    AnswerReveal.handlers[type] = handler;
  };

  AnswerReveal.getHandler = function getHandler(type) {
    return AnswerReveal.handlers[type] || null;
  };

  AnswerReveal.listHandlers = function listHandlers() {
    return Object.keys(AnswerReveal.handlers).sort();
  };

  console.log('[AnswerReveal] registry loaded');
})();

