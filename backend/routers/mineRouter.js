const authentificate = require("../middlewares/authentificate");
const bodyValidation = require("../middlewares/bodyValidation");
const mineController = require("../controllers/mineController");
const {mineValidator} = require("../validators/mineValidator");

const mineRouter = require('express').Router();

mineRouter.route('/easy')
    .get(authentificate(), mineController.getAllEasy)
    .all((req, res) => res.sendStatus(405));

mineRouter.route('/easy/user')
    .get(authentificate(), mineController.getAllEasyFromOneUser)
    .post(authentificate(), bodyValidation(mineValidator), mineController.addEasy)
    .all((req, res) => res.sendStatus(405));

mineRouter.route('/medium')
    .get(authentificate(), mineController.getAllMedium)
    .all((req, res) => res.sendStatus(405));

mineRouter.route('/medium/user')
    .get(authentificate(), mineController.getAllMediumFromOneUser)
    .post(authentificate(), bodyValidation(mineValidator), mineController.addMedium)
    .all((req, res) => res.sendStatus(405));

mineRouter.route('/hard')
    .get(authentificate(), mineController.getAllHard)
    .all((req, res) => res.sendStatus(405));

mineRouter.route('/hard/user')
    .get(authentificate(), mineController.getAllHardFromOneUser)
    .post(authentificate(), bodyValidation(mineValidator), mineController.addHard)
    .all((req, res) => res.sendStatus(405));

module.exports = mineRouter;