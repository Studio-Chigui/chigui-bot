const { app } = require('./index');
const client = require('./bot');
const { exec } = require('child_process');

// Inicia el servidor en el puerto 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Servidor Express escuchando en el puerto ${PORT}`);
});

// Ejecuta el script de registro de comandos
console.log('Ejecutando deploy-commands.js...');
exec('node deploy-commands.js', (error, stdout, stderr) => {
    if (error) {
        console.error(`Error al ejecutar deploy-commands.js: ${error.message}`);
        return;
    }
    if (stderr) {
        console.error(`stderr: ${stderr}`);
        return;
    }
    console.log(`stdout: ${stdout}`);
});
