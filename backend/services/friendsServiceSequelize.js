const { MemberDTO } = require('../dto/memberDTO');
const { InvitationDTO } = require("../dto/invitationDTO");
const dateNow = require("../utils/date.utils");
const db = require('../models');

const friendsService = {
    getAll: async (userId) => {
        const friends = await db.Member.findAll({
            include: [{
                model: db.Member,
                as: 'Friendship',
                through: {
                    attributes: [],
                },
                where: {
                    id: userId
                }
            }]
        });
        return {
            friends: friends.map(a => new MemberDTO(a))
        };
    },

    getAllInvitation: async (userId) => {
        const invitationsReceive = await db.Member.findAll({
            include: [{
                model: db.Invitation,
                as: 'InvitationReceived',
                attributes: ['id', 'reiceverInvitationEmail', 'senderInvitationId', 'status'],
                where: {
                    reiceverInvitationEmail: db.Member.email
                },
                include: [{
                    model: db.Member,
                    as: 'Sender'
                }]
            }],
            where: {
                id: userId
            }
        });

        const invitationsSend = await db.Invitation.findAll({
            where: {
                senderInvitationId: userId
            }
        });

        return {
            receive: invitationsReceive.map(a => new MemberDTO(a.InvitationReceived.Sender)),
            send: invitationsSend.map(a => new InvitationDTO(a))
        };
    },

    acceptInvitation: async (friendsId, userId) => {
        if (!friendsId || !userId) {
            throw new Error('Data is required !');
        }

        const invitation = await db.Invitation.findOne({
            where: {
                senderInvitationId: friendsId,
                reiceverInvitationEmail: {
                    [db.Sequelize.Op.in]: db.Member.findAll({
                        where: {
                            id: userId
                        },
                        attributes: ['email']
                    })
                }
            }
        });

        if (!invitation) {
            throw new Error('Invitation not found !');
        }

        invitation.status = 'Accepted';
        invitation.acceptedDate = dateNow;

        await invitation.save();

        const friend = await db.Member.findOne({
            where: {
                id: friendsId
            }
        });

        await db.Member.findOne({
            where: {
                id: userId
            }
        }).then(user => {
            user.addFriendship(friend);
        });

        return {
            message: 'Invitation accepted'
        };
    }
};

module.exports = friendsService;