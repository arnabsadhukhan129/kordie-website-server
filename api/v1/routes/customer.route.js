const express = require("express");
const router = express.Router();
const customerController = require("../controllers/customer.controller");
const { RegisterMiddleware } = require("../middlewares");

router.post("/", customerController.createCustomer);
router.get("/:customer_key?", customerController.listCustomer);
router.put(
  "/",
  RegisterMiddleware.emailCheckOnUpdate,
  customerController.updateCustomer
);
router.delete("/:customer_id?", customerController.deleteCustomer);
router.patch("/:customer_id?", customerController.blockCustomer);
router.put("/comment", customerController.sendPrivateComment);
router.get("/comment/:customer_id?", customerController.listComments);
router.get("/newsletter/list", customerController.newsletterCustomer);
router.get("/non-customer/list", customerController.nonCustomerList);
module.exports = router;
