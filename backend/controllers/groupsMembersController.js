const { InvalidBodyErrorResponse, ErrorResponse } = require('../api-responses/errorResponse');
const { SuccessCollectionResponse, SuccessResponse } = require('../api-responses/successResponse');
const groupsMembersService = require('../services/groupsMembersService');
const groupService = require('../services/groupsService');

const groupsMembersController = {
    getAll: async (req, res) => {
        const groupsMembers = await groupsMembersService.getAll(req.user.id);

        res.status(200).json(new SuccessCollectionResponse(groupsMembers));
    },

    add: async (req, res) => {
        const data = req.validateData;
        const isGroupMemberUnique = await groupsMembersService.isGroupMemberUnique(data.group_id, data.member_id)

        if (data.tier < 0) {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'Tier need to be higher then 0'
                }
            ));
            return;
        } else if (!isGroupMemberUnique) {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'Already existing'
                }
            ));
            return;
        }

        const groupsMembers = await groupsMembersService.add(data);

        res.status(201).json(new SuccessResponse(groupsMembers));
    },
    update: async (req, res) => {
        const id = req.params.id;
        const data = req.validateData;

        console.log(data);
        const member = await groupsMembersService.getOneGroupsMembers(id);

        if (member.groupsMembers.member_id !== req.user.id && req.user.isAdmin == false) {
            res.status(403).json(new ErrorResponse(
                `This is not your group !!`
            ))

            return;
        }

        const groupsMembers = await groupsMembersService.update(id, data);

        if (!groupsMembers) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    },

    delete: async (req, res) => {
        const id = req.params.id;

        const member = await groupsMembersService.getMemberIdFromOneGroupsMembers(id);

        if (member.groupsMembers.MemberId !== req.user.id) {
            res.status(403).json(new ErrorResponse(
                `This is not your group !!`
            ))

            return;
        }

        // const linksInLinksGroup = await linksService.getLinksFromOneLinksGroup(id);

        // if (linksInLinksGroup.links.length > 0) {
        //     res.status(403).json(new ErrorResponse(
        //         `You can delete a links group who have links. Delete all the links of this group first`
        //     ))

        //     return;
        // }

        const isDeleted = await groupsMembersService.delete(id);

        if (!isDeleted) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    }

};

module.exports = groupsMembersController;