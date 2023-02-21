const db = require('../models');
const { MemberDTO } = require('../dto/memberDTO');
const notepadService = require('./notepadService');
const sql = require("../utils/sql.utils");

const memberService = {
    getAll: async () => {
        const member = await db.Member.findAll();

        return {
            members: member.map(a => new MemberDTO(a))
        };
    },

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

    getHashPassword: async (email) => {
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
    }
};

module.exports = memberService;