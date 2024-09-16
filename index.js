const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.createOrder = functions.https.onRequest((req, res) => {
  const orderData = req.body;
  // Process order, save to Firestore
  admin.firestore().collection('orders').add(orderData).then(() => {
    res.status(200).send({ message: "Order created successfully!" });
  }).catch((error) => {
    res.status(500).send({ error: error.message });
  });
});
