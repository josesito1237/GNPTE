const express = require('express');
const session = require('express-session');
const app = express();
const registroRoutes = require('./rutas/registro');
const verInformacionUsuarioRoutes = require('./rutas/verinformacionusuario');
const tareasRoutes = require('./rutas/tareasRoutes'); // Rutas de tareas
const proyectosRoutes = require('./rutas/proyectosRoutes'); // Rutas de proyectos
const notasRoutes = require('./rutas/notas'); // Rutas de notas
const vistaAdminUsersRoutes = require('./rutas/vista_admin_users');
const tareAdminRoutes = require('./rutas/tareadmin'); // Importar rutas de tareas para admin
const proyectoadminRoutes = require('./rutas/proyectoadmin'); // Importar rutas de proyectos para admin

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// Configuración de sesiones
app.use(session({ 
    secret: 'mi_secreto', 
    resave: false, 
    saveUninitialized: true,
    cookie: { secure: false } // Cambiar a true si usas HTTPS
}));


// Uso de rutas
app.use(vistaAdminUsersRoutes);
app.use('/ver', verInformacionUsuarioRoutes);
app.use('/tareas', tareasRoutes); // Usar la ruta de tareas
app.use('/proyectos', proyectosRoutes); // Usar la ruta de proyectos
app.use('/notas', notasRoutes); // Usar la ruta de notas
app.use('/tareadmin', tareAdminRoutes); // Usar rutas de tareas admin
app.use('/proyectoadmin', proyectoadminRoutes); // Usar rutas de proyectos admin
app.use('/', registroRoutes);


// Redirección a la página de inicio
app.get('/', (req, res) => {
    res.render('inicio'); // Renderiza la vista de inicio
});

// Ruta específica para la vista de administrador
app.get('/bienvenida_admin', (req, res) => {
    res.render('bienvenida_admin'); // Renderiza la vista de bienvenida del administrador
});

// Rutas para estudiantes
app.get('/tareas', (req, res) => {
    if (req.session.role === 'estudiante') {
        res.redirect('/tareas/ver_tareas'); // Redirigir estudiantes a ver tareas
    } else {
        res.redirect('/bienvenida_admin'); // Redirigir administradores a la vista correspondiente
    }
});

app.get('/proyectos', (req, res) => {
    if (req.session.role === 'estudiante') {
        res.redirect('/proyectos/ver_proyectos'); // Redirigir estudiantes a ver proyectos
    } else {
        res.redirect('/bienvenida_admin'); // Redirigir administradores a la vista correspondiente
    }
});

// Ruta para la página "acerca"
app.get('/acerca', (req, res) => {
    res.render('acerca'); // Renderiza la vista acerca
});


// Iniciar el servidor
app.listen(3000, () => console.log('Servidor en http://localhost:3000'));
