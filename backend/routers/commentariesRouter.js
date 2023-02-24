const commentariesController = require('../controllers/commentariesController');
const bodyValidation = require('../middlewares/bodyValidation');
const { commentariesValidator } = require('../validators/commentariesValidator');
const authentificate = require('../middlewares/authentificate');

const commentariesRouter = require('express').Router();

commentariesRouter.route('/')
    .get(authentificate(), commentariesController.getAll)
    .post(authentificate(), bodyValidation(commentariesValidator), commentariesController.add)
    .all((req, res) => res.sendStatus(405));

commentariesRouter.route('/:id([0-9]+)')
    .get(authentificate(), commentariesController.getOne)
    .put(authentificate(), bodyValidation(commentariesValidator), commentariesController.update)
    .delete(authentificate(), commentariesController.delete)
    .all((req, res) => res.sendStatus(405));

module.exports = commentariesRouter;