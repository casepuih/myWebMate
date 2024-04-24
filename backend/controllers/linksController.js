const { ErrorResponse, InvalidBodyErrorResponse } = require('../api-responses/errorResponse');
const { SuccessCollectionResponse, SuccessResponse } = require('../api-responses/successResponse');
const linksService = require('../services/linksService');

const linksController = {
    getAll: async (req, res) => {
        const links = await linksService.getAll(req.user.id);

        res.status(200).json(new SuccessCollectionResponse(links));
    },

    add: async (req, res) => {
        const data = req.validateData;
        data.MemberId = req.user.id;

        if (!data.name && !data.link) {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'Name and Link is required'
                }
            ));
            return;
        }

        const link = await linksService.add(data);

        res.json(new SuccessResponse(link));
    },
    update: async (req, res) => {
        const id = req.params.id;
        const data = req.validateData;

        if (!data.name && !data.link) {
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

        const member = await linksService.getMemberIdFromOneLink(id);

        if (member.links.MemberId !== req.user.id) {
            res.status(403).json(new ErrorResponse(
                `This is not your link !!`
            ))

            return;
        }

        const links = await linksService.update(id, data);

        if (!links) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    },
    clickOnLink : async (req,res) => {
        const id = req.params.id;

        const member = await linksService.getMemberIdFromOneLink(id);

        if (member.links.MemberId !== req.user.id) {
            res.status(403).json(new ErrorResponse(
                `This is not your link !!`
            ))

            return;
        }

        const link = await linksService.clickOnLink(id);

        res.status(200).json(new SuccessCollectionResponse(link));
    },
    delete: async (req, res) => {
        const id = req.params.id;

        const member = await linksService.getMemberIdFromOneLink(id);

        if (member.links.MemberId !== req.user.id) {
            res.status(403).json(new ErrorResponse(
                `This is not your link !!`
            ))

            return;
        }

        const isDeleted = await linksService.delete(id);

        if (!isDeleted) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    }
};

module.exports = linksController;