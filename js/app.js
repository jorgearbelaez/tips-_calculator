let cliente = {
  mesa: "",
  hora: "",
  pedido: [],
};

const categorias = {
  1: "Comida",
  2: "Bebidas",
  3: "Postres",
};

const btnGuardarCliente = document.querySelector("#guardar-cliente");

btnGuardarCliente.addEventListener("click", guardarCliente);

function guardarCliente() {
  const mesa = document.querySelector("#mesa").value;
  const hora = document.querySelector("#hora").value;

  // validar campos
  const camposVacios = [mesa, hora].some((campo) => campo === "");

  if (camposVacios) {
    const existeAlerta = document.querySelector(".invalid-feedback");

    if (!existeAlerta) {
      const alerta = document.createElement("div");
      alerta.classList.add("invalid-feedback", "d-block", "text-center");
      alerta.textContent = "Todos los campos son obligatorios";
      document.querySelector(".modal-body form").appendChild(alerta);

      setTimeout(() => {
        alerta.remove();
      }, 3000);
    }
    return;
  }
  //asignar datos del formulario a cliente
  cliente = { ...cliente, mesa, hora };

  //ocultar modal
  const modalFormulario = document.querySelector("#formulario");
  const modalBoostrap = bootstrap.Modal.getInstance(modalFormulario);
  modalBoostrap.hide();

  // mostrar secciones
  mostrarSecciones();

  //OBTENER PLATILLOS API
  obtenerPlatillos();
}

function mostrarSecciones() {
  const seccionesOcultas = document.querySelectorAll(".d-none");
  seccionesOcultas.forEach((seccion) => seccion.classList.remove("d-none"));
}

function obtenerPlatillos() {
  const url = "http://localhost:4000/platillos";

  fetch(url)
    .then((respuesta) => respuesta.json())
    .then((resultado) => mostrarPlatillos(resultado))
    .catch((error) => console.log(error));
}

function mostrarPlatillos(platillos) {
  const contenido = document.querySelector("#platillos .contenido");

  platillos.forEach((platillo) => {
    // creamos el div donde anexaremos cada llave(propiedad) que saquemos del objeto
    const row = document.createElement("div");
    row.classList.add("row", "py-3", "border-top");

    const nombre = document.createElement("div");
    nombre.classList.add("col-md-4");
    nombre.textContent = platillo.nombre;

    const precio = document.createElement("div");
    precio.classList.add("col-md-3", "fw-bold");
    precio.textContent = `$${platillo.precio}`;

    const categoria = document.createElement("div");
    categoria.classList.add("col-md-3");
    categoria.textContent = categorias[platillo.categoria];

    const inputCantidad = document.createElement("input");
    inputCantidad.type = "number";
    inputCantidad.min = 0;
    inputCantidad.value = 0;
    inputCantidad.id = `producto-${platillo.id}`;
    inputCantidad.classList.add("text-center");

    // vamos a detectarla cantidad y el platillo que se esta agregando
    inputCantidad.onchange = function () {
      const cantidad = parseInt(inputCantidad.value);

      agregarPlatillo({ ...platillo, cantidad });
    };

    const agregar = document.createElement("div");
    agregar.classList.add("col-md-2");
    agregar.appendChild(inputCantidad);

    row.appendChild(nombre);
    row.appendChild(precio);
    row.appendChild(categoria);
    row.appendChild(agregar);

    contenido.appendChild(row);
  });
}

function agregarPlatillo(producto) {
  // extraer el pedido actual

  let { pedido } = cliente;

  //revisar que la cantidad sea mayor a 0
  if (producto.cantidad > 0) {
    //comprueba si el producto ya existe en el pedido
    if (pedido.some((articulo) => articulo.id === producto.id)) {
      const pedidoActualizado = pedido.map((articulo) => {
        if (articulo.id === producto.id) {
          articulo.cantidad = producto.cantidad;
        }
        return articulo;
      });
      //se asigna el nuevo array a cliente.pedido
      cliente.pedido = [...pedidoActualizado];
    } else {
      //el articulo no existe, lo agregamos
      cliente.pedido = [...pedido, producto];
    }
  } else {
    //eliminar pedido cuando vuelve a cero

    const resultado = pedido.filter((articulo) => articulo.id !== producto.id);
    cliente.pedido = [...resultado];
  }
  console.log(cliente.pedido);

  //limpiarHTML previo
  limpiarHTML();
  // mostrar el resumen del pedido

  if (cliente.pedido.length) {
    mostrarResumen();
  } else {
    mensajePedidoVacio();
  }
}

