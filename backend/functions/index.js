const { onRequest } = require("firebase-functions/v2/https");
const express = require("express");
const admin = require("firebase-admin");

const app = express();

// Inicializar o Firebase Admin apenas se ainda não foi inicializado
if (!admin.apps.length) {
  admin.initializeApp();
  console.log("Firebase admin initialized");
} else {
  admin.app();
}

const ticketRoutes = require("./routes/ticketRoutes");
const authRoutes = require("./routes/authRoutes");

app.use("/tickets", ticketRoutes);
app.use("/auth", authRoutes);
app.get("/", (req, res) => {
  res.status(200).send("Hello from Firebase!");
});

exports.api = onRequest(app);
