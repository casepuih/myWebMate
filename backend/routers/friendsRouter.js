const friendsController = require('../controllers/friendsController');
const bodyValidation = require('../middlewares/bodyValidation');
const authentificate = require('../middlewares/authentificate');
const {friendsAddValidator} = require("../validators/friendsValidator");

const friendsRouter = require('express').Router();

friendsRouter.route('/')
    .get(authentificate(), friendsController.getAll)
    .all((req, res) => res.sendStatus(405));

friendsRouter.route('/invitation')
    .get(authentificate(), friendsController.getAllInvitation)
    .post(authentificate(), bodyValidation(friendsAddValidator), friendsController.addInvitation)
    .all((req, res) => res.sendStatus(405));

friendsRouter.route('/invitation/:id([0-9]+)')
    .post(authentificate(), friendsController.refuseInvitation)
    .put(authentificate(), friendsController.acceptInvitation)
    .delete(authentificate(), friendsController.deleteInvitation)
    .all((req, res) => res.sendStatus(405));

friendsRouter.route('/:id([0-9]+)')
    .delete(authentificate(), friendsController.delete)
    .all((req, res) => res.sendStatus(405));

module.exports = friendsRouter;