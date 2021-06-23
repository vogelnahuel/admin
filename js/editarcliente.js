(function() {
    let DB;
    let idCliente;
    const nombre = document.querySelector('#nombre');
    const email = document.querySelector('#email');
    const telefono = document.querySelector('#telefono');
    const empresa = document.querySelector('#empresa');

    const formulario = document.querySelector('#formulario');

    document.addEventListener('DOMContentLoaded', () => {
        conectarDB();
        formulario.addEventListener('submit', actualizarCliente);
        //verificar el ID de url
        const parametrosUrl = new URLSearchParams(window.location.search); //extrae los parametros de un url
        idCliente = parametrosUrl.get('id');
        if (idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente);
            }, 1000);

        }
    });


    function obtenerCliente(idCliente) {
        let transaccion = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaccion.objectStore('crm');
        const cliente = objectStore.openCursor();
        cliente.onsuccess = function(e) {
            const cursor = e.target.result;
            if (cursor) {
                if (cursor.value.id === Number(idCliente)) {
                    llenarFormulario(cursor.value);
                }
                cursor.continue();
            }
        }
    }

    function llenarFormulario(datosCliente) {
        nombre.value = datosCliente.nombre;
        email.value = datosCliente.mail;
        telefono.value = datosCliente.telefono;
        empresa.value = datosCliente.empresa;
    }

    function actualizarCliente(e) {
        e.preventDefault();

        if (nombre.value === '' || email.value === '' || telefono.value === '' || empresa.value === '') {
            imprimirAlerta('no puede haber campos vacios', 'error');
        }

        //actualizar cliente

        const clienteActualizado = {
            nombre: nombre.value,
            mail: email.value,
            telefono: telefono.value,
            empresa: empresa.value,
            id: Number(idCliente) //viene como string entonces castear
        }
        const transaccion = DB.transaction(['crm'], 'readwrite');
        const objectStore = transaccion.objectStore('crm');
        objectStore.put(clienteActualizado);

        transaccion.oncomplete = function() {

            imprimirAlerta('editado correctamente');
            setTimeout(() => {
                window.location.href = 'index.html';
            }, 3000);
        }
        transaccion.onerror = function() {
            imprimirAlerta('hubo un error', 'error');
        }

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