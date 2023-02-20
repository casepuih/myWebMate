const { ErrorResponse, InvalidBodyErrorResponse } = require('../api-responses/errorResponse');
const { SuccessCollectionResponse, SuccessResponse } = require('../api-responses/successResponse');
const groupsService = require('../services/groupsService');

const groupsController = {
    getAll: async (req, res) => {
        const groups = await groupsService.getAll(req.user.id);

        res.status(200).json(new SuccessCollectionResponse(groups));
    },

    add: async (req, res) => {
        const data = req.validateData;
        console.log("dataaaaaaa ");
        data.MemberId = req.user.id;

        if (!data.name && !data.description) {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'Name and Description is required'
                }
            ));
            return;
        }

        const group = await groupsService.add(data);

        res.json(new SuccessResponse(group));
    },
    update: async (req, res) => {
        const id = req.params.id;
        const data = req.validateData;

        if (!data.name && !data.description) {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'Name and Link is required'
                }
            ));
            return;
        }

        if (!req.user.id) {
            res.status(403).json(new ErrorResponse(
                `Connexion required`
            ))

            return;
        }

        const member = await groupsService.getMemberIdFromOneLink(id);

        if (member.groups.MemberId !== req.user.id) {
            res.status(403).json(new ErrorResponse(
                `This is not your group !!`
            ))

            return;
        }

        const groups = await groupsService.update(id, data);

        if (!groups) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    },
    delete: async (req, res) => {
        const id = req.params.id;

        const member = await groupsService.getMemberIdFromOneLink(id);

        if (member.groups.MemberId !== req.user.id) {
            res.status(403).json(new ErrorResponse(
                `This is not your group !!`
            ))

            return;
        }

        const isDeleted = await groupsService.delete(id);

        if (!isDeleted) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    }
};

module.exports = groupsController;