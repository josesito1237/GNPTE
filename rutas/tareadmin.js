const express = require('express');
const db = require('../config/conexion');
const router = express.Router();

router.get('/', (req, res) => {
    db.query('SELECT * FROM tareas', (error, results) => {
        if (error) {
            return res.status(500).send('Error al obtener las tareas');
        }
        res.render('ver_tareas', { tareas: results });
    });
});

module.exports = router;
