const { GroupsDTO } = require('../dto/groupsDTO');
const db = require('../models');

const groupsService = {

    getAll: async (userId) => {
        const group = await db.Groups.findAll();

        return {
            groups: group.map(a => new GroupsDTO(a))
        };
    },

    getOne: async (id) => {
        const group = await db.Groups.findOne({
            where: {
                id: id
            }
        });

        return {
            groups: new GroupsDTO(group)
        };
    },

    add: async (data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const newLink = await db.Groups.create(data);
        console.log(newLink);

        return new GroupsDTO(newLink);
    },
    update: async (id, data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const dataUpdated = await db.Groups.update(data, {
            where: { id },
            validate: true
        });

        const dataUpdatedReturning = await groupsService.getOne(id);

        if (dataUpdatedReturning.groups.id !== Number(id)) {
            return null;
        }

        return dataUpdatedReturning.groups;
    },
    delete: async (id) => {
        const nbRowDeleted = await db.Groups.destroy({
            where: { id }
        });

        return nbRowDeleted === 1;
    }
};

module.exports = groupsService;