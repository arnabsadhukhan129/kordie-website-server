const addressController = require("../controllers/address.controller");

const Router = require("express").Router();

Router.get('/:type?', addressController.getAllCountryStateCity);

module.exports = Router;