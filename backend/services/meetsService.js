const { MeetsDTO } = require('../dto/meetsDTO');
const db = require('../models');
const sql = require('../utils/sql.utils');

const meetsService = {

    getAll: async (userId) => {
        const meets = await db.Meets.findAll({
            include: [{
                model: db.Member,
                through: {
                    where: { MemberId: userId }
                }
            }],
            where: { '$MemberId$': userId }
        });

        const meetsClear = meets.map(a => new MeetsDTO(a));

        let meetArray = [];
        meetsClear.forEach( meet => meetArray.push(meet.id));

        if (meetArray.length === 0) {
            meetArray.push(0);
        }

        const [meetsId] = await (await sql).query(`SELECT taskId, MemberId FROM membermeets
                                                   WHERE taskId IN (?)`, [meetArray]);

        const grouped = {};

        meetsId.forEach(item => {
            if (!grouped[item.taskId]) {
                grouped[item.taskId] = {
                    taskId: item.taskId,
                    MemberId: [item.MemberId]
                };
            } else {
                grouped[item.taskId].MemberId.push(item.MemberId);
            }
        });

        const arrayToAdd = Object.values(grouped);

        const meetsWithMember = meetsClear.map(a => {
            const matchedData = arrayToAdd.find(data => data.taskId === a.id);
            a.MemberId = matchedData ? matchedData.MemberId : [];
            return a;
        });

        return {
            meets: meetsWithMember
        };
    },

    getOne: async (id, userId) => {
        const [meets] = await (await sql).query(`SELECT meets.* FROM meets
                                         LEFT JOIN membermeets ON membermeets.taskId = meets.id
                                         WHERE membermeets.MemberId= ? AND meets.id = ?`, [userId, id]);

        const meetsClear = meets.map(a => new MeetsDTO(a));

        let meetArray = [];
        meetsClear.forEach( meet => meetArray.push(meet.id));

        if (meetArray.length === 0) {
            meetArray.push(0);
        }

        const [meetsId] = await (await sql).query(`SELECT taskId, MemberId FROM membermeets
                                                   WHERE taskId IN (?)`, [meetArray]);

        const grouped = {};

        meetsId.forEach(item => {
            if (!grouped[item.taskId]) {
                grouped[item.taskId] = {
                    taskId: item.taskId,
                    MemberId: [item.MemberId]
                };
            } else {
                grouped[item.taskId].MemberId.push(item.MemberId);
            }
        });

        const arrayToAdd = Object.values(grouped);

        const meetsWithMember = meetsClear.map(a => {
            const matchedData = arrayToAdd.find(data => data.taskId === a.id);
            a.MemberId = matchedData ? matchedData.MemberId : [];
            return a;
        });

        return {
            meet: meetsWithMember
        };
    },

    add: async (data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const newMeet = await db.Meets.create(data);
        newMeet.MemberId = data.MemberIdArray;

        newMeet.MemberId.forEach( async (id)=> {
                const relation = await newMeet.addMember(id);
            }
        )

        return new MeetsDTO(newMeet);
    },

    getMemberIdFromOneMeet: async (id) => {
        const [meets] = await (await sql).query(`SELECT membermeets.MemberId FROM meets
                                         LEFT JOIN membermeets ON membermeets.taskId = meets.id
                                         WHERE meets.id = ?`, [id]);

        return {
            memberId: meets
        };
    },

    update : async (id, data, userId) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const dataUpdated = await db.Meets.update(data, {
            where: { id },
            validate: true
        });

        const dataUpdatedReturning = await meetsService.getOne(id, userId);
        console.log(dataUpdatedReturning.meet.id, "dddddd", Number(id));
        if (dataUpdatedReturning.meet[0].id !== Number(id)) {
            return null;
        }

        return dataUpdatedReturning.meet;
    },

    delete : async (id, userId) => {
        await (await sql).query(`DELETE FROM membermeets
                                     WHERE taskId = ? AND MemberId = ?`, [id, userId]);

        const [meets] = await (await sql).query(`SELECT taskId FROM membermeets
                                         WHERE taskId = ?`, [id]);

        if (meets.length === 0) {
            await db.Meets.destroy({
                where: {
                    id: id
                }
            });
        }

        return true;
    }
};

module.exports = meetsService;