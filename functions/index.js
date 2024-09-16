const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

// CRM: Add User
exports.addUser = functions.https.onCall((data, context) => {
    return admin.auth().createUser({
        email: data.email,
        password: data.password
    }).then(userRecord => {
        return { message: 'User created successfully', uid: userRecord.uid };
    }).catch(error => {
        return { error: error.message };
    });
});

// ERP: Add Product
exports.addProduct = functions.https.onCall((data, context) => {
    return admin.firestore().collection('products').add({
        name: data.name,
        price: data.price,
        stock: data.stock
    }).then(docRef => {
        return { message: 'Product added successfully', id: docRef.id };
    }).catch(error => {
        return { error: error.message };
    });
});
