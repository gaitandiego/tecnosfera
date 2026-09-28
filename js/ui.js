// Funciones de interfaz que se repiten en varias páginas

// Arma el HTML de una tarjeta de noticia
function createCard(article) {
  const label = getCategoryLabel(article.category).toUpperCase();
  const active = isFavorite(article.id) ? 'is-active' : '';

  return `
    <article class="card">
      <a class="card__media" href="article.html?id=${article.id}">
        <img class="card__img" src="${article.image}" alt="${article.title}">
      </a>
      <div class="card__body">
        <span class="card__cat">${label}</span>
        <h3 class="card__title">${article.title}</h3>
        <p class="card__text">${article.summary}</p>
        <div class="card__foot">
          <a href="article.html?id=${article.id}" class="btn btn--dark btn--sm">Ver más</a>
          <button type="button" class="fav-toggle ${active}" data-id="${article.id}"><i class="fa-solid fa-heart"></i></button>
        </div>
      </div>
    </article>
  `;
}

// Pinta las tarjetas dentro de un contenedor y activa el botón de favoritos
function renderCards(container, articles) {
  container.innerHTML = articles.map(createCard).join('');

  const buttons = container.querySelectorAll('.fav-toggle');

  buttons.forEach(button => {
    button.addEventListener('click', () => {
      const id = Number(button.dataset.id);
      const added = toggleFavorite(id);

      button.classList.toggle('is-active', added);
      updateFavoritesCounter();
      showToast(added ? 'Noticia guardada en favoritos' : 'Noticia retirada de favoritos');
    });
  });
}

// Actualiza el número que aparece al lado de Favoritos en el menú
function updateFavoritesCounter() {
  const total = getFavorites().length;
  const counters = document.querySelectorAll('.nav-counter');

  counters.forEach(counter => {
    counter.textContent = total > 0 ? ` (${total})` : '';
  });
}

// Muestra un aviso pequeño en la parte inferior de la pantalla
function showToast(text) {
  let toast = document.getElementById('toast');

  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'toast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }

  toast.textContent = text;
  toast.classList.add('is-visible');

  setTimeout(() => toast.classList.remove('is-visible'), 2200);
}

// Muestra un mensaje cuando no hay resultados o algo falló
function showMessage(container, title, text) {
  container.innerHTML = `
    <div class="empty-state">
      <h3>${title}</h3>
      <p>${text}</p>
    </div>
  `;
}

// Lee un parámetro de la URL, por ejemplo el id en article.html?id=2
function getParam(name) {
  const params = new URLSearchParams(window.location.search);
  return params.get(name);
}

// El contador de favoritos se actualiza al abrir cualquier página
document.addEventListener('DOMContentLoaded', updateFavoritesCounter);
