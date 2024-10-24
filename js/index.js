// Scroll Suave para Navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();

        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Cambio de Color del Header al Desplazar
const header = document.querySelector('header');
const initialHeaderColor = '#003366'; // Color de fondo inicial del header
const scrolledHeaderColor = '#001f3f'; // Color de fondo del header cuando se hace scroll

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.style.backgroundColor = scrolledHeaderColor;
    } else {
        header.style.backgroundColor = initialHeaderColor;
    }
});

