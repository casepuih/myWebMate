const { InvalidBodyErrorResponse, ErrorResponse} = require('../api-responses/errorResponse');
const { SuccessCollectionResponse, SuccessResponse } = require('../api-responses/successResponse');
const linksGroupService = require('../services/linksGroupService');
const linksService = require('../services/linksService');

const linksGroupController = {
    getAll: async (req, res) => {
        const linksGroup = await linksGroupService.getAll(req.user.id);

        res.status(200).json(new SuccessCollectionResponse(linksGroup));
    },

    add: async (req, res) => {
        const data = req.validateData;
        data.MemberId = req.user.id;

        if (!data.name && !data.link) {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'Name is required'
                }
            ));
            return;
        }

        const linksGroup = await linksGroupService.add(data);

        res.status(201).json(new SuccessResponse(linksGroup));
    },
    update: async (req, res) => {
        const id = req.params.id;
        const data = req.validateData;

        if (!data.name) {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'Name is required'
                }
            ));
            return;
        }

        const member = await linksGroupService.getMemberIdFromOneLinksGroup(id);

        if (member.linksGroup.MemberId !== req.user.id) {
            res.status(403).json(new ErrorResponse(
                `This is not your links group !!`
            ))

            return;
        }

        const linksGroup = await linksGroupService.update(id, data);

        if (!linksGroup) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    },

    delete: async (req, res) => {
        const id = req.params.id;

        const member = await linksGroupService.getMemberIdFromOneLinksGroup(id);

        if (member.linksGroup.MemberId !== req.user.id) {
            res.status(403).json(new ErrorResponse(
                `This is not your links group !!`
            ))

            return;
        }

        const linksInLinksGroup = await linksService.getLinksFromOneLinksGroup(id);

        if (linksInLinksGroup.links.length > 0) {
            res.status(403).json(new ErrorResponse(
                `You can delete a links group who have links. Delete all the links of this group first`
            ))

            return;
        }

        const isDeleted = await linksGroupService.delete(id);

        if (!isDeleted) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    }

};

module.exports = linksGroupController;