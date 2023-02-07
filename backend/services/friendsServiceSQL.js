const { MemberDTO } = require('../dto/memberDTO');
const sql = require('../utils/sql.utils');
const {InvitationDTO} = require("../dto/invitationDTO");
const dateNow = require("../utils/date.utils");

const friendsService = {

    getAll: async (userId) => {
        const [friends] = await (await sql).query(`SELECT member.* FROM member
                                         LEFT JOIN friends ON friends.FriendshipId = member.id
                                         WHERE friends.MemberId= ?`, [userId]);

        return {
            friends: friends.map(a => new MemberDTO(a))
        };
    },

    getAllInvitation: async (userId) => {
        const [invitationsReceive] = await (await sql).query(`SELECT inviteMember.* FROM member
                                         LEFT JOIN invitation ON invitation.reiceverInvitationEmail = member.email
                                         LEFT JOIN member as inviteMember ON invitation.senderInvitationId = inviteMember.id
                                         WHERE member.id= ?`, [userId]);


        const [invitationsSend] = await (await sql).query(`SELECT * FROM invitation
                                         WHERE senderInvitationId= ?`, [userId]);

        console.log(invitationsReceive);
        return {
            receive: invitationsReceive.map(a => new MemberDTO(a)),
            send: invitationsSend.map(a => new InvitationDTO(a))
        };
    },

    acceptInvitation: async (friendsId, userId) => {
        if (!friendsId || !userId) {
            throw new Error('Data is required !');
        }

        const invitationsCheck = await (await sql).query(`SELECT invitation.id as invitationId, friends.id as guestId,
                                            guest.id as inviteBy
                                            FROM invitation
                                            LEFT JOIN member as friends ON friends.email = invitation.reiceverInvitationEmail
                                            LEFT JOIN member as guest ON invitation.senderInvitationId = guest.id
                                            WHERE invitation.senderInvitationId= ? AND friends.id = ?`, [friendsId, userId]);

        const sqlResult = invitationsCheck[0][0];

        if (!sqlResult || (sqlResult.guestId !== userId || sqlResult.inviteBy !== friendsId)) {
            return {
                "message" : "This request of relationship does not exist !",
                "status" : 400
            }
        }

        const date = dateNow();
        await (await sql).query(`INSERT INTO friends (createdAt, updatedAt, MemberId, FriendshipId) VALUES (?, ?, ?, ?)`, [date, date, userId, friendsId]);
        await (await sql).query(`INSERT INTO friends (createdAt, updatedAt, MemberId, FriendshipId) VALUES (?, ?, ?, ?)`, [date, date, friendsId, userId]);
        await (await sql).query(`DELETE FROM invitation WHERE id = ?`, [sqlResult.invitationId]);

        return true;
    },

    refuseInvitation: async (friendsId, userId) => {
        if (!friendsId || !userId) {
            return {
                "message" : "Data is required !",
                "status" : 400
            }
        }

        const invitationsCheck = await (await sql).query(`SELECT invitation.id as invitationId, friends.id as guestId,
                                            guest.id as inviteBy
                                            FROM invitation
                                            LEFT JOIN member as friends ON friends.email = invitation.reiceverInvitationEmail
                                            LEFT JOIN member as guest ON invitation.senderInvitationId = guest.id
                                            WHERE invitation.senderInvitationId= ? AND friends.id = ?`, [friendsId, userId]);

        const sqlResult = invitationsCheck[0][0];

        if (sqlResult.guestId !== userId || sqlResult.inviteBy !== friendsId) {
            return {
                "message" : "This request of relationship does not exist !",
                "status" : 400
            }
        }

        await (await sql).query(`DELETE FROM invitation WHERE id = ?`, [sqlResult.invitationId]);

        return true;
    },

    addInvitation: async (data, userId) => {
        const checkIfUserExist = await (await sql).query(`SELECT id FROM member
                                         WHERE email= ?`, [data.email]);

        if (checkIfUserExist && checkIfUserExist[0] && checkIfUserExist[0][0] && checkIfUserExist[0][0].id !== undefined) {
            const checkIfAllreadyFriend = await (await sql).query(`SELECT MemberId FROM friends
                                         WHERE MemberId= ? AND FriendshipId = ?`, [userId, checkIfUserExist[0][0].id]);

            if (checkIfAllreadyFriend && checkIfAllreadyFriend[0] && checkIfAllreadyFriend[0][0] && checkIfAllreadyFriend[0][0].MemberId !== undefined) {
                return {
                    "message" : "You are allready friends !",
                    "status" : 400
                }
            }
        }

        const checkIfInvitationAllreadyExist = await (await sql).query(`SELECT id FROM invitation
                                         WHERE senderInvitationId= ? AND reiceverInvitationEmail = ?`, [userId, data.email]);

        if (checkIfInvitationAllreadyExist && checkIfInvitationAllreadyExist[0] && checkIfInvitationAllreadyExist[0][0] && checkIfInvitationAllreadyExist[0][0].id !== undefined) {
            return {
                "message" : "You have allready make an invitation for this friends !",
                "status" : 400
            }
        }

        // TODO : send mail
        const date = dateNow();
        await (await sql).query(`INSERT INTO invitation (senderInvitationId, reiceverInvitationEmail, createdAt, updatedAt) VALUES (?, ?, ?, ?)`, [userId, data.email, date, date]);

        return true;
    },

    delete : async (id, userId) => {
        await (await sql).query(`DELETE FROM friends
                                     WHERE MemberId = ? AND FriendshipId = ?`, [id, userId]);

        await (await sql).query(`DELETE FROM friends
                                     WHERE MemberId = ? AND FriendshipId = ?`, [userId, id]);

        return true;
    }
};

module.exports = friendsService;