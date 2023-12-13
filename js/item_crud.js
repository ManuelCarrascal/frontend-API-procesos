//funciones para operaciones crud
const urlApiItem = 'http://localhost:8082/items';
const urlApiCategory = 'http://localhost:8082/category';
const headersItem = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  Authorization: `Bearer ${localStorage.token}`,
};

function listar() {
  validaToken();
  let settings = {
    method: 'GET',
    headers: headersItem,
  };
  fetch(urlApiItem, settings)
    .then((response) => {
      if (!response.ok) {
        // No lanzar el error, solo devolver un array vacío
        return [];
      }
      return response.json();
    })
    .then(function (items) {
      if (items.length === 0) {
        let listarElement = document.getElementById('listar');
        listarElement.innerHTML =
          '<p id="vacio">No hay productos registrados</p>';
        let vacioElement = document.querySelector('#vacio');
        vacioElement.classList.add('w-100', 'fs-4', 'mt-5');
        return;
      }

      let productos = '';
      for (const producto of items) {
        productos += `
                <tr>
                    <th scope="row">${producto.id}</th>
                    <td class="text-center">${producto.name}</td>
                    <td class="text-center">${producto.description}</td>
                    <td class="text-center">${producto.quantity}</td>
                    <td class="text-center">$${producto.price}</td>
                    <td class="text-center">${producto.provider}</td>
                    <td class="text-center">${producto.status}</td>
                    <td class="text-center">${producto.category.nameCategory}</td>
                    <td>
                    <a href="#" onclick="verModificarProducto('${producto.id}')" class="btn btn-outline-warning">
                    <i class="fa-solid fa-pen-to-square"></i>                    </a>
                    <a href="#" onclick="verProducto('${producto.id}')" class="btn btn-outline-info">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                    <a href="#" onclick="eliminaProducto('${producto.id}')" class="btn btn-outline-danger">
                    <i class="fa-solid fa-trash"></i>
                    </a>
                    </td>
                </tr>`;
      }
      document.getElementById('listar').innerHTML = productos;
    });
}

async function obtenerCategorias() {
  validaToken();
  let settings = {
    method: 'GET',
    headers: headersItem,
  };
  const response = await fetch(urlApiCategory, settings);
  return response.json();
}

async function verModificarProducto(id) {
  validaToken();
  let settings = {
    method: 'GET',
    headers: headersItem,
  };
  const producto = await fetch(urlApiItem + '/' + id, settings).then(
    (producto) => producto.json()
  );
  const categorias = await obtenerCategorias();
  let opcionesCategorias = '';
  for (const categoria of categorias) {
    opcionesCategorias += `<option value="${categoria.category_id}"${
      categoria.category_id === producto.category.category_id ? ' selected' : ''
    }>${categoria.nameCategory}</option>`;
  }
  let cadena = '';
  if (producto) {
    cadena = `
      <div class="p-3 mb-2 bg-light text-dark">
          <h1 class="display-5">Modificar Producto</h1>
      </div>
    
      <form action="" method="post" id="modificar">
          <input type="hidden" name="id" id="id" value="${producto.id}">
          <label for="name" class="form-label">Nombre producto</label>
          <input type="text" class="form-control" name="name" id="name" required value="${producto.name}"> <br>
          <label for="description"  class="form-label">Descripción</label>
          <input type="text" class="form-control" name="description" id="description" required value="${producto.description}"> <br>
          <label for="quantity"  class="form-label">Cantidad</label>
          <input type="text" class="form-control" name="quantity" id="quantity" required value="${producto.quantity}"> <br>
          <label for="price"  class="form-label">Precio</label>
          <input type="text" class="form-control" name="price" id="price" required value="${producto.price}"> <br>
          <label for="status"  class="form-label">Estado</label>
          <input type="text" class="form-control" name="status" id="status" required value="${producto.status}"> <br>
          <label for="provider"  class="form-label">Proveedor</label>
          <input type="text" class="form-control" name="provider" id="provider" required value="${producto.provider}"> <br>
          <label for="category_id" class="form-label">Categoría</label>
          <select class="form-control" name="category_id" id="category_id" required>
            ${opcionesCategorias}
          </select>
          <br>
          <button type="button" class="btn btn-outline-warning" 
              onclick="modificarProducto('${producto.id}')">Modificar
          </button>
      </form>`;
  }
  document.getElementById('contentModal').innerHTML = cadena;
  let myModal = new bootstrap.Modal(document.getElementById('modalProducto'));
  myModal.toggle();
}

async function modificarProducto(id) {
  validaToken();
  let myForm = document.getElementById('modificar');
  let formData = new FormData(myForm);
  let jsonData = {};
  for (let [k, v] of formData) {
    jsonData[k] = v;
  }
  // Obtén el id de la categoría del formulario
  let categoryId = jsonData.category_id;
  // Agrega el id de la categoría a jsonData
  jsonData.category = { category_id: categoryId };
  delete jsonData.category_id; // Elimina category_id de jsonData, ya que ahora tenemos category

  console.log(jsonData);
  const request = await fetch(urlApiItem + '/' + id, {
    method: 'PUT',
    headers: headersItem,
    body: JSON.stringify(jsonData),
  });
  if (request.ok) {
    alertas('Item Modificated', 1);
    listar();
  } else {
    const data = await request.json(); // Espera a que la promesa se resuelva
    console.log(data); // Aquí puedes manejar la data de la respuesta
    const dataArray = Object.values(data);
    console.log(dataArray); // Aquí puedes manejar la data de la respuesta
    let dataResponse = '';
    for (let v of dataArray) {
      dataResponse += '<li>' + v + '</li>';
    }

    alertas('Error: <br>' + dataResponse, 2);
  }
  document.getElementById('contentModal').innerHTML = '';
  let myModalEl = document.getElementById('modalProducto');
  let modal = bootstrap.Modal.getInstance(myModalEl); // Returns a Bootstrap modal instance
  modal.hide();
}

