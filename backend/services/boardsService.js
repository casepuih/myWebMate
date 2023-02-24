const { BoardsDTO } = require('../dto/boardsDTO');
const db = require('../models');

const boardsService = {

    getAll: async (userId) => {
        const board = await db.Boards.findAll({
            order: [
                ['id', 'DESC']
            ]
        });
        return {
            boards: board.map(a => new BoardsDTO(a))
        };
    },

    getBoardsFromAll: async () => {
        return {
            boards: db.Boards.map(a => new BoardsDTO(a))
        };
    },

    getOne: async (id) => {
        const board = await db.Boards.findOne({
            where: {
                id: id
            }
        });

        return {
            boards: new BoardsDTO(board)
        };
    },

    add: async (data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const newBoard = await db.Boards.create(data);

        return new BoardsDTO(newBoard);
    },

    getMemberIdFromOneBoard: async (id) => {
        const board = await db.Boards.findOne({
            where: {
                id: id
            }
        });

        return {
            boards: new BoardsDTO(board)
        };
    },

    update: async (id, data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const dataUpdated = await db.Boards.update(data, {
            where: { id },
            validate: true
        });

        const dataUpdatedReturning = await boardsService.getOne(id);

        if (dataUpdatedReturning.boards.id !== Number(id)) {
            return null;
        }

        return dataUpdatedReturning.boards;
    },

    delete: async (id) => {
        const nbRowDeleted = await db.Boards.destroy({
            where: { id }
        });

        return nbRowDeleted === 1;
    }
};

module.exports = boardsService;