# Tecnosfera

Portal de noticias de tecnología. Prototipo hecho con HTML, CSS y JavaScript para el módulo de Desarrollo de Front-end del Politécnico Grancolombiano. Los iconos son de Font Awesome y se cargan por CDN, así que hace falta internet para verlos.

Diego Fernando Gaitán, Ximena Rangel Urrego y Andrés Camilo Tinoco.

## Cómo abrirlo

Las noticias se cargan desde `data/news.json` con `fetch()`, así que hay que levantar un servidor local. Con VS Code es más rápido usar la extensión Live Server (clic derecho sobre `index.html` > Open with Live Server). Si no, desde la carpeta del proyecto:

    python -m http.server 8000

y luego entrar a http://localhost:8000.

Si se abre con doble clic no funciona: el navegador bloquea la lectura del JSON y el sitio muestra un aviso pidiendo usar un servidor.

## Páginas

- `index.html` — inicio con la noticia de portada y las destacadas
- `news.html` — listado completo, con filtros por categoría, buscador y paginación
- `article.html` — detalle de una noticia, recibe el id por la URL (`article.html?id=2`)
- `favorites.html` — noticias que el usuario guardó
- `contact.html` — formulario con validaciones
- `login.html` y `admin.html` — acceso y gestión de noticias del administrador

El JavaScript está separado por página en la carpeta `js/`. `data.js` se encarga de traer las noticias y de guardar todo en el navegador, y `ui.js` tiene lo que se repite en varias páginas (las tarjetas, el contador de favoritos, los avisos).

Los archivos y las funciones están en inglés y los textos que ve el usuario en español, igual que en la versión de Angular del proyecto.

## Para entrar como administrador

Usuario `admin@tecnosfera.co`, contraseña `admin123`. Sin iniciar sesión, `admin.html` redirige al login.

## Datos guardados

Los favoritos, las noticias que se crean o eliminan desde la gestión y los mensajes del formulario quedan en el `localStorage` con el prefijo `tecnosfera:`. La sesión del administrador va en `sessionStorage`, así que se cierra al cerrar la pestaña.

Si se quiere volver al estado inicial basta con borrar los datos del sitio desde las herramientas de desarrollo del navegador.
