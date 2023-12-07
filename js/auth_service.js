//funciones para la autenticacion y autorizacion
const urlApiAuth = 'http://localhost:8082/auth'; //colocar la url con el puerto
const headersAuth = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

async function login() {
  let myForm = document.getElementById('myForm');
  let formData = new FormData(myForm);
  let jsonData = {};
  for (let [k, v] of formData) {
    //convertimos los datos a json
    jsonData[k] = v;
  }
  let settings = {
    method: 'POST',
    headers: headersAuth,
    body: JSON.stringify(jsonData),
  };
  const request = await fetch(urlApiAuth + '/login', settings);
  if (request.ok) {
    const respuesta = await request.json();
    localStorage.token = respuesta.token;
    location.href = '../html/dashboard.html';
  } else {
    const data = await request.json(); // Espera a que la promesa se resuelva
    console.log(data); // Aquí puedes manejar la data de la respuesta
    const dataArray = Object.values(data);
    const ErrorMessage = dataArray[0];

    alertas('Error: <br>' + ErrorMessage, 2);
  }
}
let formDataCache = {};

async function registrarUsuario() {
  let myForm = document.getElementById('registerForm');
  let formData = new FormData(myForm);
  let jsonData = {};
  for (let [k, v] of formData) {
    //convertimos los datos a json
    jsonData[k] = v;
    formDataCache[k] = v;
  }
  const request = await fetch(urlApiAuth + '/register', {
    method: 'POST',
    headers: headersAuth,
    body: JSON.stringify(jsonData),
  });
  if (request.ok) {
    alertas('User registered', 1);
    formDataCache = {};
  } else {
    const data = await request.json(); // Espera a que la promesa se resuelva
    const dataArray = Object.values(data);
    let dataResponse = '';
    for (let v of dataArray) {
      dataResponse += '<li>' + v + '</li>';
    }

    alertas('Error: <br>' + dataResponse, 2);
  }
  document.getElementById('contentModal').innerHTML = '';
  let myModalEl = document.getElementById('modalUsuario');
  let modal = bootstrap.Modal.getInstance(myModalEl); // Returns a Bootstrap modal instance
  modal.hide();
}

function registerForm() {
  cadena = `
            <form action="" method="post" id="registerForm">
                <input type="hidden" name="id" id="id">
                <label for="firstName" class="form-label">Nombre</label>
                <input type="text" class="form-control" name="firstName" id="firstName" required> <br>
                <label for="lastName"  class="form-label">Apellido</label>
                <input type="text" class="form-control" name="lastName" id="lastName" required> <br>
                <label for="document"  class="form-label">Documento</label>
                <input type="text" class="form-control" name="document" id="document" required> <br>
                <label for="email" class="form-label">Email</label>
                <input type="email" class="form-control" name="email" id="email" required> <br>
                <label for="password" class="form-label">Password</label>
                <input type="password" class="form-control" id="password" name="password" required> <br>
                <button type="button" class="btn btn-outline-info" onclick="registrarUsuario()">Registrar</button>
            </form>`;
  document.getElementById('contentModal').innerHTML = cadena;
  let myModal = new bootstrap.Modal(document.getElementById('modalUsuario'));
  myModal.toggle();

  for (let key in formDataCache) {
    let input = document.getElementById(key);
    if (input) {
      input.value = formDataCache[key];
    }
  }
}

function salir() {
  localStorage.clear();
  location.href = '../index.html';
}

function validaToken() {
  if (localStorage.token == undefined) {
    salir();
  }
}