function verProducto(id) {
  validaToken();
  let settings = {
    method: 'GET',
    headers: headersItem,
  };
  fetch(urlApiItem + '/' + id, settings)
    .then((producto) => producto.json())
    .then(function (producto) {
      let cadena = '';
      if (producto) {
        cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"> Visualizar Producto</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">Producto: ${producto.name}</li>
                    <li class="list-group-item">Descripción: ${producto.description}</li>
                    <li class="list-group-item">Cantidad: ${producto.quantity}</li>
                    <li class="list-group-item">Precio: ${producto.price}</li>
                    <li class="list-group-item">Proveedor: ${producto.provider}</li>
                    <li class="list-group-item">Estado: ${producto.status}</li>
                    <li class="list-group-item">Categoria: ${producto.category.nameCategory}</li>
                    
                </ul>`;
      }
      document.getElementById('contentModal').innerHTML = cadena;
      let myModal = new bootstrap.Modal(
        document.getElementById('modalProducto')
      );
      myModal.toggle();
    });
}

async function createItem() {
  let myForm = document.getElementById('registerForm');
  let formData = new FormData(myForm);
  let jsonData = {};
  for (let [k, v] of formData) {
    //convertimos los datos a json
    jsonData[k] = v;
  }
  let categoryId = jsonData.category_id;
  jsonData.category = { category_id: categoryId };
  delete jsonData.category_id;
  const request = await fetch(urlApiItem, {
    method: 'POST',
    headers: headersItem,
    body: JSON.stringify(jsonData),
  });
  if (request.ok) {
    alertas('Item created', 1);
    listar();
  } else {
    const data = await request.json(); // Espera a que la promesa se resuelva
    console.log(data); // Aquí puedes manejar la data de la respuesta
    const dataArray = Object.values(data);
    console.log(dataArray); // Aquí puedes manejar la data de la respuesta
    let dataResponse = '';
    for (let v of dataArray) {
      dataResponse += '<li>' + v + '</li>';
    }

    alertas('Error: <br>' + dataResponse, 2);
  }
  document.getElementById('contentModal').innerHTML = '';
  let myModalEl = document.getElementById('modalProducto');
  let modal = bootstrap.Modal.getInstance(myModalEl); // Returns a Bootstrap modal instance
  modal.hide();
}

async function createItemForm() {
  let categorias = await obtenerCategorias();
  if (!Array.isArray(categorias)) {
    let listarElement = document.getElementById('listar');
    listarElement.innerHTML =
      '<p id="vacio">Recuerda primero crear categorias</p>';
    let vacioElement = document.querySelector('#vacio');
    vacioElement.classList.add('w-100', 'fs-4', 'mt-5', 'text-red');
    setTimeout(() => {
      listarElement.innerHTML =
        '<p id="vacio">No hay productos registrados</p>';
      let vacioElement = document.querySelector('#vacio');
      vacioElement.classList.add('w-100', 'fs-4', 'mt-5');
    }, 3000);

    return;
  }
  let opcionesCategorias = '';
  for (const categoria of categorias) {
    opcionesCategorias += `<option value="${categoria.category_id}">${categoria.nameCategory}</option>`;
  }
  cadena = `
                       
            <form action="" method="post" id="registerForm">
                <input type="hidden" name="id" id="id">
                <label for="name" class="form-label">Nombre producto</label>
                <input type="text" class="form-control" name="name" id="name" required> <br>
                <label for="description"  class="form-label">Descripción</label>
                <input type="text" class="form-control" name="description" id="description" required> <br>
                <label for="quantity"  class="form-label">Cantidad</label>
                <input type="text" class="form-control" name="quantity" id="quantity" required> <br>
                <label for="price"  class="form-label">Precio</label>
                <input type="text" class="form-control" name="price" id="price" required> <br>
                <label for="provider"  class="form-label">Proveedor</label>
                <input type="text" class="form-control" name="provider" id="provider" required> <br>
                <label for="status"  class="form-label">Estado</label>
                <input type="text" class="form-control" name="status" id="status" required> <br>
                <label for="category_id" class="form-label">Categoría</label>
                <select class="form-control mb-3" name="category_id" id="category_id" required>
                ${opcionesCategorias}
                </select>

                <button type="button" class="btn btn-outline-info mt-3" onclick="createItem()">Registrar</button>
            </form>`;
  document.getElementById('contentModal').innerHTML = cadena;
  let myModal = new bootstrap.Modal(document.getElementById('modalProducto'));
  myModal.toggle();
}

let idToDelete = null;
let deleteModal = null;

function eliminaProducto(id) {
  idToDelete = id;
  deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
  deleteModal.show();
}

document.getElementById('confirmDelete').addEventListener('click', function () {
  if (idToDelete) {
    validaToken();
    let settings = {
      method: 'DELETE',
      headers: headersItem,
    };
    fetch(urlApiItem + '/' + idToDelete, settings)
      .then((response) => {
        if (response.status === 204) return {};
        else return response.json();
      })
      .then(function (data) {
        listar();
        alertas('The item has been deleted successfully!', 1);
      });
    idToDelete = null;
    deleteModal.hide();
  }
});
