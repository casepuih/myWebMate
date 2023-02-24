const { CommentariesDTO } = require('../dto/commentariesDTO');
const db = require('../models');

const commentariesService = {

    getAll: async (userId) => {
        const commentarie = await db.Commentaries.findAll({
            order: [
                ['id', 'DESC']
            ]
        });
        return {
            commentaries: commentarie.map(a => new CommentariesDTO(a))
        };
    },

    getCommentariesFromAll: async () => {
        return {
            commentaries: db.Commentaries.map(a => new CommentariesDTO(a))
        };
    },

    getOne: async (id) => {
        const commentarie = await db.Commentaries.findOne({
            where: {
                id: id
            }
        });

        return {
            commentaries: new CommentariesDTO(commentarie)
        };
    },

    add: async (data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const newCommentarie = await db.Commentaries.create(data);

        return new CommentariesDTO(newCommentarie);
    },

    getMemberIdFromCommentary: async (id) => {
        const commentarie = await db.Commentaries.findOne({
            where: {
                id: id
            }
        });

        return {
            commentaries: new CommentariesDTO(commentarie)
        };
    },

    update: async (id, data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const dataUpdated = await db.Commentaries.update(data, {
            where: { id },
            validate: true
        });

        const dataUpdatedReturning = await commentariesService.getOne(id);

        if (dataUpdatedReturning.commentaries.id !== Number(id)) {
            return null;
        }

        return dataUpdatedReturning.commentaries;
    },

    delete: async (id) => {
        const nbRowDeleted = await db.Commentaries.destroy({
            where: { id }
        });

        return nbRowDeleted === 1;
    }
};

module.exports = commentariesService;