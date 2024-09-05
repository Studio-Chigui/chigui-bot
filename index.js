// index.js

const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();

let botActive = false;

app.use(bodyParser.json());

app.use(express.static(path.join(__dirname, 'public')));

app.post('/webhook', (req, res) => {
    const commitData = req.body;
    console.log('Commit recibido:', commitData);
    res.status(200).send('Webhook recibido');
});

app.get('/status', (req, res) => {
    res.json({ active: botActive });
});

module.exports = {
    app,
    setBotActive: (status) => { botActive = status; }
};
