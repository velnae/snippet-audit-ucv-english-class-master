# snippet-audit-ucv-english-class-master
# Answer Reveal – Chrome Debug Snippets

Herramienta de auditoría en JavaScript para inspeccionar respuestas correctas de ejercicios interactivos (TYP, SFL, MMM, DFL, EXPLORE_*, etc.) directamente desde Chrome DevTools, sin modificar el código del sistema en producción.

---

## Uso rápido (Chrome)

### 1. Abrir Chrome DevTools

* Presiona F12
* Ve a Sources → Snippets

### 2. Crear el loader

Crea un snippet llamado:

answer-reveal.loader.js

Pega en él el código del loader incluido en este repositorio.

### 3. Ejecutar el loader

Ejecuta el snippet.

Cuando se solicite el BASE URL, ingresa exactamente:

[https://cdn.jsdelivr.net/gh/velnae/snippet-audit-ucv-english-class-master@main](https://cdn.jsdelivr.net/gh/velnae/snippet-audit-ucv-english-class-master@main)

El valor se guarda automáticamente en localStorage y no se volverá a pedir.

---

## Uso diario

Con un ejercicio visible en pantalla, ejecuta en la consola:

AnswerReveal.logCorrect()

Resultado:

* Se imprime en consola una tabla con las respuestas correctas
* No se modifica la interfaz del usuario
* No se envía información al servidor

---

## Estructura del proyecto

answer-reveal/
answer-reveal.registry.js    Registro de handlers
answer-reveal.core.js        Núcleo + fallback por capacidades
answer-reveal.boot.js        Inicialización y verificación
handlers/
answer-reveal.handler.TYP.js
answer-reveal.handler.EXPLORE_DFL.js
answer-reveal.handler.SFL.js
answer-reveal.handler.MMM.js
...

Cada tipo de ejercicio tiene su propio handler, lo que permite que el sistema sea escalable sin crecer el código central.

---

## Agregar nuevos tipos de preguntas

Para soportar un nuevo tipo:

1. Crear un nuevo archivo en la carpeta handlers/
2. Registrar el tipo usando:

AnswerReveal.register('TIPO', {
getCorrect(ex) {
// lógica específica del tipo
}
});

No es necesario modificar el core ni el loader.

---

## Advertencias

* Uso exclusivo para auditoría y depuración
* No debe emplearse para evaluación real de usuarios
* Funciona solo si el objeto viewModel está disponible globalmente en la página

---

## Licencia

Uso interno y educativo.
