const labelsController = require('../controllers/labelsController');
const bodyValidation = require('../middlewares/bodyValidation');
const { labelsValidator } = require('../validators/labelsValidator');
const authentificate = require('../middlewares/authentificate');

const labelsRouter = require('express').Router();

labelsRouter.route('/')
    .get(authentificate(), labelsController.getAll)
    .post(authentificate(), bodyValidation(labelsValidator), labelsController.add)
    .all((req, res) => res.sendStatus(405));

labelsRouter.route('/:id([0-9]+)')
    .get(authentificate(), labelsController.getOne)
    .put(authentificate(), bodyValidation(labelsValidator), labelsController.update)
    .delete(authentificate(), labelsController.delete)
    .all((req, res) => res.sendStatus(405));

module.exports = labelsRouter;
