const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

exports.createOrder = functions.https.onRequest((req, res) => {
  const orderData = req.body;
  // Process order, save to Firebase Firestore or Realtime Database
  res.status(200).send({ message: "Order created successfully!" });
});
