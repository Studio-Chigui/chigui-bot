// bot.js

const { Client, GatewayIntentBits, EmbedBuilder } = require('discord.js');
const axios = require('axios');
require('dotenv').config();
const { setBotActive } = require('./index');

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
    ]
});

const token = process.env.DISCORD_TOKEN;
const githubToken = process.env.GITHUB_TOKEN;
const repoOwner = 'Studio-Chigui';
const repoName = 'Rise-of-kingdom';

client.once('ready', () => {
    console.log(`¡Listo! Iniciado sesión como ${client.user.tag}`);
    setBotActive(true);
});

client.on('disconnect', () => {
    console.log('Bot desconectado');
    setBotActive(false);
});

client.on('messageCreate', async message => {
    if (message.content.startsWith('!report')) {
        const args = message.content.split(' ');
        const branch = args[1] || 'dev'; // Si no se especifica rama, usa 'dev' por defecto

        // Simula que el bot está escribiendo
        await message.channel.sendTyping();

        try {
            const response = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/commits?sha=${branch}`, {
                headers: {
                    'Authorization': `token ${githubToken}`
                }
            });

            const commits = response.data;
            if (commits.length === 0) {
                message.channel.send(`No hay commits recientes en la rama '${branch}'.`);
                return;
            }

            const userAvatar = message.author.avatarURL() || 'https://github.com/identicons/default.png';

            const embed = new EmbedBuilder()
                .setColor('#0099ff')
                .setTitle(`Últimos commits en la rama '${branch}'`)
                .setThumbnail(userAvatar) 
                .setTimestamp()
                .setFooter({ text: `Solicitado por ${message.author.tag}`, iconURL: userAvatar });

            commits.slice(0, 5).forEach(commit => {
                const author = commit.commit.author.name;
                const commitDate = new Date(commit.commit.author.date).toLocaleString();
                const commitMessage = commit.commit.message;

                embed.addFields({
                    name: `${author} - ${commitDate}`,
                    value: commitMessage,
                    inline: false
                });
            });

            message.channel.send({ embeds: [embed] });
        } catch (error) {
            console.error('Error al obtener los commits:', error);
            message.channel.send('Hubo un problema al obtener los commits.');
        }
    }
});

client.login(token);

module.exports = client;
