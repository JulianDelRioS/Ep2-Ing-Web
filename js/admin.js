document.addEventListener('DOMContentLoaded', function() {
    const solicitudesContainer = document.getElementById('solicitudesContainer');
    const productosContainer = document.getElementById('productosContainer');
    const logoutBtn = document.getElementById('logoutBtn');

    // Función para mostrar solicitudes
    function mostrarSolicitudes() {
        const solicitudes = JSON.parse(localStorage.getItem('requests')) || [];
        solicitudesContainer.innerHTML = '';

        if (solicitudes.length === 0) {
            solicitudesContainer.innerHTML = '<p>No hay solicitudes pendientes.</p>';
            return;
        }

        solicitudes.forEach((solicitud, index) => {
            const solicitudDiv = document.createElement('div');
            solicitudDiv.innerHTML = `
                <h4>Producto: ${solicitud.name}</h4>
                <p>Precio: $${solicitud.price}</p>
                <p>Categoría: ${solicitud.category}</p>
                <p>Descripción: ${solicitud.description}</p>
                <button class="approve-btn" data-index="${index}">Aprobar</button>
                <button class="reject-btn" data-index="${index}">Rechazar</button>
            `;
            solicitudesContainer.appendChild(solicitudDiv);
        });

        // Agregar eventos a los botones de aprobar y rechazar
        document.querySelectorAll('.approve-btn').forEach(btn => {
            btn.addEventListener('click', aprobarSolicitud);
        });

        document.querySelectorAll('.reject-btn').forEach(btn => {
            btn.addEventListener('click', rechazarSolicitud);
        });
    }

    // Función para mostrar productos
    function mostrarProductos() {
        const productos = JSON.parse(localStorage.getItem('products')) || [];
        productosContainer.innerHTML = '';

        if (productos.length === 0) {
            productosContainer.innerHTML = '<p>No hay productos publicados.</p>';
            return;
        }

        productos.forEach(product => {
            const productoDiv = document.createElement('div');
            productoDiv.innerHTML = `
                <h4>${product.name}</h4>
                <p>Precio: $${product.price}</p>
                <p>Categoría: ${product.category}</p>
                <p>${product.description}</p>
                <button class="delete-btn" data-name="${product.name}">Eliminar</button>
            `;
            productosContainer.appendChild(productoDiv);
        });

        // Agregar eventos a los botones de eliminar
        document.querySelectorAll('.delete-btn').forEach(btn => {
            btn.addEventListener('click', eliminarProducto);
        });
    }

    // Función para aprobar una solicitud
    function aprobarSolicitud(event) {
        const index = event.target.getAttribute('data-index');
        const solicitudes = JSON.parse(localStorage.getItem('requests')) || [];
        const solicitud = solicitudes[index];

        // Eliminar la solicitud de la lista
        solicitudes.splice(index, 1);
        localStorage.setItem('requests', JSON.stringify(solicitudes)); // Guardar cambios

        // Agregar el producto a la lista de productos
        let productos = JSON.parse(localStorage.getItem('products')) || [];
        productos.push({
            name: solicitud.name,
            price: solicitud.price,
            category: solicitud.category,
            description: solicitud.description,
            images: solicitud.images,
            userId: solicitud.userId  // Almacenar el username del solicitante
        });
        localStorage.setItem('products', JSON.stringify(productos)); // Guardar productos

        // Actualizar la vista
        mostrarSolicitudes();
        mostrarProductos();
        alert('Solicitud aprobada y producto añadido.');
    }

    // Función para rechazar una solicitud
    function rechazarSolicitud(event) {
        const index = event.target.getAttribute('data-index');
        const solicitudes = JSON.parse(localStorage.getItem('requests')) || [];

        // Eliminar la solicitud de la lista
        solicitudes.splice(index, 1);
        localStorage.setItem('requests', JSON.stringify(solicitudes)); // Guardar cambios

        // Actualizar la vista
        mostrarSolicitudes();
        alert('Solicitud rechazada.');
    }

    // Función para eliminar producto
    function eliminarProducto(event) {
        const productName = event.target.getAttribute('data-name');
        let productos = JSON.parse(localStorage.getItem('products')) || [];

        // Filtrar los productos para eliminar el seleccionado
        productos = productos.filter(product => product.name !== productName);

        // Guardar la nueva lista en localStorage
        localStorage.setItem('products', JSON.stringify(productos));
        mostrarProductos(); // Volver a mostrar los productos
        alert('Producto eliminado exitosamente.');
    }

    // Lógica para cerrar sesión
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('loggedInUser'); // Eliminar el usuario logueado
        window.location.href = 'login.html'; // Redirigir al login
    });

    // Inicializar mostrando solicitudes y productos
    mostrarSolicitudes();
    mostrarProductos();
});
