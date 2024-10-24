// Función de registro de usuario
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault(); // Evita el envío tradicional del formulario
    
    const username = document.querySelector('input[name="username"]').value;
    const Rut = document.querySelector('input[name="Rut"]').value;
    const email = document.querySelector('input[name="email"]').value;
    const password = document.querySelector('input[name="password"]').value;
    const confirmPassword = document.querySelector('input[name="confirm_password"]').value;
    
    // Validación del formato del RUT
    const rutRegex = /^[0-9]{7,8}-[0-9Kk]$/;
    if (!rutRegex.test(Rut)) {
        alert('Por favor, ingrese un RUT válido en el formato 12345678-9.');
        return;
    }
    
    // Verifica que las contraseñas coincidan
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden. Por favor, intenta de nuevo.');
        return;
    }

    // Verifica que el nombre de usuario no esté ya en uso
    let users = JSON.parse(localStorage.getItem('users')) || [];
    const userExists = users.some(user => user.username === username);
    if (userExists) {
        alert('El nombre de usuario ya está en uso. Por favor, elige otro.');
        return;
    }

    // Crear un objeto usuario
    const newUser = {
        username: username,
        Rut: Rut,
        email: email,
        password: password
    };

    // Agregar el nuevo usuario
    users.push(newUser);

    // Guardar el array de usuarios en localStorage
    localStorage.setItem('users', JSON.stringify(users));

    alert('Usuario creado exitosamente');

    // Redirigir al usuario a la página de inicio de sesión
    window.location.href = 'login.html';
});
