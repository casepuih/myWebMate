const { InvalidBodyErrorResponse, ErrorResponse} = require('../api-responses/errorResponse');
const { SuccessResponse } = require('../api-responses/successResponse');
const notesService = require('../services/notesService');

const notesController = {
    getAll: async (req, res) => {
        const notes = await notesService.getAll(req.user.id);

        res.status(200).json(new SuccessResponse(notes));
    },

    getOne: async (req, res) => {
        const notes = await notesService.getOne(req.params.id);

        res.status(200).json(new SuccessResponse(notes));
    },

    add: async (req, res) => {
        const data = req.validateData;
        data.MemberId = req.user.id;

        if (!data.title) {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'Title is required'
                }
            ));
            return;
        }

        const note = await notesService.add(data);

        res.status(201).json(new SuccessResponse(note));
    },
    update: async (req, res) => {
        const id = req.params.id;
        const data = req.validateData;

        if (!data.title) {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'Title is required'
                }
            ));
            return;
        }

        const member = await notesService.getMemberIdFromOneNote(id);

        if (member.notes.MemberId !== req.user.id) {
            res.status(403).json(new ErrorResponse(
                `This is not your note !!`
            ))

            return;
        }

        const notes = await notesService.update(id, data);

        if (!notes) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    },
    delete: async (req, res) => {
        const id = req.params.id;

        const member = await notesService.getMemberIdFromOneNote(id);

        if (member.notes.MemberId !== req.user.id) {
            res.status(403).json(new ErrorResponse(
                `This is not your note !!`
            ))

            return;
        }

        const isDeleted = await notesService.delete(id);

        if (!isDeleted) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    }

};

module.exports = notesController;