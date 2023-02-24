const { InvalidBodyErrorResponse, ErrorResponse } = require('../api-responses/errorResponse');
const { SuccessResponse } = require('../api-responses/successResponse');
const labelsService = require('../services/labelsService');

const labelsController = {
    getAll: async (req, res) => {
        const labels = await labelsService.getAll(req.user.id);

        res.status(200).json(new SuccessResponse(labels));
    },

    getOne: async (req, res) => {
        const labels = await labelsService.getOne(req.params.id);

        res.status(200).json(new SuccessResponse(labels));
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

        const label = await labelsService.add(data);

        res.status(201).json(new SuccessResponse(label));
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

        const member = await labelsService.getMemberIdFromOneLabel(id);

        if (member.labels.MemberId !== req.user.id) {
            res.status(403).json(new ErrorResponse(
                `This is not your label !!`
            ))

            return;
        }

        const labels = await labelsService.update(id, data);

        if (!labels) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    },
    delete: async (req, res) => {
        const id = req.params.id;

        const member = await labelsService.getMemberIdFromOneLabel(id);

        if (member.labels.MemberId !== req.user.id) {
            res.status(403).json(new ErrorResponse(
                `This is not your label !!`
            ))

            return;
        }

        const isDeleted = await labelsService.delete(id);

        if (!isDeleted) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    }

};

module.exports = labelsController;