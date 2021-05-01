"use strict";

const https = require("https");
const http = require("http");
const fs = require("fs");

const sslkey = fs.readFileSync("ssl-key.pem");
const sslcert = fs.readFileSync("ssl-cert.pem");

const options = {
  key: sslkey,
  cert: sslcert,
};

const httpsRedirect = (req, res) => {
  res.writeHead(301, { Location: "https://localhost:8000" + req.url });
  res.end();
};

const localhost = (app, httpsPort, httpPort) => {
  console.log("Localhost Environment");
  https.createServer(options, app).listen(httpsPort);
  http.createServer(httpsRedirect).listen(httpPort);
};

module.exports = localhost;

