const express = require('express');
const db = require('../config/conexion');
const router = express.Router();

// Obtener todos los usuarios
router.get('/ver-usuarios', (req, res) => {
    db.query('SELECT * FROM users', (error, results) => {
        if (error) {
            return res.status(500).send('Error al obtener usuarios');
        }
        res.render('ver_usuarios', { usuarios: results });
    });
});

// Eliminar un usuario
router.post('/eliminar-usuario/:id', (req, res) => {
    const { id } = req.params;
    db.query('DELETE FROM users WHERE id = ?', [id], (error) => {
        if (error) {
            return res.status(500).send('Error al eliminar el usuario');
        }
        res.redirect('/ver-usuarios');
    });
});

// Actualizar un usuario
const bcrypt = require('bcrypt');

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



module.exports = router;
