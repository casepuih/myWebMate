const { NotepadDTO } = require('../dto/notepadDTO');
const db = require('../models');

const notepadService = {

    getOne: async (userId) => {
        const notepad = await db.Notepad.findOne({
            where: {
                MemberId: userId
            }
        });

        return {
            notepad: new NotepadDTO(notepad)
        };
    },

    add: async (userId) => {
        const data = {
            MemberId: userId,
            content: ""
        }
        const newNotepad = await db.Notepad.create(data);

        return new NotepadDTO(newNotepad);
    },

    update: async (userId, data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const dataUpdated = await db.Notepad.update(data, {
            where: { MemberId: userId },
            validate: true
        });

        const dataUpdatedReturning = await notepadService.getOne(userId);

        return dataUpdatedReturning.notepad;
    }
};

module.exports = notepadService;