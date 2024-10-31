// server.js
const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const port = 3001;

// Claves VAPID generadas
// const vapidKeys = webpush.generateVAPIDKeys();
const publicVapidKey = "CAMBIAR POR LAS DE USTEDES";
const privateVapidKey = "CAMBIAR POR LAS DE USTEDES";

// Configura VAPID
webpush.setVapidDetails(
  "mailto:correo@correo.com",
  publicVapidKey,
  privateVapidKey
);

// Middleware
app.use(bodyParser.json());
app.use(cors({ origin: "http://localhost:5173" })); // Cambia el puerto si es diferente

// Almacenar suscripciones
const subscriptions = [];

// Ruta para recibir la suscripción desde el frontend
app.post("/subscribe", (req, res) => {
  const subscription = req.body;
  subscriptions.push(subscription);
  res.status(201).json({});
  console.log("Nueva suscripción guardada:", subscription);
});

// Ruta para enviar notificaciones push
app.post("/send-notification", (req, res) => {
  const notificationPayload = {
    title: "Ejemplo de Notificación",
    message: "Este es un mensaje de prueba desde el servidor!",
  };

  const promises = subscriptions.map((subscription) =>
    webpush.sendNotification(subscription, JSON.stringify(notificationPayload))
  );

  Promise.all(promises)
    .then(() => res.status(200).json({ message: "Notificación enviada!" }))
    .catch((error) => {
      console.error("Error enviando notificación:", error);
      res.sendStatus(500);
    });
});

app.listen(port, () => {
  console.log(`Servidor iniciado en http://localhost:${port}`);
});
