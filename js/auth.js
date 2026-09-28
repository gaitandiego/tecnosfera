// Inicio de sesión del administrador

// Usuario de prueba del prototipo
const ADMIN_USER = 'admin@tecnosfera.co';
const ADMIN_PASSWORD = 'admin123';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const username = document.getElementById('username');
  const password = document.getElementById('password');
  const error = document.getElementById('login-error');
  const toggle = document.getElementById('toggle-password');

  // Botón para ver u ocultar la contraseña
  toggle.addEventListener('click', () => {
    const hidden = password.type === 'password';

    password.type = hidden ? 'text' : 'password';
    toggle.textContent = hidden ? 'Ocultar' : 'Mostrar';
  });

  form.addEventListener('submit', event => {
    event.preventDefault();

    if (username.value.trim() === '' || password.value === '') {
      showLoginError('Completa el usuario y la contraseña');
      return;
    }

    if (username.value.trim().toLowerCase() !== ADMIN_USER || password.value !== ADMIN_PASSWORD) {
      showLoginError('Usuario o contraseña incorrectos');
      password.value = '';
      return;
    }

    // Guardamos la sesión y pasamos a la página de gestión
    login(ADMIN_USER);
    window.location.href = 'admin.html';
  });

  function showLoginError(text) {
    error.textContent = text;
    error.hidden = false;
    username.classList.add('is-invalid');
    password.classList.add('is-invalid');
  }

  // Al escribir de nuevo se quita el mensaje de error
  [username, password].forEach(field => {
    field.addEventListener('input', () => {
      error.hidden = true;
      username.classList.remove('is-invalid');
      password.classList.remove('is-invalid');
    });
  });
});
