const notesController = require('../controllers/notesController');
const bodyValidation = require('../middlewares/bodyValidation');
const { notesValidator } = require('../validators/notesValidator');
const authentificate = require('../middlewares/authentificate');

const notesRouter = require('express').Router();

notesRouter.route('/')
    .get(authentificate(), notesController.getAll)
    .post(authentificate(), bodyValidation(notesValidator), notesController.add)
    .all((req, res) => res.sendStatus(405));

notesRouter.route('/:id([0-9]+)')
    .get(authentificate(), notesController.getOne)
    .put(authentificate(), bodyValidation(notesValidator), notesController.update)
    .delete(authentificate(), notesController.delete)
    .all((req, res) => res.sendStatus(405));

module.exports = notesRouter;
