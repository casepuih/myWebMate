const { LinksDTO } = require('../dto/linksDTO');
const db = require('../models');

const linksService = {

    getAll: async (userId) => {
        const link = await db.Links.findAll({
            where: {
                MemberId: userId
            }
        });

        return {
            links: link.map(a => new LinksDTO(a))
        };
    },

    getLinksFromOneLinksGroup: async (id) => {
        const link = await db.Links.findAll({
            where: {
                linksGroupId: id
            }
        });

        return {
            links: link.map(a => new LinksDTO(a))
        };
    },

    getOne: async (id) => {
        const link = await db.Links.findOne({
            where: {
                id: id
            }
        });

        return {
            links: new LinksDTO(link)
        };
    },

    getMemberIdFromOneLink: async (id) => {
        const link = await db.Links.findOne({
            where: {
                id: id
            }
        });

        return {
            links: new LinksDTO(link)
        };
    },

    add: async (data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const newLink = await db.Links.create(data);

        return new LinksDTO(newLink);
    },
    update : async (id, data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const dataUpdated = await db.Links.update(data, {
            where: { id },
            validate: true
        });

        const dataUpdatedReturning = await linksService.getOne(id);

        if (dataUpdatedReturning.links.id !== Number(id)) {
            return null;
        }

        return dataUpdatedReturning.links;
    },
    clickOnLink: async (id) => {
        const link = await db.Links.findOne({
            where: {
                id: id
            }
        });

        if (!link) {
            throw new Error('Link not found');
        }

        link.clickedCounter += 1;

        await link.save();

        return link;
    },
    delete : async (id) => {
        const nbRowDeleted = await db.Links.destroy({
            where: { id }
        });

        return nbRowDeleted === 1;
    }
};

module.exports = linksService;