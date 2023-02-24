const { InvalidBodyErrorResponse, ErrorResponse } = require('../api-responses/errorResponse');
const { SuccessResponse } = require('../api-responses/successResponse');
const boardsService = require('../services/boardsService');

const boardsController = {
    getAll: async (req, res) => {
        const boards = await boardsService.getAll(req.user.id);

        res.status(200).json(new SuccessResponse(boards));
    },

    getOne: async (req, res) => {
        const boards = await boardsService.getOne(req.params.id);

        res.status(200).json(new SuccessResponse(boards));
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

        const board = await boardsService.add(data);

        res.status(201).json(new SuccessResponse(board));
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

        const member = await boardsService.getMemberIdFromOneBoard(id);

        if (member.boards.MemberId !== req.user.id) {
            res.status(403).json(new ErrorResponse(
                `This is not your board !!`
            ))

            return;
        }

        const boards = await boardsService.update(id, data);

        if (!boards) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    },
    delete: async (req, res) => {
        const id = req.params.id;

        const member = await boardsService.getMemberIdFromOneBoard(id);

        if (member.boards.MemberId !== req.user.id) {
            res.status(403).json(new ErrorResponse(
                `This is not your board !!`
            ))

            return;
        }

        const isDeleted = await boardsService.delete(id);

        if (!isDeleted) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    }

};

module.exports = boardsController;