const linksGroupController = require('../controllers/linksGroupController');
const bodyValidation = require('../middlewares/bodyValidation');
const { linksGroupValidator } = require('../validators/linksGroupValidator');
const authentificate = require('../middlewares/authentificate');

const linksGroupRouter = require('express').Router();

linksGroupRouter.route('/')
    .get(authentificate(), linksGroupController.getAll)
    .post(authentificate(), bodyValidation(linksGroupValidator), linksGroupController.add)
    .all((req, res) => res.sendStatus(405));

linksGroupRouter.route('/:id([0-9]+)')
    .put(authentificate(), bodyValidation(linksGroupValidator), linksGroupController.update)
    .delete(authentificate(), linksGroupController.delete)
    .all((req, res) => res.sendStatus(405));

module.exports = linksGroupRouter;