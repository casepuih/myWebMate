const { NotesDTO } = require('../dto/notesDTO');
const db = require('../models');

const notesService = {

    getAll: async (userId) => {
        const note = await db.Notes.findAll({
            where: {
                MemberId: userId
            },
            order: [
                ['id', 'DESC']
            ]
        });

        return {
            notes: note.map(a => new NotesDTO(a))
        };
    },

    getOne: async (id) => {
        const note = await db.Notes.findOne({
            where: {
                id: id
            }
        });

        return {
            notes: new NotesDTO(note)
        };
    },

    add: async (data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const newNote = await db.Notes.create(data);

        return new NotesDTO(newNote);
    },

    getMemberIdFromOneNote: async (id) => {
        const note = await db.Notes.findOne({
            where: {
                id: id
            }
        });

        return {
            notes: new NotesDTO(note)
        };
    },

    update : async (id, data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const dataUpdated = await db.Notes.update(data, {
            where: { id },
            validate: true
        });

        const dataUpdatedReturning = await notesService.getOne(id);

        if (dataUpdatedReturning.notes.id !== Number(id)) {
            return null;
        }

        return dataUpdatedReturning.notes;
    },

    delete : async (id) => {
        const nbRowDeleted = await db.Notes.destroy({
            where: { id }
        });

        return nbRowDeleted === 1;
    }
};

module.exports = notesService;