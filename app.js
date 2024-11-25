const express = require('express');
const path = require('path');
const session = require('express-session');
const app = express();
const PORT = 3000;

// Almacenamiento en memoria para usuarios
const users = {};

// Configura sesiones
app.use(session({
    secret: 'secreto_super_seguro',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
}));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'Web')));

// Ruta para servir el formulario de login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'Web', 'login.html'));
});

// Procesar el inicio de sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (users[email] && users[email] === password) {
        req.session.loggedIn = true;
        req.session.user = email;
        res.redirect('/inicio');
    } else {
        res.send('Credenciales incorrectas');
    }
});

// Ruta para la página de inicio
app.get('/inicio', (req, res) => {
    if (req.session.loggedIn) {
        res.sendFile(path.join(__dirname, 'Web', 'inicio.html'));
    } else {
        res.redirect('/login');
    }
});

// Ruta para el formulario de registro
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'Web', 'register.html'));
});

// Procesar el registro
app.post('/register', (req, res) => {
    const { email, password } = req.body;
    if (users[email]) {
        res.send('El usuario ya está registrado');
    } else {
        users[email] = password;
        res.redirect('/login'); // Redirigir a login después del registro
    }
});

// Ruta para cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy(err => {
        if (err) return res.send('Error al cerrar sesión');
        res.redirect('/login');
    });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
