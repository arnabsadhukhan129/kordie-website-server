const crypto = require('crypto');
const date = new Date();
// date.setSeconds(0);
// date.setMilliseconds(0);
// date.setUTCSeconds(0);
// date.setUTCMilliseconds(0);
const API_KEY = "669A04AA68377140";
const headers = {
    'x-mm-package': 'app.mm.com',
    'x-mm-date': date.toISOString(),
    'x-mm-session-id': 'MMSID20240222180014',
    'x-mm-csrf-key': crypto.randomBytes(8).toString('hex').toUpperCase()
};

console.log("Header:", headers);

const sortedKeys = Object.keys(headers).sort((a, b) => {
    if(a < b) return -1;
    if(a > b) return 1;
    return 0;
});
console.log("Header Sorted:", sortedKeys);

const sortedHeaderStringtoBeSign = sortedKeys.map(s => `${s}=${headers[s]}`).join(';');
console.log("Signed String:", sortedHeaderStringtoBeSign);

const signedHash = crypto.createHmac('sha256', API_KEY).update(sortedHeaderStringtoBeSign).digest('hex');
console.log("Signed Hash:", signedHash);

// from csrf
const signature = crypto.createHmac('sha256', headers['x-mm-csrf-key']).update(signedHash).digest('hex');

console.log("Signature:", signature);



