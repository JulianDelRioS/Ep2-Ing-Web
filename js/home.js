document.addEventListener('DOMContentLoaded', function() {
    // Obtener el usuario logueado desde localStorage
    const loggedInUser = JSON.parse(localStorage.getItem('loggedInUser'));
    const userBtn = document.querySelector('.user-btn');
    const loginBtn = document.getElementById('loginBtn');
    const logoutBtn = document.getElementById('logoutBtn');
    const hamburgerMenu = document.getElementById('hamburgerMenu');
    const menuToggle = document.getElementById('menuToggle');

    // Verificar si hay un usuario logueado
    if (loggedInUser) {
        userBtn.textContent = loggedInUser.username;
        userBtn.style.display = 'inline-block';
        loginBtn.style.display = 'none';
        logoutBtn.style.display = 'inline-block';
    } else {
        userBtn.style.display = 'none';
        loginBtn.style.display = 'inline-block';
        logoutBtn.style.display = 'none';
    }

    // Lógica para cerrar sesión
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        redirectTo('login.html');
    });

    // Redirigir a login.html cuando se haga clic en el botón de "Iniciar sesión"
    loginBtn.addEventListener('click', () => redirectTo('login.html'));

    // Cargar productos y solicitudes desde localStorage
    let products = JSON.parse(localStorage.getItem('products')) || [];
    let requests = JSON.parse(localStorage.getItem('requests')) || [];

    const productsList = document.getElementById('productsList');
    const uploadProductForm = document.getElementById('uploadProductForm');
    const uploadSection = document.getElementById('upload-section');
    const showUploadFormBtn = document.getElementById('showUploadFormBtn');
    const showAllProductsBtn = document.getElementById('showAllProductsBtn');

    // Función para redirigir
    function redirectTo(url) {
        window.location.href = url;
    }

    // Función para renderizar productos
    function renderProducts(filteredProducts) {
        productsList.innerHTML = '';
        filteredProducts.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.classList.add('product-item');

            // Mostrar solo la primera imagen
            const imagesHTML = product.images.length > 0
                ? `<img src="${product.images[0]}" class="product-image" alt="Imagen del producto">`
                : '';

            // Mostrar el nombre y el precio del producto
            productDiv.innerHTML = `
                ${imagesHTML}
                <h4>${product.name}</h4>
                <p>Precio: $${product.price}</p>
            `;

            // Añadir botón "Ver detalles"
            const viewDetailsButton = document.createElement('button');
            viewDetailsButton.textContent = 'Ver detalles';
            viewDetailsButton.classList.add('view-details-btn');
            viewDetailsButton.addEventListener('click', () => {
                localStorage.setItem('selectedProduct', JSON.stringify(product));
                redirectTo('detalles_producto.html');
            });
            productDiv.appendChild(viewDetailsButton);

            // Mostrar el botón de eliminar si el usuario es el propietario
            if (product.userId === loggedInUser.username) {
                const deleteButton = document.createElement('button');
                deleteButton.classList.add('delete-btn');
                deleteButton.setAttribute('data-name', product.name);
                deleteButton.setAttribute('data-user', product.userId);
                deleteButton.textContent = 'Eliminar';
                deleteButton.addEventListener('click', deleteProduct);
                productDiv.appendChild(deleteButton);
            }

            productsList.appendChild(productDiv);
        });
    }

    // Mostrar el formulario de subida de productos
    showUploadFormBtn.addEventListener('click', () => {
        uploadSection.style.display = 'block';
    });

    // Mostrar todos los productos
    showAllProductsBtn.addEventListener('click', () => {
        renderProducts(products);
    });

    // Enviar formulario para solicitar la publicación de un producto
    uploadProductForm.addEventListener('submit', function(event) {
        event.preventDefault();

        const productName = document.getElementById('productName').value;
        const productPrice = document.getElementById('productPrice').value;
        const productCategory = document.getElementById('productCategory').value;
        const productDescription = document.getElementById('productDescription').value;
        const productImagesInput = document.getElementById('productImages').files;

        // Validar que se suban exactamente 3 imágenes
        if (productImagesInput.length !== 3) {
            alert('Debes subir exactamente 3 imágenes.');
            return;
        }

        const readers = Array.from(productImagesInput).map(file => {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => resolve(e.target.result);
                reader.onerror = reject;
                reader.readAsDataURL(file);
            });
        });

        Promise.all(readers).then(images => {
            saveRequest(productName, productPrice, productCategory, productDescription, images);
            uploadProductForm.reset();
            uploadSection.style.display = 'none';
        });
    });

    // Función para guardar la solicitud de publicación de un producto
    function saveRequest(name, price, category, description, images) {
        const newRequest = {
            name: name,
            price: price,
            category: category,
            description: description,
            images: images,
            userId: loggedInUser.username, // Almacenar el username del usuario que solicita la publicación
            status: 'pending'
        };

        requests.push(newRequest);
        localStorage.setItem('requests', JSON.stringify(requests));
        alert('Solicitud de publicación enviada exitosamente.');
    }

    // Función para eliminar productos
    function deleteProduct(event) {
        const productName = event.target.getAttribute('data-name');
        const productUserId = event.target.getAttribute('data-user');

        // Permitir eliminar si el usuario es el propietario
        if (productUserId === loggedInUser.username) {
            products = products.filter(product => product.name !== productName);
            localStorage.setItem('products', JSON.stringify(products));
            renderProducts(products);
            alert('Producto eliminado exitosamente.');
        } else {
            alert('No tienes permiso para eliminar este producto.');
        }
    }

    // Filtrar productos por categoría
    function filterProductsByCategory(category) {
        const filteredProducts = products.filter(product => product.category === category);
        renderProducts(filteredProducts);
    }

    // Manejar la selección de categorías
    document.querySelectorAll('.categories-content a').forEach(categoryLink => {
        categoryLink.addEventListener('click', function(e) {
            e.preventDefault();
            const category = this.getAttribute('data-category');
            filterProductsByCategory(category);
        });
    });

    // Función para cargar productos desde el archivo JSON
    function loadProductsFromJson() {
        fetch('productos.json') // Cambia la ruta si es necesario
            .then(response => response.json())
            .then(jsonProducts => {
                products = [...products, ...jsonProducts]; // Combinar productos de localStorage y JSON
                renderProducts(products); // Renderizar productos combinados
            })
            .catch(error => console.error('Error cargando el archivo JSON:', error));
    }

    // Llamar a la función para cargar productos al cargar la página
    loadProductsFromJson();

    // Lógica para el menú hamburguesa
    menuToggle.addEventListener('click', () => {
        hamburgerMenu.style.display = hamburgerMenu.style.display === 'none' || hamburgerMenu.style.display === '' ? 'block' : 'none';
    });

    // Funciones para manejar los botones del menú hamburguesa
    function closeHamburgerMenu() {
        hamburgerMenu.style.display = 'none';
    }

    // Añadir lógica a los botones del menú hamburguesa
    document.getElementById('showUploadFormBtnHamburger').addEventListener('click', () => {
        uploadSection.style.display = 'block';
        closeHamburgerMenu();
    });

    document.getElementById('showAllProductsBtnHamburger').addEventListener('click', () => {
        renderProducts(products);
        closeHamburgerMenu();
    });

    document.getElementById('loginBtnHamburger').addEventListener('click', () => {
        redirectTo('login.html');
        closeHamburgerMenu();
    });

    document.getElementById('logoutBtnHamburger').addEventListener('click', () => {
        localStorage.removeItem('token');
        localStorage.removeItem('loggedInUser');
        redirectTo('login.html');
        closeHamburgerMenu();
    });
    
});
