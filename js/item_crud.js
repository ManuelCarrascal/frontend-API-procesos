//funciones para operaciones crud
const urlApiItem = 'http://localhost:8082/category'; //colocar la url con el puerto
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
    .then((response) => response.json())
    .then(function (categories) {
      let categorias = '';
      for (const categoria of categories) {
        categorias += `
                <tr>
                    <th scope="row">${categoria.category_id}</th>
                    <td>${categoria.nameCategory}</td>
                    <td>${categoria.description}</td>
                    <td>${categoria.status}</td>
                    <td class="text-center">${categoria.displayOrder}</td>
                    <td>
                    <a href="#" onclick="verModificarCategoria('${categoria.category_id}')" class="btn btn-outline-warning">
                        <i class="fa-solid fa-user-pen"></i>
                    </a>
                    <a href="#" onclick="verUsuario('${categoria.category_id}')" class="btn btn-outline-info">
                        <i class="fa-solid fa-eye"></i>
                    </a>
                    </td>
                </tr>`;
      }
      document.getElementById('listar').innerHTML = categorias;
    });
}

function verModificarCategoria(id) {
  validaToken();
  let settings = {
    method: 'GET',
    headers: headersItem,
  };
  fetch(urlApiItem + '/' + id, settings)
    .then((categoria) => categoria.json())
    .then(function (categoria) {
      let cadena = '';
      if (categoria) {
        cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5">Modificar Producto</h1>
                </div>
              
                <form action="" method="post" id="modificar">
                    <input type="hidden" name="id" id="id" value="${categoria.category_id}">
                    <label for="nameCategory" class="form-label">Nombre categoria</label>
                    <input type="text" class="form-control" name="nameCategory" id="nameCategory" required value="${categoria.nameCategory}"> <br>
                    <label for="description"  class="form-label">Descripción</label>
                    <input type="text" class="form-control" name="description" id="description" required value="${categoria.description}"> <br>
                    <label for="status"  class="form-label">Estado</label>
                    <input type="text" class="form-control" name="status" id="status" required value="${categoria.status}"> <br>
                    <label for="displayOrder" class="form-label" >Display order</label>
                    <input type="text" class="form-control" name="displayOrder" id="displayOrder" required value="${categoria.displayOrder}"> <br>

                  
                    <button type="button" class="btn btn-outline-warning" 
                        onclick="modificarCategoria('${categoria.category_id}')">Modificar
                    </button>
                </form>`;
      }
      document.getElementById('contentModal').innerHTML = cadena;
      let myModal = new bootstrap.Modal(
        document.getElementById('modalProducto')
      );
      myModal.toggle();
    });
}

async function modificarCategoria(id) {
  validaToken();
  let myForm = document.getElementById('modificar');
  let formData = new FormData(myForm);
  let jsonData = {};
  for (let [k, v] of formData) {
    //convertimos los datos a json
    jsonData[k] = v;
  }
  const request = await fetch(urlApiItem + '/' + id, {
    method: 'PUT',
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

function verUsuario(id) {
  validaToken();
  let settings = {
    method: 'GET',
    headers: headersItem,
  };
  fetch(urlApiItem + '/' + id, settings)
    .then((categoria) => categoria.json())
    .then(function (categoria) {
      let cadena = '';
      if (categoria) {
        cadena = `
                <div class="p-3 mb-2 bg-light text-dark">
                    <h1 class="display-5"><i class="fa-solid fa-user-pen"></i> Visualizar Categoría</h1>
                </div>
                <ul class="list-group">
                    <li class="list-group-item">Categoría: ${categoria.nameCategory}</li>
                    <li class="list-group-item">Descripción: ${categoria.description}</li>
                    <li class="list-group-item">Estado: ${categoria.status}</li>
                    <li class="list-group-item">Display: ${categoria.displayOrder}</li>
                    
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
  const request = await fetch(urlApiItem, {
    method: 'POST',
    headers: headersItem,
    body: JSON.stringify(jsonData),
  });
  if (request.ok) {
    alertas('Category created', 1);
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

function createItemForm() {
  cadena = `
                       
            <form action="" method="post" id="registerForm">
                <input type="hidden" name="id" id="id">
                <label for="nameCategory" class="form-label">Nombre categoria</label>
                <input type="text" class="form-control" name="nameCategory" id="nameCategory" required> <br>
                <label for="description"  class="form-label">Descripción</label>
                <input type="text" class="form-control" name="description" id="description" required> <br>
                <label for="status"  class="form-label">Estado</label>
                <input type="text" class="form-control" name="status" id="status" required> <br>
                <label for="displayOrder"  class="form-label">Display Order</label>
                <input type="text" class="form-control" name="displayOrder" id="displayOrder" required> <br>
                <button type="button" class="btn btn-outline-info" onclick="createItem()">Registrar</button>
            </form>`;
  document.getElementById('contentModal').innerHTML = cadena;
  let myModal = new bootstrap.Modal(document.getElementById('modalProducto'));
  myModal.toggle();
}

function eliminaUsuario(id) {
  validaToken();
  let settings = {
    method: 'DELETE',
    headers: headersUser,
  };
  fetch(urlApiUser + '/' + id, settings)
    .then((response) => response.json())
    .then(function (data) {
      listar();
      alertas('The category has been deleted successfully!', 2);
    });
}
