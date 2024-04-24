const tasksController = require('../controllers/tasksController');
const bodyValidation = require('../middlewares/bodyValidation');
const { tasksValidator, tasksAddValidator} = require('../validators/tasksValidator');
const authentificate = require('../middlewares/authentificate');

const tasksRouter = require('express').Router();

tasksRouter.route('/')
    .get(authentificate(), tasksController.getAll)
    .post(authentificate(), bodyValidation(tasksAddValidator), tasksController.add)
    .all((req, res) => res.sendStatus(405));

tasksRouter.route('/:id([0-9]+)')
    .get(authentificate(), tasksController.getOne)
    .put(authentificate(), bodyValidation(tasksAddValidator), tasksController.update)
    .delete(authentificate(), tasksController.delete)
    .all((req, res) => res.sendStatus(405));

module.exports = tasksRouter;
