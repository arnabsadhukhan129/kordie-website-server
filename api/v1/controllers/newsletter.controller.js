const brevoClient = require("../../../connectors/brevo.connector");
const { BadRequestError } = require("../../../errors/http/http.errors");

const NewsLetterControllerBrevo = {
  async createContact(req, res, next) {
    try {
      const { Brevo, defaultClient } = brevoClient;
      const email = req.body.email;
      if (!email) {
        throw new BadRequestError("Invalid Email Id");
      }
      const apiInstance = new Brevo.ContactsApi();
      const createContact = new Brevo.CreateContact();
      createContact.email = email.trim();
      const response = await apiInstance.createContact(createContact);
      next({ message: "Newsletter Subscribed Successfully" });
    } catch (e) { 
      e.message = e?.response?.body?.message || "Invalid Email Address";
      new Error(e)
      next(e);
    }
  },
};

module.exports = NewsLetterControllerBrevo;
