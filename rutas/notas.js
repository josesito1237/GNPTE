const express = require('express');
const db = require('../config/conexion'); // Asegúrate de que la ruta es correcta
const router = express.Router();

// Ruta para mostrar las notas
router.get('/', (req, res) => {
    const query = 'SELECT * FROM notas WHERE user_id = ?';
    db.query(query, [req.session.user.id], (error, results) => {
        if (error) {
            return res.status(500).send('Error al obtener notas');
        }
        res.render('notas', { notas: results });
    });
});

// Ruta para agregar una nueva nota
router.post('/agregar', (req, res) => {
    const { titulo, contenido, fecha_entrega } = req.body;
    const query = 'INSERT INTO notas (titulo, contenido, fecha_entrega, user_id) VALUES (?, ?, ?, ?)';
    db.query(query, [titulo, contenido, fecha_entrega, req.session.user.id], (error) => {
        if (error) {
            return res.status(500).send('Error al agregar nota');
        }
        res.redirect('/notas');
    });
});

// Ruta para actualizar una nota
router.post('/editar/:id', (req, res) => {
    const notaId = req.params.id;
    const { titulo, contenido, fecha_entrega } = req.body;

    const query = 'UPDATE notas SET titulo = ?, contenido = ?, fecha_entrega = ? WHERE id_notas = ? AND user_id = ?';
    db.query(query, [titulo, contenido, fecha_entrega, notaId, req.session.user.id], (error) => {
        if (error) {
            return res.status(500).send('Error al actualizar la nota');
        }
        res.redirect('/notas'); // Redirige a la lista de notas después de editar
    });
});

// Ruta para eliminar una nota
router.post('/eliminar/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM notas WHERE id = ? AND user_id = ?';
    db.query(query, [id, req.session.user.id], (error) => {
        if (error) {
            return res.status(500).send('Error al eliminar nota');
        }
        res.redirect('/notas');
    });
});

module.exports = router;
