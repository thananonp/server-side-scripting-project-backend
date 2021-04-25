const admin = require("firebase-admin");

const serviceAccount = require("../firebase-private.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://sssf-frontend.appspot.com'
});

const bucket  = admin.storage().bucket()

module.exports = {bucket}