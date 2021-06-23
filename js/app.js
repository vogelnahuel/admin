(function() {
    let DB;
    const listadoClientes = document.querySelector('#listado-clientes');

    document.addEventListener('DOMContentLoaded', () => {
        crearDB();
        if (window.indexedDB.open('crm', 1)) {
            obtenerClientes();
        }
        listadoClientes.addEventListener('click', eliminarRegistro);
    });

    function eliminarRegistro(e) {
        if (e.target.classList.contains('eliminar')) //con esto seleccionas todo el parrafo o bloque y decis si la etiqueta donde apreto  click tiene esta clase haces lo siguiente
        {
            const eliminar = Number(e.target.dataset.cliente);
            const confirmar = confirm('desea eliminar esto?');
            if (confirmar === true) {
                const transaccion = DB.transaction(['crm'], 'readwrite');
                const objectStore = transaccion.objectStore('crm');
                objectStore.delete(eliminar);
                transaccion.oncomplete = function() {
                    console.log('eliminando...');
                    e.target.parentElement.parentElement.remove();
                }
                transaccion.onerror = function() {
                    console.log('hubo un error');
                }
            }
        }
    }


    function obtenerClientes() {
        const abrirConexion = window.indexedDB.open('crm', 1);
        abrirConexion.onerror = function() {
            console.log('error de conexion');
        }
        abrirConexion.onsuccess = function() {
            DB = abrirConexion.result;
            const objectStore = DB.transaction('crm').objectStore('crm');

            objectStore.openCursor().onsuccess = function(e) {
                const cursor = e.target.result;
                if (cursor) {
                    const { nombre, mail, telefono, empresa, id } = cursor.value;

                    listadoClientes.innerHTML +=
                        `<tr>
                    <td class = "px-6 py-4 espacio en blanco-sin-envolver borde-b borde-gris-200">
                        <p class = "text-sm lead-5 font-medium text-gray-700 text-lg font-bold"> ${ nombre } </p>
                        <p class = "text-sm lead-10 text-gray-700"> ${mail} </p>
                    </td>
                    <td class = "px-6 py-4 espacio en blanco-sin-envolver borde-b borde-gris-200">
                        <p class = "text-gray-700"> ${ telefono } </p>
                    </td>
                    <td class = "px-6 py-4 espacio en blanco-sin-ajuste borde-b borde-gris-200 texto-5 inicial-gris-700">    
                        <p class = "text-gray-600"> ${ empresa } </p>
                    </td>
                    <td class = "px-6 py-4 espacio en blanco-sin-ajustar borde-b borde-gris-200 texto-sm inicial-5">
                        <a href="editar-cliente.html?id= ${ id} "class="text-teal-600 hover:text-teal-900 mr-5"> Editar </a>
                        <a href="#" data-cliente=" ${ id} "class="text-red-600 hover:text-red-900 eliminar"> ELIMINAR </a>
                    </td>
                </tr>
            `;
                    cursor.continue();
                } else {
                    console.log('no hay mas reg');
                }
            }
        }
    }

    function crearDB() {

        const crearDB = window.indexedDB.open('crm', 1);
        crearDB.onerror = function() {
            console.log('hubo un error')
        };

        crearDB.onsuccess = function() {
            console.log(crearDB.result);
            DB = crearDB.result;
        }

        crearDB.onupgradeneeded = function(e) {

            const db = e.target.result;
            const objectStore = db.createObjectStore('crm', {
                keyPath: 'id',
                autoIncrement: true
            });

            objectStore.createIndex('nombre', 'nombre', { unique: false });
            objectStore.createIndex('email', 'email', { unique: true });
            objectStore.createIndex('telefono', 'telefono', { unique: false });
            objectStore.createIndex('empresa', 'empresa', { unique: false });
            objectStore.createIndex('id', 'id', { unique: true });

            console.log('se creo correctamente la BD');
        }
    }


})(); //utilizo un ifee para que las variables de app.js no se mezclen con los demas .js