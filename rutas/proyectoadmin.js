const express = require('express');
const db = require('../config/conexion');
const router = express.Router();

router.get('/', (req, res) => {
    db.query('SELECT * FROM proyectos', (error, results) => {
        if (error) {
            return res.status(500).send('Error al obtener los proyectos');
        }
        res.render('ver_proyectos', { proyectos: results });
    });
});

module.exports = router;
