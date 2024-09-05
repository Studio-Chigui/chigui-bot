const { Client, REST, Routes } = require('discord.js');
require('dotenv').config();

const clientId = process.env.CLIENT_ID;
const guildId = process.env.GUILD_ID;
const token = process.env.DISCORD_TOKEN;

const commands = [
    {
        name: 'ping',
        description: 'Responde con Pong!',
    },
    {
        name: 'report',
        description: 'Muestra los commits recientes en una rama específica.',
        options: [
            {
                name: 'branch',
                type: 3, // STRING
                description: 'La rama para consultar.',
                required: false,
            },
        ],
    },
];

const rest = new REST({ version: '10' }).setToken(token);

(async () => {
    try {
        console.log('Registrando comandos Slash...');

        await rest.put(Routes.applicationGuildCommands(clientId, guildId), {
            body: commands,
        });

        console.log('Comandos registrados exitosamente!');
    } catch (error) {
        console.error('Error al registrar comandos:', error);
    }
})();
