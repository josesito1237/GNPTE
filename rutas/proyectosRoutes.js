const express = require('express');
const router = express.Router();
const db = require('../config/conexion');
const multer = require('multer');
const path = require('path');

// Configuración de multer para almacenamiento de imágenes
const storage = multer.diskStorage({
    destination: path.join(__dirname, '../public/images'),
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage });

// Middleware para verificar autenticación
function verificarAutenticacion(req, res, next) {
    if (!req.session || !req.session.user || !req.session.user.id) {
        return res.status(401).send('Error: Usuario no autenticado. Inicia sesión para agregar un proyecto.');
    }
    next();
}

// Ruta para mostrar los proyectos del usuario autenticado
router.get('/', verificarAutenticacion, (req, res) => {
    const user_id = req.session.user.id; // Obtener el ID del usuario de la sesión
    const query = 'SELECT * FROM proyectos WHERE user_id = ?'; // Filtrar proyectos por user_id
    db.query(query, [user_id], (error, resultados) => {
        if (error) {
            console.error('Error al obtener proyectos:', error);
            return res.status(500).send('Error al obtener proyectos');
        }
        res.render('proyectos', { proyectos: resultados });
    });
});

// Ruta para agregar un nuevo proyecto
router.post('/agregar', verificarAutenticacion, upload.single('imagen'), (req, res) => {
    const { titulo, descripcion, fecha_entrega, hora_entrega, grupo } = req.body;
    const imagen = req.file ? req.file.filename : null;
    const user_id = req.session.user.id;

    const query = 'INSERT INTO proyectos (titulo, descripcion, fecha_entrega, hora_entrega, grupo, imagen, user_id) VALUES (?, ?, ?, ?, ?, ?, ?)';
    db.query(query, [titulo, descripcion, fecha_entrega, hora_entrega, grupo, imagen, user_id], (error) => {
        if (error) {
            console.error('Error en la consulta de inserción:', error);
            return res.status(500).send('Error al agregar el proyecto');
        }
        res.redirect('/proyectos');
    });
});


// Ruta para editar proyectos
router.post('/editar/:id', verificarAutenticacion, upload.single('imagen'), (req, res) => {
    const { id } = req.params;
    const { titulo, descripcion, fecha_entrega, hora_entrega, grupo } = req.body;
    const imagen = req.file ? req.file.filename : null;

    // Lógica de actualización en la base de datos
    const query = imagen
        ? 'UPDATE proyectos SET titulo = ?, descripcion = ?, fecha_entrega = ?, hora_entrega = ?, grupo = ?, imagen = ? WHERE id_proyectos = ?'
        : 'UPDATE proyectos SET titulo = ?, descripcion = ?, fecha_entrega = ?, hora_entrega = ?, grupo = ? WHERE id_proyectos = ?';

    const params = imagen
        ? [titulo, descripcion, fecha_entrega, hora_entrega, grupo, imagen, id]
        : [titulo, descripcion, fecha_entrega, hora_entrega, grupo, id];

    db.query(query, params, (error) => {
        if (error) {
            console.error('Error al actualizar el proyecto:', error);
            return res.status(500).send('Error al actualizar el proyecto.');
        }
        res.redirect('/proyectos'); // Redirige después de actualizar
    });
});

// Ruta para eliminar un proyecto
router.post('/eliminar/:id', verificarAutenticacion, (req, res) => {
    const { id } = req.params;
    const user_id = req.session.user.id;

    const verificarPropietario = 'SELECT * FROM proyectos WHERE id_proyectos = ? AND user_id = ?';
    db.query(verificarPropietario, [id, user_id], (error, resultados) => {
        if (error || resultados.length === 0) {
            console.error('Error: Proyecto no encontrado o acceso denegado.');
            return res.status(403).send('No tienes permiso para eliminar este proyecto.');
        }

        const query = 'DELETE FROM proyectos WHERE id_proyectos = ?';
        db.query(query, [id], (error) => {
            if (error) {
                console.error('Error al eliminar el proyecto:', error);
                return res.status(500).send('Error al eliminar el proyecto.');
            }
            res.redirect('/proyectos');
        });
    });
});


module.exports = router;