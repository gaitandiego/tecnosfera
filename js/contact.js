// Validación del formulario de contacto

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('contact-form');

  form.addEventListener('submit', event => {
    // Evitamos que el formulario recargue la página
    event.preventDefault();
    document.getElementById('confirmation').hidden = true;

    if (!validateForm()) {
      showToast('Revisa los campos marcados en rojo');
      return;
    }

    // Guardamos el mensaje en el navegador porque no hay servidor
    saveMessage({
      name: document.getElementById('name').value.trim(),
      email: document.getElementById('email').value.trim(),
      subject: document.getElementById('subject').value,
      message: document.getElementById('message').value.trim(),
      date: new Date().toISOString()
    });

    form.reset();
    clearErrors();

    document.getElementById('confirmation').hidden = false;
    showToast('Mensaje enviado correctamente');
  });
});

function validateForm() {
  clearErrors();

  const name = document.getElementById('name');
  const email = document.getElementById('email');
  const subject = document.getElementById('subject');
  const message = document.getElementById('message');
  const consent = document.getElementById('consent');

  let valid = true;

  if (name.value.trim().length < 3) {
    showError(name, 'Escribe tu nombre completo');
    valid = false;
  }

  // Revisamos que el correo tenga texto, arroba, dominio y extensión
  const emailPattern = /^[^\s@]+@[^\s@]+\.[a-zA-Z]{2,}$/;

  if (!emailPattern.test(email.value.trim())) {
    showError(email, 'Ingresa un correo electrónico válido');
    valid = false;
  }

  if (subject.value === '') {
    showError(subject, 'Selecciona el asunto de tu mensaje');
    valid = false;
  }

  if (message.value.trim().length < 15) {
    showError(message, 'El mensaje debe tener al menos 15 caracteres');
    valid = false;
  }

  if (!consent.checked) {
    showError(consent, 'Debes aceptar el tratamiento de datos personales');
    valid = false;
  }

  return valid;
}

// Marca el campo en rojo y muestra el texto del error debajo
function showError(field, text) {
  const error = document.getElementById(`error-${field.id}`);

  error.textContent = text;
  error.hidden = false;
  field.classList.add('is-invalid');
}

function clearErrors() {
  document.querySelectorAll('.field__error').forEach(error => {
    error.hidden = true;
  });

  document.querySelectorAll('.is-invalid').forEach(field => {
    field.classList.remove('is-invalid');
  });
}
