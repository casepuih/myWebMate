const { LinksGroupDTO } = require('../dto/linksGroupDTO');
const db = require('../models');

const linksGroupService = {

    getAll: async (userId) => {
        const rows = await db.LinksGroup.findAll({
            where: {
                MemberId: userId
            }
        });

        return {
            linksGroup: rows.map(a => new LinksGroupDTO(a))
        };
    },

    getOne: async (id) => {
        const linksGroup = await db.LinksGroup.findOne({
            where: {
                id: id
            }
        });

        return {
            linksGroup: new LinksGroupDTO(linksGroup)
        };
    },

    add: async (data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const newLinkGroup = await db.LinksGroup.create(data);

        return new LinksGroupDTO(newLinkGroup);
    },

    getMemberIdFromOneLinksGroup: async (id) => {
        const linksGroup = await db.LinksGroup.findOne({
            where: {
                id: id
            }
        });

        return {
            linksGroup: new LinksGroupDTO(linksGroup)
        };
    },

    update : async (id, data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const dataUpdated = await db.LinksGroup.update(data, {
            where: { id },
            validate: true
        });

        const dataUpdatedReturning = await linksGroupService.getOne(id);

        console.log(dataUpdatedReturning);

        if (dataUpdatedReturning.linksGroup.id !== Number(id)) {
            return null;
        }

        return dataUpdatedReturning.linksGroup;
    },

    delete : async (id) => {
        const nbRowDeleted = await db.LinksGroup.destroy({
            where: { id }
        });

        return nbRowDeleted === 1;
    }
};

module.exports = linksGroupService;