function mostrarResumen() {
  const contenido = document.querySelector("#resumen .contenido");

  const resumen = document.createElement("div");
  resumen.classList.add("col-md-6", "card", "py-2", "px-3", "shadow");
  // informacion mesa
  const mesa = document.createElement("p");
  mesa.textContent = "Mesa: ";
  mesa.classList.add("fw-bold");

  const mesaSpan = document.createElement("span");
  mesaSpan.textContent = cliente.mesa;
  mesaSpan.classList.add("fw-normal");
  // informacion hora
  const hora = document.createElement("p");
  hora.textContent = "hora: ";
  hora.classList.add("fw-bold");

  const horaSpan = document.createElement("span");
  horaSpan.textContent = cliente.hora;
  horaSpan.classList.add("fw-normal");

  mesa.appendChild(mesaSpan);
  hora.appendChild(horaSpan);

  //titulo de la seccion

  const heading = document.createElement("H3");
  heading.textContent = "Platillos Consumidos";
  heading.classList.add("my-4", "text-center");

  //iterar para mostrar el pedido

  const grupo = document.createElement("ul");
  grupo.classList.add("list-group");

  const { pedido } = cliente;

  pedido.forEach((articulo) => {
    const { nombre, cantidad, precio, id } = articulo;

    //creamos el elemento donde anexaremos las variables
    const lista = document.createElement("li");
    lista.classList.add("list-group-item");

    //nombre articulo
    const nombreArticulo = document.createElement("H4");
    nombreArticulo.classList.add("my-4");
    nombreArticulo.textContent = nombre;

    //cantidad del articulo
    const cantidadArticulo = document.createElement("p");
    cantidadArticulo.classList.add("fw-bold");
    cantidadArticulo.textContent = "cantidad:  ";

    const cantidadValor = document.createElement("span");
    cantidadValor.classList.add("fw-normal");
    cantidadValor.textContent = cantidad;

    //precio del articulo
    const precioArticulo = document.createElement("p");
    precioArticulo.classList.add("fw-bold");
    precioArticulo.textContent = "precio:  ";

    const precioValor = document.createElement("span");
    precioValor.classList.add("fw-normal");
    precioValor.textContent = `$${precio}`;

    //subtotal del articulo
    const subtotalArticulo = document.createElement("p");
    subtotalArticulo.classList.add("fw-bold");
    subtotalArticulo.textContent = "subtotal:  ";

    const subtotalValor = document.createElement("span");
    subtotalValor.classList.add("fw-normal");
    subtotalValor.textContent = calcularSubtotal(precio, cantidad);

    //boton para eliminar

    const btnEliminar = document.createElement("button");
    btnEliminar.classList.add("btn", "btn-danger");
    btnEliminar.textContent = "eliminar del pedido";

    // funcion para eliminar el pedido

    btnEliminar.onclick = function () {
      eliminarProducto(id);
    };

    // agregar elementos a sus contenedores padres
    cantidadArticulo.appendChild(cantidadValor);
    precioArticulo.appendChild(precioValor);
    subtotalArticulo.appendChild(subtotalValor);

    lista.appendChild(nombreArticulo);
    lista.appendChild(cantidadArticulo);
    lista.appendChild(precioArticulo);
    lista.appendChild(subtotalArticulo);
    lista.appendChild(btnEliminar);

    grupo.appendChild(lista);
  });

  resumen.appendChild(heading);
  resumen.appendChild(mesa);
  resumen.appendChild(hora);
  resumen.appendChild(grupo);

  contenido.appendChild(resumen);

  // mostrar formulario de propinas

  formularioPropinas();
}

function limpiarHTML() {
  const contenido = document.querySelector("#resumen .contenido");
  while (contenido.firstChild) {
    contenido.removeChild(contenido.firstChild);
  }
}

function calcularSubtotal(precio, cantidad) {
  return `$ ${precio * cantidad}`;
}
function eliminarProducto(id) {
  const { pedido } = cliente;
  const resultado = pedido.filter((articulo) => articulo.id !== id);
  cliente.pedido = [...resultado];
  console.log(cliente.pedido);

  //limpiarHTML previo
  limpiarHTML();

  if (cliente.pedido.lenght) {
    // mostrar el resumen del pedido
    mostrarResumen();
  } else {
    mensajePedidoVacio();
  }

  // resetear el formulario

  const productoEliminado = `#producto-${id}`;
  const inputEliminado = document.querySelector(productoEliminado);
  inputEliminado.value = 0;
}

