const groupsController = require('../controllers/groupsController');
const bodyValidation = require('../middlewares/bodyValidation');
const { groupsValidator } = require('../validators/groupsValidator');
const authentificate = require('../middlewares/authentificate');

const groupsRouter = require('express').Router();

groupsRouter.route('/')
    .get(authentificate(), groupsController.getAll)
    .post(authentificate(), bodyValidation(groupsValidator), groupsController.add)
    .all((req, res) => res.sendStatus(405));

groupsRouter.route('/:id([0-9]+)')
    .put(authentificate(), bodyValidation(groupsValidator), groupsController.update)
    .delete(authentificate(), groupsController.delete)
    .all((req, res) => res.sendStatus(405));

module.exports = groupsRouter;