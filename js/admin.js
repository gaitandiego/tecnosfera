// Gestión de noticias: crear y eliminar

let adminArticles = [];
let articleToDelete = null;

document.addEventListener('DOMContentLoaded', () => {
  const session = getSession();

  // Si no hay sesión activa no se puede entrar a esta página
  if (!session) {
    window.location.href = 'login.html';
    return;
  }

  document.getElementById('current-user').textContent = session;

  document.getElementById('logout-button').addEventListener('click', () => {
    logout();
    window.location.href = 'index.html';
  });

  document.getElementById('article-form').addEventListener('submit', event => {
    event.preventDefault();
    saveNewArticle(session);
  });

  loadTable();
});

function loadTable() {
  const table = document.getElementById('articles-table');

  loadNews()
    .then(articles => {
      adminArticles = articles;
      fillCategorySelect();
      showTable();
    })
    .catch(() => {
      table.innerHTML = '<tr><td colspan="3">No se pudieron cargar las noticias.</td></tr>';
    });
}

// Llena el select del formulario con las categorías del JSON
function fillCategorySelect() {
  const select = document.getElementById('category');

  if (select.options.length === 0) {
    select.innerHTML = categories
      .map(item => `<option value="${item.value}">${item.label}</option>`)
      .join('');
  }
}

function showTable() {
  const table = document.getElementById('articles-table');

  table.innerHTML = adminArticles.map(article => `
    <tr>
      <td>${article.title}</td>
      <td class="col-cat">${getCategoryLabel(article.category)}</td>
      <td class="col-action">
        <button type="button" class="btn btn--accent-line btn--sm" data-id="${article.id}"><i class="fa-solid fa-trash"></i> Eliminar</button>
      </td>
    </tr>
  `).join('');

  table.querySelectorAll('button[data-id]').forEach(button => {
    button.addEventListener('click', () => askBeforeDelete(Number(button.dataset.id)));
  });
}

// Antes de borrar pedimos confirmación porque no se puede deshacer
function askBeforeDelete(id) {
  const article = adminArticles.find(item => item.id === id);
  const alert = document.getElementById('delete-confirm');

  articleToDelete = id;

  alert.innerHTML = `
    <div>
      <strong>¿Eliminar "${article.title}"?</strong>
      <em>Esta acción no se puede deshacer.</em>
    </div>
    <div class="alert__actions">
      <button type="button" class="btn btn--ghost btn--sm" id="cancel-delete">Cancelar</button>
      <button type="button" class="btn btn--primary btn--sm" id="confirm-delete"><i class="fa-solid fa-trash"></i> Sí, eliminar</button>
    </div>
  `;

  alert.hidden = false;

  document.getElementById('cancel-delete').addEventListener('click', () => {
    articleToDelete = null;
    alert.hidden = true;
  });

  document.getElementById('confirm-delete').addEventListener('click', () => {
    deleteArticle(articleToDelete);
    articleToDelete = null;
    alert.hidden = true;

    updateFavoritesCounter();
    showToast('Noticia eliminada');
    loadTable();
  });
}

function saveNewArticle(session) {
  const title = document.getElementById('title');
  const summary = document.getElementById('summary');
  const content = document.getElementById('content');

  document.getElementById('article-created').hidden = true;

  // Los tres campos de texto son obligatorios
  let valid = true;

  [title, summary, content].forEach(field => {
    const empty = field.value.trim() === '';

    field.classList.toggle('is-invalid', empty);

    if (empty) {
      valid = false;
    }
  });

  if (!valid) {
    showToast('Completa los campos obligatorios');
    return;
  }

  createArticle({
    title: title.value.trim(),
    category: document.getElementById('category').value,
    image: document.getElementById('image').value.trim() || 'img/news-01.svg',
    summary: summary.value.trim(),
    content: content.value.trim(),
    author: session
  });

  document.getElementById('article-form').reset();
  document.getElementById('article-created').hidden = false;

  showToast('Noticia creada correctamente');
  loadTable();
}
