const notepadController = require('../controllers/notepadController');
const bodyValidation = require('../middlewares/bodyValidation');
const { notepadValidator } = require('../validators/notepadValidator');
const authentificate = require('../middlewares/authentificate');

const notepadRouter = require('express').Router();

notepadRouter.route('/')
    .get(authentificate(), notepadController.getOne)
    .post(authentificate(), bodyValidation(notepadValidator), notepadController.update)
    .all((req, res) => res.sendStatus(405));

module.exports = notepadRouter;