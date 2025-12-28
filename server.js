const http = require('http');
const https = require('https');
const fs = require('fs');
const chalk = require('chalk');

const app = require('./app/app');
const { envs } = require('./lib');

const CERT_FILE = process.env.CERT_FILE;
const KEY_FILE = process.env.KEY_FILE;
const CA_FILES = [process.env.CA_BUNDLE];
let server;
if(process.env.APP_SECURE === 'false') {
  server = http.createServer(app);
} else {
  const serverOptions = {
    // Change the path to the key and certificate when in production
      key: fs.readFileSync(KEY_FILE),
      cert: fs.readFileSync(CERT_FILE),
      ca:CA_FILES.map(ca => fs.readFileSync(ca)),
      requestCert: true,
      rejectUnauthorized: false
    };
    server = https.createServer(serverOptions, app);
}
const PORT = process.env.PORT || 3001;
server.listen(PORT, () => {
  console.log(`Server is running on ${PORT}.`);
  console.log(chalk.blueBright('Token security layer is %s'), envs.isXTokenLayerEnable() ? 'ON' : 'OFF');
});