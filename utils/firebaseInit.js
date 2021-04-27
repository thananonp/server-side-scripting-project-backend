const admin = require("firebase-admin");
const {getStorage, ref} = require('firebase/storage')
const serviceAccount = require("../firebase-private.json");
const {generateRandomName} = require("./function");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    storageBucket: 'gs://sssf-frontend.appspot.com'
});

const authorBucket = admin.storage().bucket()

const uploadPicture = async (createReadStream, filename, mimetype, encoding) => {
    if (!mimetype.toString().startsWith("image/")) {
        console.log("Not Picture")
        throw new Error("Wrong file type")
    } else {
        const randomFileName = filename + generateRandomName
        const file = authorBucket.file(randomFileName)
        return await new Promise((async (resolve, reject) => {
            await createReadStream().pipe(
                file.createWriteStream({
                    metadata: {contentType: mimetype}
                }))
                .on('error', async (err) => {
                    console.log(err)
                    reject(err)
                })
                .on('finish', async () => {
                    const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${authorBucket.name}/o/${encodeURI(file.name)}?alt=media`;
                    resolve(publicUrl)

                })
        }))
    }
}

module.exports = {authorBucket, uploadPicture}