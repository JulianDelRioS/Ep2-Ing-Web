// Crear un usuario administrador (esto se puede quitar después de ejecutar una vez)
const users = JSON.parse(localStorage.getItem('users')) || [];
const adminExists = users.some(user => user.role === 'admin');

if (!adminExists) {
    users.push({
        username: 'admin',
        email: 'admin@marketlink.com',
        password: 'admin123', // Puedes cambiar esta contraseña
        role: 'admin'
    });
    localStorage.setItem('users', JSON.stringify(users));
    console.log('Usuario administrador creado');
}

// Manejar la validación de inicio de sesión
document.querySelector('form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.querySelector('input[name="username"]').value.trim();
    const password = document.querySelector('input[name="password"]').value.trim();

    // Obtener la lista de usuarios desde localStorage
    let users = JSON.parse(localStorage.getItem('users')) || [];

    // Buscar el usuario en la lista
    const user = users.find(user => (user.username === username || user.email === username) && user.password === password);

    // Verificar si el usuario existe y si la contraseña coincide
    if (user) {
        // Guardar el usuario logueado en localStorage
        localStorage.setItem('loggedInUser', JSON.stringify(user));

        // Verificar el rol del usuario
        if (user.role === 'admin') {
            alert('Bienvenido Administrador');
            window.location.href = 'admin.html'; // Redirigir a la página del administrador
        } else {
            alert('Inicio de sesión exitoso');
            window.location.href = 'home.html'; // Redirigir a la página de usuario
        }
    } else {
        alert('Usuario o contraseña incorrectos');
    }
});
