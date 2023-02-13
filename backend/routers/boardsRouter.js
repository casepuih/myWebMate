const boardsController = require('../controllers/boardsController');
const bodyValidation = require('../middlewares/bodyValidation');
const { boardsValidator } = require('../validators/boardsValidator');
const authentificate = require('../middlewares/authentificate');

const boardsRouter = require('express').Router();

boardsRouter.route('/')
    .get(authentificate(), boardsController.getAll)
    .post(authentificate(), bodyValidation(boardsValidator), boardsController.add)
    .all((req, res) => res.sendStatus(405));

boardsRouter.route('/:id([0-9]+)')
    .get(authentificate(), boardsController.getOne)
    .put(authentificate(), bodyValidation(boardsValidator), boardsController.update)
    .delete(authentificate(), boardsController.delete)
    .all((req, res) => res.sendStatus(405));

module.exports = boardsRouter;
