document.addEventListener('DOMContentLoaded', function() {
    // Obtener el producto desde el localStorage
    const selectedProduct = JSON.parse(localStorage.getItem('selectedProduct'));

    if (selectedProduct) {
        const productDetailsDiv = document.getElementById('productDetails');

        // Crear HTML para mostrar detalles del producto
        const imagesHTML = selectedProduct.images.map(image => `
            <img src="${image}" class="product-image" alt="Imagen del producto">
        `).join('');

        productDetailsDiv.innerHTML = `
            <div class="carousel-container">
                <div class="carousel">
                    ${imagesHTML}
                </div>
                <button class="carousel-button prev" onclick="moveCarousel(-1)">&#10094;</button>
                <button class="carousel-button next" onclick="moveCarousel(1)">&#10095;</button>
            </div>
            <div class="product-info">
                <h1>${selectedProduct.name}</h1>
                <p><strong>Precio:</strong> $${selectedProduct.price}</p>
                <p><strong>Categoría:</strong> ${selectedProduct.category}</p>
                <p><strong>Descripción:</strong> ${selectedProduct.description}</p>
                <p><strong>Comuna:</strong> ${selectedProduct.commune || 'No especificada'}</p>
                <p><strong>Región:</strong> ${selectedProduct.region || 'No especificada'}</p>
                <p><strong>Usuario Vendedor:</strong> ${selectedProduct.userId}</p>
            </div>
        `;

        // Inicializar el carrusel
        let currentIndex = 0;
        const images = productDetailsDiv.querySelectorAll('.product-image');
        const totalImages = images.length;

        // Función para mostrar la imagen actual
        function updateCarousel() {
            images.forEach((img, index) => {
                img.style.display = (index === currentIndex) ? 'block' : 'none';
            });
        }

        // Mover el carrusel
        window.moveCarousel = function(direction) {
            currentIndex += direction;
            if (currentIndex < 0) {
                currentIndex = totalImages - 1; // Volver al último si está en el primero
            } else if (currentIndex >= totalImages) {
                currentIndex = 0; // Volver al primero si está en el último
            }
            updateCarousel();
        };

        // Inicializar el carrusel mostrando solo la primera imagen
        updateCarousel();
    } else {
        document.getElementById('productDetails').innerHTML = '<p>No se encontró información del producto.</p>';
    }
});
