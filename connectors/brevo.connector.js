const Brevo = require("sib-api-v3-sdk");
const defaultClient = Brevo.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY || null;
const partnerKey = defaultClient.authentications["partner-key"];
partnerKey.apiKey = process.env.BREVO_API_KEY || null;

module.exports = {
   Brevo,
   defaultClient
 };