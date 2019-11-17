const express = require("express");
const router = express.Router();
const validation = require("./validation");
const userController = require("../controllers/userController");
const stripeController = require("../controllers/stripeController");



router.get("/users/signup", userController.signUp)
router.post("/users/signup", validation.validateUsers, userController.create);
router.get("/users/sign_in", userController.signInForm);
router.post("/users/sign_in", validation.validateUsers, userController.signIn);
router.get("/users/sign_out", userController.signOut);

router.get("/users/stripe_form", stripeController.checkout);
router.post("/charge", stripeController.charge);
router.get("/users/account", stripeController.manage);
router.post("/downgrade", stripeController.downgrade);



module.exports = router;
