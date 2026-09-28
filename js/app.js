// Página de inicio y listado de noticias

const SERVER_MESSAGE = 'Abre el sitio con Live Server o con un servidor local para que se pueda leer el archivo JSON.';

document.addEventListener('DOMContentLoaded', () => {
  const cover = document.getElementById('cover');
  const featured = document.getElementById('featured');
  const list = document.getElementById('list');

  // Este archivo se usa en index.html y en news.html
  if (!cover && !list) {
    return;
  }

  loadNews()
    .then(articles => {
      if (cover) {
        showHome(articles, cover, featured);
      }
      if (list) {
        showList(articles, list);
      }
    })
    .catch(() => {
      showMessage(list || featured, 'No se pudieron cargar las noticias', SERVER_MESSAGE);
    });
});

// ----- Inicio -----

function showHome(articles, cover, featured) {
  // La noticia de portada es la que tiene cover en true
  const main = articles.find(article => article.cover) || articles[0];

  cover.innerHTML = `
    <div class="hero__text">
      <span class="hero__meta">PORTADA · ${formatDate(main.date)}</span>
      <h1 class="hero__title">${main.title}</h1>
      <p class="hero__lead">${main.summary}</p>
      <a href="article.html?id=${main.id}" class="btn btn--primary">Leer noticia</a>
    </div>
    <a class="hero__media" href="article.html?id=${main.id}">
      <img class="hero__img" src="${main.image}" alt="${main.title}">
    </a>
  `;

  // Las destacadas son las marcadas con featured, sin repetir la de portada
  const highlights = articles.filter(article => article.featured && article.id !== main.id);
  renderCards(featured, highlights.slice(0, 3));
}

// ----- Listado -----

function showList(articles, list) {
  const PAGE_SIZE = 6;

  const counter = document.getElementById('counter');
  const filters = document.getElementById('filters');
  const search = document.getElementById('search');
  const pagination = document.getElementById('pagination');

  let category = 'all';
  let term = '';
  let page = 1;

  // Los botones de categoría se arman con las categorías del JSON
  filters.innerHTML = `<button type="button" class="chip" data-category="all">Todas</button>` +
    categories.map(item => `<button type="button" class="chip" data-category="${item.value}">${item.label}</button>`).join('');

  filters.addEventListener('click', event => {
    if (!event.target.classList.contains('chip')) {
      return;
    }
    category = event.target.dataset.category;
    page = 1;
    render();
  });

  search.addEventListener('input', () => {
    term = search.value.trim().toLowerCase();
    page = 1;
    render();
  });

  // Aplica el filtro de categoría y el texto del buscador
  function filterArticles() {
    return articles.filter(article => {
      const sameCategory = category === 'all' || article.category === category;
      const text = (article.title + ' ' + article.summary).toLowerCase();
      return sameCategory && text.includes(term);
    });
  }

  function render() {
    const results = filterArticles();
    const totalPages = Math.ceil(results.length / PAGE_SIZE) || 1;

    if (page > totalPages) {
      page = totalPages;
    }

    // Marca el botón de la categoría seleccionada
    filters.querySelectorAll('.chip').forEach(chip => {
      chip.classList.toggle('is-active', chip.dataset.category === category);
    });

    counter.textContent = results.length === 1 ? '1 resultado' : `${results.length} resultados`;

    if (results.length === 0) {
      showMessage(list, 'Sin resultados', 'No encontramos noticias que coincidan con la búsqueda.');
    } else {
      const start = (page - 1) * PAGE_SIZE;
      renderCards(list, results.slice(start, start + PAGE_SIZE));
    }

    renderPagination(totalPages);
  }

  function renderPagination(totalPages) {
    if (totalPages <= 1) {
      pagination.innerHTML = '';
      return;
    }

    let html = `<button type="button" class="btn btn--ghost btn--sm" data-page="prev"><i class="fa-solid fa-chevron-left"></i> Anterior</button>`;

    for (let i = 1; i <= totalPages; i++) {
      const style = i === page ? 'btn--dark' : 'btn--ghost';
      html += `<button type="button" class="btn btn--sm ${style}" data-page="${i}">${i}</button>`;
    }

    html += `<button type="button" class="btn btn--ghost btn--sm" data-page="next">Siguiente <i class="fa-solid fa-chevron-right"></i></button>`;
    pagination.innerHTML = html;

    pagination.querySelectorAll('button').forEach(button => {
      button.addEventListener('click', () => {
        const value = button.dataset.page;

        if (value === 'prev' && page > 1) {
          page = page - 1;
        } else if (value === 'next' && page < totalPages) {
          page = page + 1;
        } else if (value !== 'prev' && value !== 'next') {
          page = Number(value);
        }

        render();
        window.scrollTo(0, 0);
      });
    });
  }

  render();
}
