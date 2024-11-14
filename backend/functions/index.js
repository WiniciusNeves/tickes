const { onRequest } = require("firebase-functions/v2/https");
const express = require("express");
const admin = require("firebase-admin");

const app = express();


if (!admin.apps.length) {
    admin.initializeApp(); 
} else {
    admin.app();
}

const db = admin.firestore();

// Importação das rotas
const ticketRoutes = require('./routes/ticketRoutes'); // Certifique-se de que o caminho está correto
const authRoutes = require('./routes/authRoutes'); // Certifique-se de que o caminho está correto

// Usando as rotas no app Express
app.use('/tickets', ticketRoutes);
app.use('/auth', authRoutes);

app.get('/', (req, res) => {
    res.status(200).send('Hello from Firebase!');
});

exports.api = onRequest(app); // Definindo a função como um endpoint do Firebase Functions
