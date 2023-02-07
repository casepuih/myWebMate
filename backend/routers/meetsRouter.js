const meetsController = require('../controllers/meetsController');
const bodyValidation = require('../middlewares/bodyValidation');
const { meetsValidator, meetsAddValidator} = require('../validators/meetsValidator');
const authentificate = require('../middlewares/authentificate');

const meetsRouter = require('express').Router();

meetsRouter.route('/')
    .get(authentificate(), meetsController.getAll)
    .post(authentificate(), bodyValidation(meetsAddValidator), meetsController.add)
    .all((req, res) => res.sendStatus(405));

meetsRouter.route('/:id([0-9]+)')
    .get(authentificate(), meetsController.getOne)
    .put(authentificate(), bodyValidation(meetsValidator), meetsController.update)
    .delete(authentificate(), meetsController.delete)
    .all((req, res) => res.sendStatus(405));

module.exports = meetsRouter;
