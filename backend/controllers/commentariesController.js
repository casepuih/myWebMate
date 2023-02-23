const { InvalidBodyErrorResponse, ErrorResponse } = require('../api-responses/errorResponse');
const { SuccessResponse } = require('../api-responses/successResponse');
const commentariesService = require('../services/commentariesService');

const commentariesController = {
    getAll: async (req, res) => {
        const commentaries = await commentariesService.getAll(req.user.id);

        res.status(200).json(new SuccessResponse(commentaries));
    },

    getOne: async (req, res) => {
        const commentaries = await commentariesService.getOne(req.params.id);

        res.status(200).json(new SuccessResponse(commentaries));
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

        const commentarie = await commentariesService.add(data);

        res.status(201).json(new SuccessResponse(commentarie));
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

        const member = await commentariesService.getMemberIdFromCommentary(id);

        if (member.commentaries.memberId !== req.user.id) {
            res.status(403).json(new ErrorResponse(
                `This is not your commentarie !!`
            ))

            return;
        }

        const commentaries = await commentariesService.update(id, data);

        if (!commentaries) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    },
    delete: async (req, res) => {
        const id = req.params.id;

        const member = await commentariesService.getMemberIdFromCommentary(id);

        if (member.commentaries.memberId !== req.user.id) {
            res.status(403).json(new ErrorResponse(
                `This is not your commentarie !!`
            ))

            return;
        }

        const isDeleted = await commentariesService.delete(id);

        if (!isDeleted) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    }

};

module.exports = commentariesController;