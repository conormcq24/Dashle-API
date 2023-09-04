// firebaseAdmin.js
const admin = require('firebase-admin');
const serviceAccount = require(process.env.SERVICE_ACCOUNT_PATH);

if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

module.exports = admin;