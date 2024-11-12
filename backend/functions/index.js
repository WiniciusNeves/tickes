const { onRequest } = require('firebase-functions/v2/https');
const express = require('express');
const admin = require('firebase-admin');

// Inicialize o Firebase Admin
if (!admin.apps.length) {
  admin.initializeApp();
}

const app = express();
app.use(express.json()); // Certifique-se de que o JSON é interpretado

// Importe o roteador de tickets
const ticketRoutes = require('./routes/ticketRoutes.js');

// Use o roteador
app.use('/tickets', ticketRoutes);

// Exporte a função Firebase
exports.api = onRequest(app);
