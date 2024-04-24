const db = require('../models');
const { MemberDTO } = require('../dto/memberDTO');
const notepadService = require('./notepadService');
const sql = require("../utils/sql.utils");
const argon2 = require("argon2");

const memberService = {
    getOne: async (userId) => {
        const member = await db.Member.findOne({
            where: {
                id: userId
            }
        })

        return new MemberDTO(member);
    },

    update: async (data, userId) => {
        return await (await sql).query(`UPDATE member SET lastname = ?, firstname = ?
                                     WHERE id = ?`, [data.lastname, data.firstname, userId]);
    },

    add: async (data) => {
        if (!data) throw new Error('Data is required !');

        const member = await db.Member.create(data);

        await notepadService.add(member.id);

        return new MemberDTO(member);
    },

    getHashPassword: async(email) => {
        const member = await db.Member.findOne({
            where: {
                email
            },
            attributes: ['hashPassword']
        })

        return member?.hashPassword;
    },

    getByEmail: async (email) => {
        const member = await db.Member.findOne({
            where: {
                email
            }
        })

        return new MemberDTO(member);
    },

    updatePassword : async(data, userId) => {
        const member = await db.Member.findOne({
            where: {
                id : userId
            }
        })

        const isValid = await argon2.verify(member.dataValues.hashPassword, data.oldPassword);

        if (!isValid) {
            return {
                message : "old password not good"
            };
        }

        const hashPassword = await argon2.hash(data.newPassword, {
            type: 2
        });

        await (await sql).query(`UPDATE member SET hashPassword = ?
                                     WHERE id = ?`, [hashPassword, userId]);

        return memberService.getOne(userId);
    },

    updateEmail : async (data, userId) => {
        const member = await db.Member.findOne({
          where : {
              email : data.newEmail
          }
        })

        if (member) {
            return {
                message : "user allready exist"
            }
        }

        const memberInvitateHimself = await db.Invitation.findOne({
            where : {
                senderInvitationId : userId,
                reiceverInvitationEmail : data.newEmail
            }
        })

        if (memberInvitateHimself) {
            return {
                message : "You have invitation for this email, cancel it before change your email"
            }
        }

        const memberUpdated = await db.Member.findOne({
            where : {
                id : userId
            }
        })

        memberUpdated.email = data.newEmail;
        await memberUpdated.save();

        return new MemberDTO(memberUpdated);
    }
};

module.exports = memberService;