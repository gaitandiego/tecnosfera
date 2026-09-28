// Vista de detalle de una noticia

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('article');
  const id = Number(getParam('id'));

  if (!id) {
    showMessage(container, 'Noticia no indicada', 'No se indicó cuál noticia se quiere consultar.');
    return;
  }

  loadNewsById(id)
    .then(article => {
      if (!article) {
        showMessage(container, 'Noticia no encontrada', 'La noticia solicitada no existe o fue eliminada.');
        return;
      }
      showArticle(article, container);
    })
    .catch(() => {
      showMessage(container, 'No se pudo cargar la noticia', 'Abre el sitio con Live Server o con un servidor local.');
    });
});

function showArticle(article, container) {
  document.title = `${article.title} — Tecnosfera`;

  // El cuerpo de la noticia viene como una lista de bloques de texto
  const body = article.content
    .map(block => (block.type === 'h3' ? `<h3>${block.text}</h3>` : `<p>${block.text}</p>`))
    .join('');

  const saved = isFavorite(article.id);

  container.innerHTML = `
    <a href="news.html" class="article__back"><i class="fa-solid fa-arrow-left"></i> Volver a noticias</a>
    <span class="article__meta">${getCategoryLabel(article.category).toUpperCase()} · ${formatDate(article.date)}</span>
    <h1 class="article__title">${article.title}</h1>
    <p class="article__by">Por ${article.author} · ${article.readingTime} min de lectura</p>
    <figure class="article__figure">
      <img class="article__img" src="${article.image}" alt="${article.title}">
    </figure>
    <p class="article__caption">${article.caption}</p>
    <p class="article__lead">${article.summary}</p>
    <div class="article__body">${body}</div>
    <div class="article__actions">
      <button type="button" class="btn ${saved ? 'btn--dark' : 'btn--primary'}" id="favorite-button">
        <i class="fa-solid fa-heart"></i> ${saved ? 'Quitar de favoritos' : 'Agregar a favoritos'}
      </button>
      <button type="button" class="btn btn--ghost" id="share-button"><i class="fa-solid fa-share-nodes"></i> Compartir</button>
    </div>
  `;

  const favoriteButton = document.getElementById('favorite-button');

  favoriteButton.addEventListener('click', () => {
    const added = toggleFavorite(article.id);

    favoriteButton.innerHTML = `<i class="fa-solid fa-heart"></i> ${added ? 'Quitar de favoritos' : 'Agregar a favoritos'}`;
    favoriteButton.classList.toggle('btn--dark', added);
    favoriteButton.classList.toggle('btn--primary', !added);

    updateFavoritesCounter();
    showToast(added ? 'Noticia guardada en favoritos' : 'Noticia retirada de favoritos');
  });

  // Copia el enlace de la noticia para poder compartirlo
  document.getElementById('share-button').addEventListener('click', () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('Enlace copiado al portapapeles');
  });
}
