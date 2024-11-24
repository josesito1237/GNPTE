const express = require('express');
const bcrypt = require('bcrypt');
const db = require('../config/conexion');
const router = express.Router();

// Ruta para ver la información del usuario
router.get('/', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login');
    }

    const userId = req.session.user.id;

    db.query('SELECT * FROM users WHERE id = ?', [userId], (error, results) => {
        if (error) {
            return res.status(500).send('Error al obtener la información del usuario');
        }

        if (results.length === 0) {
            return res.status(404).send('Usuario no encontrado');
        }

        const user = results[0];
        res.render('verinformacionusuario', { user });
    });
});

// Ruta para actualizar la información del usuario
router.post('/editar', async (req, res) => {
    const { nombre, apellido_p, apellido_m, email, password } = req.body;
    const userId = req.session.user.id;

    let query = 'UPDATE users SET nombre = ?, apellido_p = ?, apellido_m = ?, email = ?';
    const values = [nombre, apellido_p, apellido_m, email];

    if (password) {
        const hashedPassword = await bcrypt.hash(password, 10);
        query += ', password = ?';
        values.push(hashedPassword);
    }

    query += ' WHERE id = ?';
    values.push(userId);

    db.query(query, values, (error) => {
        if (error) {
            console.error('Error al actualizar la información:', error);
            return res.status(500).send('Error al actualizar la información');
        }
        res.redirect('/ver');
    });
});

// Ruta para eliminar la cuenta del usuario
router.post('/eliminar', (req, res) => {
    const userId = req.session.user.id;

    db.query('DELETE FROM users WHERE id = ?', [userId], (error) => {
        if (error) {
            return res.status(500).send('Error al eliminar la cuenta');
        }

        req.session.destroy((err) => {
            if (err) {
                return res.status(500).send('Error al cerrar sesión');
            }
            res.redirect('/login');
        });
    });
});

// Ruta para redirigir según el nivel de acceso
// Ruta para redirigir según el nivel de acceso
router.post('/redirigir', (req, res) => {
    if (!req.session.user) {
        return res.redirect('/login'); // Si no hay sesión, redirige al login
    }

    // Obtiene el nivel de acceso del usuario desde la sesión
    const nivelAcceso = req.session.user.nivel_acceso;

    // Redirige según el nivel de acceso del usuario
    if (nivelAcceso === 'administrador') {
        return res.redirect('/bienvenida_admin'); // Redirige al panel de administrador
    } else if (nivelAcceso === 'estudiante') {
     
        return res.redirect('/bienvenida'); // Redirige a una página por defecto
    }
});


module.exports = router;
