const groupsMembersController = require('../controllers/groupsMembersController');
const bodyValidation = require('../middlewares/bodyValidation');
const { groupsMembersValidator } = require('../validators/groupsMembersValidator');
const authentificate = require('../middlewares/authentificate');

const groupsMembersRouter = require('express').Router();

groupsMembersRouter.route('/')
    .get(authentificate(), groupsMembersController.getAll)
    .post(authentificate(), bodyValidation(groupsMembersValidator), groupsMembersController.add)
    .all((req, res) => res.sendStatus(405));

groupsMembersRouter.route('/:id([0-9]+)')
    .put(authentificate(), bodyValidation(groupsMembersValidator), groupsMembersController.update)
    .delete(authentificate(), groupsMembersController.delete)
    .all((req, res) => res.sendStatus(405));

module.exports = groupsMembersRouter;