const linksController = require('../controllers/linksController');
const bodyValidation = require('../middlewares/bodyValidation');
const { linksValidator } = require('../validators/linksValidator');
const authentificate = require('../middlewares/authentificate');

const linksRouter = require('express').Router();

linksRouter.route('/')
    .get(authentificate(), linksController.getAll)
    .post(authentificate(), bodyValidation(linksValidator), linksController.add)
    .all((req, res) => res.sendStatus(405));

linksRouter.route('/:id([0-9]+)')
    .put(authentificate(), bodyValidation(linksValidator), linksController.update)
    .delete(authentificate(), linksController.delete)
    .all((req, res) => res.sendStatus(405));

module.exports = linksRouter;