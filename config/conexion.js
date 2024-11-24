const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',  // Asegúrate de que esta contraseña sea la correcta
    database: 'gestion_x'
});

connection.connect((error) => {
    if (error) throw error;
    console.log('Conexión exitosa a la base de datos');
});

module.exports = connection;
