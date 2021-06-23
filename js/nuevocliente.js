(function() {
    let DB;
    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {

        conectarDB();


        formulario.addEventListener('submit', validarCliente);
    });

    function validarCliente(e) {
        e.preventDefault();
        const nombre = document.querySelector('#nombre').value;
        const email = document.querySelector('#email').value;
        const telefono = document.querySelector('#telefono').value;
        const empresa = document.querySelector('#empresa').value;

        if (nombre === '' || email === '' || telefono === '' || empresa === '') {
            imprimirAlerta('todos los campos son obligatorios', 'error');
            return;
        }
        //crear obj con la info
        const cliente = {
            nombre: nombre,
            mail: email,
            telefono: telefono,
            empresa: empresa,
            id: Date.now()
        }

        crearNuevoCliente(cliente);

    }

    function imprimirAlerta(mensaje, tipo) {
        const alerta = document.querySelector('.alerta');
        if (alerta === null) {
            const div = document.createElement('div');
            div.classList.add('px-4', 'py-3', 'rounded', 'max-w-lg', 'mx-auto', 'mt-6', 'text-center', 'border', 'alerta');
            if (tipo === 'error') {
                div.classList.add('bg-red-100', 'border-red-300', 'text-red-700');

            } else {
                div.classList.add('bg-green-100', 'border-green-300', 'text-green-700');
            }
            div.textContent = mensaje;

            formulario.appendChild(div);

            setTimeout(() => {
                div.remove();
            }, 3000);

        }

    }

    function crearNuevoCliente(cliente) {
        const transaccion = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaccion.objectStore('crm');
        objectStore.add(cliente);

        transaccion.onerror = function() {
            imprimirAlerta('hubo un error al agregar', 'error');
        }
        transaccion.oncomplete = function() {

            imprimirAlerta('agregado correctamente', 'correcto');
        }
        setTimeout(() => {
            window.location.href = "index.html";

        }, 3000);

    }


    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1);

        abrirConexion.onerror = function() {
            console.log('hubo un error');
        }
        abrirConexion.onsuccess = function() {

            DB = abrirConexion.result;
            console.log('se conecto correctamente' + DB);
        }
    }


})();