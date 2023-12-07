//funciones transversales
function alertas(mensaje, tipo) {
  let color = tipo === 1 ? 'success' : 'danger';
  let alerta = `
  <div class="alert alert-${color} alert-dismissible fade show" role="alert">
    <strong><i class="fa-solid fa-triangle-exclamation"></i></strong>
    ${mensaje}
    <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
  </div>
`;
  const contenedorAlertas = document.getElementById('datos');
  contenedorAlertas.innerHTML = alerta;

  setTimeout(() => {
    contenedorAlertas.innerHTML = '';
  }, 3000);
}

function modalConfirmacion(texto, funcion) {
  document.getElementById('contenidoConfirmacion').innerHTML = texto;
  var myModal = new bootstrap.Modal(
    document.getElementById('modalConfirmacion')
  );
  myModal.toggle();
  var confirmar = document.getElementById('confirmar');
  confirmar.onclick = funcion;
}
