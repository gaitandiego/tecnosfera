// Manejo de los datos del portal: carga del JSON y almacenamiento en el navegador

const NEWS_URL = 'data/news.json';

// Claves que usamos en el almacenamiento del navegador
const KEY_FAVORITES = 'tecnosfera:favorites';
const KEY_CREATED = 'tecnosfera:created';
const KEY_REMOVED = 'tecnosfera:removed';
const KEY_MESSAGES = 'tecnosfera:messages';
const KEY_SESSION = 'tecnosfera:session';

// Guardamos las categorías aquí cuando se carga el JSON
let categories = [];

// Lee un valor del localStorage y lo convierte de texto a objeto
function getFromStorage(key, fallback) {
  const value = localStorage.getItem(key);
  return value ? JSON.parse(value) : fallback;
}

// Guarda un valor en el localStorage convirtiéndolo a texto
function saveToStorage(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

// Trae las noticias del archivo JSON y les suma las creadas por el administrador
function loadNews() {
  return fetch(NEWS_URL)
    .then(response => response.json())
    .then(data => {
      categories = data.categories;

      const created = getFromStorage(KEY_CREATED, []);
      const removed = getFromStorage(KEY_REMOVED, []);

      // Las creadas van primero y las eliminadas se descartan
      return created.concat(data.articles).filter(article => !removed.includes(article.id));
    });
}

// Busca una noticia por su id
function loadNewsById(id) {
  return loadNews().then(articles => articles.find(article => article.id === id));
}

// Devuelve el nombre visible de una categoría (networks -> Redes)
function getCategoryLabel(value) {
  const category = categories.find(item => item.value === value);
  return category ? category.label : value;
}

// Convierte 2026-09-12 en 12 SEP 2026
function formatDate(date) {
  const months = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC'];
  const parts = date.split('-');
  return `${parts[2]} ${months[Number(parts[1]) - 1]} ${parts[0]}`;
}

// ----- Favoritos -----

function getFavorites() {
  return getFromStorage(KEY_FAVORITES, []);
}

function isFavorite(id) {
  return getFavorites().includes(id);
}

// Agrega la noticia si no estaba y la quita si ya estaba
function toggleFavorite(id) {
  const favorites = getFavorites();

  if (favorites.includes(id)) {
    saveToStorage(KEY_FAVORITES, favorites.filter(item => item !== id));
    return false;
  }

  favorites.push(id);
  saveToStorage(KEY_FAVORITES, favorites);
  return true;
}

function removeFavorite(id) {
  saveToStorage(KEY_FAVORITES, getFavorites().filter(item => item !== id));
}

function clearFavorites() {
  saveToStorage(KEY_FAVORITES, []);
}

// ----- Crear y eliminar noticias -----

// Las noticias nuevas usan ids desde 1001 para no chocar con las del JSON
function getNextId() {
  const created = getFromStorage(KEY_CREATED, []);
  let lastId = 1000;

  created.forEach(article => {
    if (article.id > lastId) {
      lastId = article.id;
    }
  });

  return lastId + 1;
}

function createArticle(form) {
  const created = getFromStorage(KEY_CREATED, []);
  const today = new Date();

  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');

  const article = {
    id: getNextId(),
    title: form.title,
    category: form.category,
    date: `${today.getFullYear()}-${month}-${day}`,
    author: form.author,
    readingTime: 4,
    image: form.image,
    caption: '',
    summary: form.summary,
    cover: false,
    featured: false,
    content: [{ type: 'p', text: form.content }]
  };

  created.unshift(article);
  saveToStorage(KEY_CREATED, created);
}

// Si la noticia fue creada por el administrador se borra de la lista;
// si viene del JSON se guarda su id como eliminada
function deleteArticle(id) {
  const created = getFromStorage(KEY_CREATED, []);

  if (created.some(article => article.id === id)) {
    saveToStorage(KEY_CREATED, created.filter(article => article.id !== id));
  } else {
    const removed = getFromStorage(KEY_REMOVED, []);
    removed.push(id);
    saveToStorage(KEY_REMOVED, removed);
  }

  removeFavorite(id);
}

// ----- Sesión del administrador -----

function login(username) {
  sessionStorage.setItem(KEY_SESSION, username);
}

function getSession() {
  return sessionStorage.getItem(KEY_SESSION);
}

function logout() {
  sessionStorage.removeItem(KEY_SESSION);
}

// ----- Mensajes del formulario de contacto -----

function saveMessage(message) {
  const messages = getFromStorage(KEY_MESSAGES, []);
  messages.unshift(message);
  saveToStorage(KEY_MESSAGES, messages);
}
