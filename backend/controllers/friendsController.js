const { ErrorResponse, InvalidBodyErrorResponse} = require('../api-responses/errorResponse');
const { SuccessResponse } = require('../api-responses/successResponse');
const friendsService = require('../services/friendsService');

const sendError = (res, objet) => {
    return res.status(objet.status).json(new ErrorResponse(
        objet.message,
        objet.status
    ));
}

const friendsController = {
    getAll: async (req, res) => {
        const friends = await friendsService.getAll(req.user.id);

        res.status(200).json(new SuccessResponse(friends));
    },
    getAllInvitation: async (req, res) => {
        const invitations = await friendsService.getAllInvitation(req.user.id);

        res.status(200).json(new SuccessResponse(invitations));
    },
    acceptInvitation: async (req, res) => {
        const MemberId = req.params.id;
        if (!MemberId) {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'ID is required'
                }
            ));
            return;
        }

        const invitation = await friendsService.acceptInvitation(Number(MemberId), req.user.id);

        if (invitation !== true) {
            sendError(res, invitation);

            return;
        }

        res.status(201).json(new SuccessResponse(invitation));
    },
    refuseInvitation: async (req, res) => {
        const MemberId = req.params.id;
        if (!MemberId) {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'ID is required'
                }
            ));
            return;
        }

        const invitation = await friendsService.refuseInvitation(Number(MemberId), req.user.id);

        if (invitation !== true) {
            sendError(res, invitation);

            return;
        }

        res.status(201).json(new SuccessResponse(invitation));
    },
    addInvitation: async (req, res) => {
        const data = req.validateData;

        if (!data.email) {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'Email is required'
                }
            ));
            return;
        }

        const invitation = await friendsService.addInvitation(data, req.user.id);

        if (invitation !== true) {
            sendError(res, invitation);

            return;
        }

        res.status(201).json(new SuccessResponse(invitation));
    },
    delete: async (req, res) => {
        const id = req.params.id;

        await friendsService.delete(id, req.user.id);

        res.sendStatus(204);
    },
    deleteInvitation: async (req, res) => {
        const id = req.params.id;

        if (!id) {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'ID is required'
                }
            ));
            return;
        }

        await friendsService.deleteInvitation(id, req.user.id);

        res.sendStatus(204);
    }

};

module.exports = friendsController;