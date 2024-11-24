const express = require('express'); 
const db = require('../config/conexion');
const router = express.Router();

// Middleware para verificar si el usuario está autenticado
const verificarAutenticacion = (req, res, next) => {
    if (!req.session || !req.session.user) {
        return res.redirect('/login');
    }
    next();
};

// Ruta para mostrar las tareas
router.get('/', verificarAutenticacion, (req, res) => {
    const query = 'SELECT * FROM tareas WHERE user_id = ?';
    db.query(query, [req.session.user.id], (error, results) => {
        if (error) {
            console.error('Error al obtener tareas:', error);
            return res.status(500).send('Error al obtener tareas');
        }
        res.render('tareas', { tareas: results });
    });
});

// Ruta para agregar una nueva tarea
router.post('/agregar', verificarAutenticacion, (req, res) => {
    const { titulo, descripcion, fecha_entrega, hora_entrega } = req.body;

    if (!titulo || !descripcion || !fecha_entrega || !hora_entrega) {
        return res.status(400).send('Todos los campos son requeridos');
    }

    const query = 'INSERT INTO tareas (titulo, descripcion, fecha_entrega, hora_entrega, user_id) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [titulo, descripcion, fecha_entrega, hora_entrega, req.session.user.id], (error) => {
        if (error) {
            console.error('Error al agregar tarea:', error);
            return res.status(500).send('Error al agregar tarea');
        }
        res.redirect('/tareas');
    });
});

// Ruta para editar una tarea
router.post('/editar/:id_tareas', verificarAutenticacion, (req, res) => {
    const { id_tareas } = req.params;
    const { titulo, descripcion, fecha_entrega, hora_entrega } = req.body;

    if (!titulo || !descripcion || !fecha_entrega || !hora_entrega) {
        return res.status(400).send('Todos los campos son requeridos');
    }

    const query = 'UPDATE tareas SET titulo = ?, descripcion = ?, fecha_entrega = ?, hora_entrega = ? WHERE id_tareas = ? AND user_id = ?';
    db.query(query, [titulo, descripcion, fecha_entrega, hora_entrega, id_tareas, req.session.user.id], (error) => {
        if (error) {
            console.error('Error al editar tarea:', error);
            return res.status(500).send('Error al editar tarea');
        }
        res.redirect('/tareas');
    });
});

// Ruta para eliminar una tarea
router.post('/eliminar/:id_tareas', verificarAutenticacion, (req, res) => {
    const { id_tareas } = req.params;

    const query = 'DELETE FROM tareas WHERE id_tareas = ? AND user_id = ?';
    db.query(query, [id_tareas, req.session.user.id], (error) => {
        if (error) {
            console.error('Error al eliminar tarea:', error);
            return res.status(500).send('Error al eliminar tarea');
        }
        res.redirect('/tareas');
    });
});

module.exports = router;
