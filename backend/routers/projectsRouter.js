const projectsController = require('../controllers/projectsController');
const bodyValidation = require('../middlewares/bodyValidation');
const { projectsValidator } = require('../validators/projectsValidator');
const authentificate = require('../middlewares/authentificate');

const projectsRouter = require('express').Router();

projectsRouter.route('/')
    .get(authentificate(), projectsController.getAll)
    .post(authentificate(), bodyValidation(projectsValidator), projectsController.add)
    .all((req, res) => res.sendStatus(405));

projectsRouter.route('/:id([0-9]+)')
    .get(authentificate(), projectsController.getOne)
    .put(authentificate(), bodyValidation(projectsValidator), projectsController.update)
    .delete(authentificate(), projectsController.delete)
    .all((req, res) => res.sendStatus(405));

module.exports = projectsRouter;
