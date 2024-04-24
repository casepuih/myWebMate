const memberController = require('../controllers/memberController');
const bodyValidation = require('../middlewares/bodyValidation');
const { memberProfilValidator, memberPasswordChange, memberEmailChange} = require('../validators/memberValidator');
const authentificate = require('../middlewares/authentificate');

const memberRouter = require('express').Router();

memberRouter.route('/')
    .get(authentificate(), memberController.getOne)
    .all((req, res) => res.sendStatus(405));

memberRouter.route('/:id([0-9]+)')
    .put(authentificate(), bodyValidation(memberProfilValidator), memberController.update)
    .post(authentificate(), bodyValidation(memberPasswordChange), memberController.updatePassword)
    .all((req, res) => res.sendStatus(405));

memberRouter.route('/email/:id([0-9]+)')
    .put(authentificate(), bodyValidation(memberEmailChange), memberController.updateEmail)
    .all((req, res) => res.sendStatus(405));

module.exports = memberRouter;