const authController = require("../controllers/authController");
const bodyValidation = require("../middlewares/bodyValidation");
const {memberLoginValidator, memberRegisterValidator} = require("../validators/memberValidator");
const authRouter = require('express').Router();

authRouter.route('/login')
    .post(bodyValidation(memberLoginValidator), authController.login);

authRouter.route('/register')
    .post(bodyValidation(memberRegisterValidator), authController.register);

module.exports = authRouter;