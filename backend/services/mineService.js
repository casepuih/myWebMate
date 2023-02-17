const { LinksDTO } = require('../dto/linksDTO');
const db = require('../models');
const {MineDTO} = require("../dto/mineDTO");

const mineService = {

    getAllEasy: async () => {
        const score = await db.Mine.findAll({
            where: {
                difficulty: "easy"
            },
            order : [['score', 'ASC']],
            include: {
                model: db.Member,
                attributes: ['firstname', 'lastname']
            }
        });

        return {
            highscore: score.map(a => new MineDTO(a))
        };
    },

    getAllEasyFromOneUser: async (MemberId) => {
        const score = await db.Mine.findAll({
            where: {
                difficulty: "easy",
                MemberId: MemberId
            },
            order : [['score', 'ASC']]
        });

        return {
            highscore: score.map(a => new MineDTO(a))
        };
    },

    addEasy: async (data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const highscore = await mineService.getAllEasyFromOneUser(data.MemberId);

        if (highscore.highscore.length <= 10) {
            const newScore = await db.Mine.create(data);

            return new MineDTO(newScore);
        }

        highscore.highscore.sort((a, b) => b.score + a.score);

        if (data.score < highscore.highscore[9].score) {
                const newScore = await db.Mine.create(data);
                await mineService.delete(highscore.highscore[9].id);
                newScore.highscore = true;

                return new MineDTO(newScore);
        }

        return {
                id: 0,
                score: data.score,
                difficulty: "easy",
                MemberId: data.MemberId,
                highscore: false
        };
    },

    getAllMedium: async () => {
        const score = await db.Mine.findAll({
            where: {
                difficulty: "medium"
            },
            order : [['score', 'ASC']],
            include: {
                model: db.Member,
                attributes: ['firstname', 'lastname']
            }
        });

        return {
            highscore: score.map(a => new MineDTO(a))
        };
    },

    getAllMediumFromOneUser: async (MemberId) => {
        const score = await db.Mine.findAll({
            where: {
                difficulty: "medium",
                MemberId: MemberId
            },
            order : [['score', 'ASC']]
        });

        return {
            highscore: score.map(a => new MineDTO(a))
        };
    },

    addMedium: async (data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const highscore = await mineService.getAllMediumFromOneUser(data.MemberId);

        if (highscore.highscore.length <= 10) {
            const newScore = await db.Mine.create(data);

            return new MineDTO(newScore);
        }

        highscore.highscore.sort((a, b) => b.score + a.score);

        if (data.score < highscore.highscore[9].score) {
            const newScore = await db.Mine.create(data);
            await mineService.delete(highscore.highscore[9].id);
            newScore.highscore = true;

            return new MineDTO(newScore);
        }

        return {
            id: 0,
            score: data.score,
            difficulty: "medium",
            MemberId: data.MemberId,
            highscore: false
        };
    },

    getAllHard: async () => {
        const score = await db.Mine.findAll({
            where: {
                difficulty: "hard"
            },
            order : [['score', 'ASC']],
            include: {
                model: db.Member,
                attributes: ['firstname', 'lastname']
            }
        });

        return {
            highscore: score.map(a => new MineDTO(a))
        };
    },

    getAllHardFromOneUser: async (MemberId) => {
        const score = await db.Mine.findAll({
            where: {
                difficulty: "hard",
                MemberId: MemberId
            },
            order : [['score', 'ASC']]
        });

        return {
            highscore: score.map(a => new MineDTO(a))
        };
    },

    addHard: async (data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const highscore = await mineService.getAllHardFromOneUser(data.MemberId);

        if (highscore.highscore.length <= 10) {
            const newScore = await db.Mine.create(data);

            return new MineDTO(newScore);
        }

        highscore.highscore.sort((a, b) => b.score + a.score);

        if (data.score < highscore.highscore[9].score) {
            const newScore = await db.Mine.create(data);
            await mineService.delete(highscore.highscore[9].id);
            newScore.highscore = true;

            return new MineDTO(newScore);
        }

        return {
            id: 0,
            score: data.score,
            difficulty: "hard",
            MemberId: data.MemberId,
            highscore: false
        };
    },

    delete : async (id) => {
        const nbRowDeleted = await db.Mine.destroy({
            where: { id }
        });

        return nbRowDeleted === 1;
    }
};

module.exports = mineService;