const NewsLetterControllerBrevo = require("../controllers/newsletter.controller");

const Router = require("express").Router();

Router.post("/", NewsLetterControllerBrevo.createContact);

module.exports = Router;