function mensajePedidoVacio() {
  const contenido = document.querySelector("#resumen .contenido");

  const texto = document.createElement("p");
  texto.classList.add("text-center");
  texto.textContent = "añade los elementos al pedido";

  contenido.appendChild(texto);
}
function formularioPropinas() {
  const contenido = document.querySelector("#resumen .contenido");

  const formulario = document.createElement("div");
  formulario.classList.add("col-md-6", "formulario");

  const divFormulario = document.createElement("div");
  divFormulario.classList.add("card", "py-2", "px-3", "shadow");

  const heading = document.createElement("h3");
  heading.classList.add("my-4", "text-center");
  heading.textContent = "Propina";

  //radio button 10%

  const radio10 = document.createElement("input");
  radio10.type = "radio";
  radio10.name = "propina";
  radio10.value = "10";
  radio10.classList.add("form-check-input");
  radio10.onclick = calcularPropina;

  const radio10Label = document.createElement("label");
  radio10Label.textContent = "10%";
  radio10Label.classList.add("form-check-label");

  const radio10Div = document.createElement("div");
  radio10Div.classList.add("form-check");

  radio10Div.appendChild(radio10);
  radio10Div.appendChild(radio10Label);

  //radio button 25%

  const radio25 = document.createElement("input");
  radio25.type = "radio";
  radio25.name = "propina";
  radio25.value = "25";
  radio25.classList.add("form-check-input");
  radio25.onclick = calcularPropina;

  const radio25Label = document.createElement("label");
  radio25Label.textContent = "25%";
  radio25Label.classList.add("form-check-label");

  const radio25Div = document.createElement("div");
  radio25Div.classList.add("form-check");

  radio25Div.appendChild(radio25);
  radio25Div.appendChild(radio25Label);

  //radio button 50%

  const radio50 = document.createElement("input");
  radio50.type = "radio";
  radio50.name = "propina";
  radio50.value = "50";
  radio50.classList.add("form-check-input");
  radio50.onclick = calcularPropina;

  const radio50Label = document.createElement("label");
  radio50Label.textContent = "50%";
  radio50Label.classList.add("form-check-label");

  const radio50Div = document.createElement("div");
  radio50Div.classList.add("form-check");

  radio50Div.appendChild(radio50);
  radio50Div.appendChild(radio50Label);

  //agregar al div principal

  divFormulario.appendChild(heading);
  divFormulario.appendChild(radio10Div);
  divFormulario.appendChild(radio25Div);
  divFormulario.appendChild(radio50Div);

  formulario.appendChild(divFormulario);
  //agregar al html
  contenido.appendChild(formulario);
}
function calcularPropina() {
  const { pedido } = cliente;
  let subtotal = 0;
  //calcular subtotal de pedidos
  pedido.forEach((articulo) => {
    subtotal += articulo.cantidad * articulo.precio;
  });

  //calcular total de propina
  const propinaSeleccionada = document.querySelector(
    '[name="propina"]:checked'
  ).value;

  const totalPropina = (subtotal * parseInt(propinaSeleccionada)) / 100;

  //calcular total a pagar
  const total = subtotal + totalPropina;

  console.log(total);

  mostrarTotal(subtotal, total, totalPropina);
}
function mostrarTotal(subtotal, total, propina) {
  const divTotales = document.createElement("Div");
  divTotales.classList.add("total-pagar", "my-5");

  //subtotal

  const subtotalHTML = document.createElement("h3");
  subtotalHTML.classList.add("fs-4", "fw-bold", "mt-2");
  subtotalHTML.textContent = "Subtotal Consumo:  ";

  const subtotalSpan = document.createElement("span");
  subtotalSpan.classList.add("fw-normal");
  subtotalSpan.textContent = `$${subtotal}`;

  //propina

  const propinaHTML = document.createElement("h3");
  propinaHTML.classList.add("fs-4", "fw-bold", "mt-2");
  propinaHTML.textContent = "propina:  ";

  const propinaSpan = document.createElement("span");
  propinaSpan.classList.add("fw-normal");
  propinaSpan.textContent = `$${propina}`;

  //total

  const totalHTML = document.createElement("h3");
  totalHTML.classList.add("fs-4", "fw-bold", "mt-2");
  totalHTML.textContent = "total:  ";

  const totalSpan = document.createElement("span");
  totalSpan.classList.add("fw-normal");
  totalSpan.textContent = `$${total}`;

  subtotalHTML.appendChild(subtotalSpan);
  propinaHTML.appendChild(propinaSpan);
  totalHTML.appendChild(totalSpan);

  //eliminar resultado previo

  const totalPagarDiv = document.querySelector(".total-pagar");
  if (totalPagarDiv) {
    totalPagarDiv.remove();
  }

  divTotales.appendChild(subtotalHTML);
  divTotales.appendChild(propinaHTML);
  divTotales.appendChild(totalHTML);

  const formulario = document.querySelector(".formulario > div");
  formulario.appendChild(divTotales);
}
