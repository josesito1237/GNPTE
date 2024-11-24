const express = require('express'); 
const bcrypt = require('bcrypt');
const db = require('../config/conexion');
const router = express.Router();

// Función de registro
router.post('/register', async (req, res) => {
    const { nombre, apellido_p, apellido_m, email, password, nivel_acceso } = req.body;

    // Validación del dominio del correo
    const emailRegex = /^(.*@gmail\.com|.*@outlook\.com|.*@soycecytem\.mx)$/;
    if (!emailRegex.test(email)) {
        return res.render('register', { error: 'Por favor, usa un correo válido (gmail, outlook o soycecytem.mx).' });
    }

    // Verificar si el correo ya existe
    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            return res.status(500).send('Error en la base de datos');
        }
        if (results.length > 0) {
            // Si ya existe una cuenta con ese correo
            return res.render('register', { error: 'Ya existe una cuenta con ese correo electrónico.' });
        }

        // Encripta la contraseña de forma asíncrona antes de guardar
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `INSERT INTO users (nombre, apellido_p, apellido_m, email, password, nivel_acceso) VALUES (?, ?, ?, ?, ?, ?)`;
        db.query(query, [nombre, apellido_p, apellido_m, email, hashedPassword, nivel_acceso || 'estudiante'], (error) => {
            if (error) {
                return res.status(500).send('Error en el registro');
            }
            res.redirect('/login'); // Redirigir a login después de un registro exitoso
        });
    });
});

// Función de login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    db.query('SELECT * FROM users WHERE email = ?', [email], async (error, results) => {
        if (error) {
            return res.status(500).send('Error en la base de datos');
        }
        // Verificar si el usuario existe
        if (results.length === 0) {
            return res.render('login', { error: 'Usuario no existe. Regístrate.' });
        }
        
        const user = results[0];

        // Verificar la contraseña de forma asíncrona
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.render('login', { error: 'Contraseña incorrecta.' });
        }
        
        // Si el usuario y la contraseña son correctos
        req.session.user = { id: user.id, nivel_acceso: user.nivel_acceso };
        
        if (user.nivel_acceso === 'administrador') {
            res.redirect('/bienvenida_admin');
        } else {
            res.redirect('/bienvenida'); // Redirigir a la vista de bienvenida para estudiantes
        }
    });
});


// Asegúrate de tener esta línea al principio del archivo

// Actualizar un usuario
router.post('/actualizar-usuario/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido_p, apellido_m, email, nivel_acceso, password } = req.body;

    // Encriptar la nueva contraseña si se proporciona
    let hashedPassword;
    if (password) {
        hashedPassword = await bcrypt.hash(password, 10); // Encriptar la contraseña
    }

    const query = `UPDATE users SET nombre = ?, apellido_p = ?, apellido_m = ?, email = ?, nivel_acceso = ?${password ? ', password = ?' : ''} WHERE id = ?`;
    const params = password ? [nombre, apellido_p, apellido_m, email, nivel_acceso, hashedPassword, id] : [nombre, apellido_p, apellido_m, email, nivel_acceso, id];

    db.query(query, params, (error) => {
        if (error) {
            return res.status(500).send('Error al actualizar el usuario');
        }
        res.redirect('/ver-usuarios');
    });
});

// Renderizar formularios de login y registro
router.get('/login', (req, res) => res.render('login', { error: null }));
router.get('/register', (req, res) => res.render('register', { error: null })); // Asegúrate de que error sea null

// Renderizar la vista de bienvenida para estudiantes
router.get('/bienvenida', (req, res) => {
    if (req.session.user && req.session.user.nivel_acceso === 'estudiante') {
        res.render('bienvenida', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});

// Renderizar la vista de bienvenida para administradores
router.get('/bienvenida_admin', (req, res) => {
    if (req.session.user && req.session.user.nivel_acceso === 'administrador') {
        res.render('bienvenida_admin', { user: req.session.user });
    } else {
        res.redirect('/login');
    }
});


// Ruta para cerrar sesión
router.get('/cerrar_sesion', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).send('Error al cerrar sesión');
        }
        res.redirect('/login');
    });
});

module.exports = router;