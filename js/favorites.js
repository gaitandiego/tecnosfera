// Página con las noticias que el usuario guardó

let allArticles = [];

document.addEventListener('DOMContentLoaded', () => {
  const list = document.getElementById('favorites-list');
  const clearButton = document.getElementById('clear-button');

  loadNews()
    .then(articles => {
      allArticles = articles;
      showFavorites();
    })
    .catch(() => {
      showMessage(list, 'No se pudieron cargar las noticias', 'Abre el sitio con Live Server o con un servidor local.');
    });

  clearButton.addEventListener('click', () => {
    if (!confirm('¿Deseas vaciar toda la lista de favoritos?')) {
      return;
    }

    clearFavorites();
    updateFavoritesCounter();
    showToast('Lista de favoritos vaciada');
    showFavorites();
  });
});

function showFavorites() {
  const list = document.getElementById('favorites-list');
  const empty = document.getElementById('favorites-empty');
  const counter = document.getElementById('favorites-counter');
  const clearButton = document.getElementById('clear-button');

  // De todas las noticias dejamos solo las que están en favoritos
  const favorites = getFavorites();
  const saved = allArticles.filter(article => favorites.includes(article.id));

  counter.textContent = saved.length === 1 ? '1 noticia guardada' : `${saved.length} noticias guardadas`;
  clearButton.hidden = saved.length === 0;

  // Si no hay favoritos mostramos el mensaje en lugar de la lista
  if (saved.length === 0) {
    list.innerHTML = '';
    empty.hidden = false;
    return;
  }

  empty.hidden = true;

  list.innerHTML = saved.map(article => `
    <article class="fav-item">
      <img class="fav-item__img" src="${article.image}" alt="${article.title}">
      <div class="fav-item__body">
        <span class="card__cat">${getCategoryLabel(article.category).toUpperCase()}</span>
        <h3>${article.title}</h3>
        <p>${formatDate(article.date)}</p>
      </div>
      <div class="fav-item__actions">
        <a href="article.html?id=${article.id}" class="btn btn--dark btn--sm">Ver noticia</a>
        <button type="button" class="btn btn--accent-line btn--sm" data-id="${article.id}"><i class="fa-solid fa-xmark"></i> Quitar</button>
      </div>
    </article>
  `).join('');

  list.querySelectorAll('button[data-id]').forEach(button => {
    button.addEventListener('click', () => {
      removeFavorite(Number(button.dataset.id));
      updateFavoritesCounter();
      showToast('Noticia retirada de favoritos');
      showFavorites();
    });
  });
}
