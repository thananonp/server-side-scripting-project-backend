"use strict";

const admin = require("firebase-admin");
const serviceAccount = require("../firebase-private.json");
const { generateRandomName } = require("./function.js");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "gs://sssf-frontend.appspot.com",
});

const authorBucket = admin.storage().bucket();

const deletePicture = async (name) => {
  authorBucket
    .file(name.substr(72).slice(0, -10))
    .delete()
    .then((data) => {})
    .catch((e) => {
      console.error("err");
    });
};

const uploadPicture = async (
  createReadStream,
  filename,
  mimetype,
  encoding
) => {
  if (!mimetype.toString().startsWith("image/")) {
    throw new Error("Wrong file type");
  } else {
    const randomFileName = generateRandomName + filename;
    const file = authorBucket.file(randomFileName);
    return await new Promise(async (resolve, reject) => {
      await createReadStream()
        .pipe(
          file.createWriteStream({
            metadata: { contentType: mimetype },
          })
        )
        .on("error", async (err) => {
          reject(err);
        })
        .on("finish", async () => {
          const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${
            authorBucket.name
          }/o/${encodeURI(file.name)}?alt=media`;
          resolve(publicUrl);
        });
    });
  }
};

module.exports = { authorBucket, uploadPicture, deletePicture };
