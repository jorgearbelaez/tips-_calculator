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

  mostrarResumen();
}

function mostrarResumen() {
  const contenido = document.querySelector("#resumen .contenido");

  const resumen = document.createElement("div");
  resumen.classList.add("col-md-6", "card", "py-5", "px-3", "shadow");
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
    console.log(articulo);

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

    // agregar elementos a sus contenedores padres
    cantidadArticulo.appendChild(cantidadValor);
    precioArticulo.appendChild(precioValor);

    lista.appendChild(nombreArticulo);
    lista.appendChild(cantidadArticulo);
    lista.appendChild(precioArticulo);

    grupo.appendChild(lista);
  });

  resumen.appendChild(mesa);
  resumen.appendChild(hora);
  resumen.appendChild(heading);
  resumen.appendChild(grupo);

  contenido.appendChild(resumen);
}

function limpiarHTML() {
  const contenido = document.querySelector("#resumen .contenido");
  while (contenido.firstChild) {
    contenido.removeChild(contenido.firstChild);
  }
}
