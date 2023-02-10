const { LabelsDTO } = require('../dto/labelsDTO');
const db = require('../models');

const labelsService = {

    getAll: async (userId) => {
        const label = await db.Labels.findAll({
            where: {
                MemberId: userId
            },
            order: [
                ['id', 'DESC']
            ]
        });

        return {
            labels: label.map(a => new LabelsDTO(a))
        };
    },

    getOne: async (id) => {
        const label = await db.Labels.findOne({
            where: {
                id: id
            }
        });

        return {
            labels: new LabelsDTO(label)
        };
    },

    add: async (data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const newLabel = await db.Labels.create(data);

        return new LabelsDTO(newLabel);
    },

    getMemberIdFromOneLabel: async (id) => {
        const label = await db.Labels.findOne({
            where: {
                id: id
            }
        });

        return {
            labels: new LabelsDTO(label)
        };
    },

    update: async (id, data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const dataUpdated = await db.Labels.update(data, {
            where: { id },
            validate: true
        });

        const dataUpdatedReturning = await labelsService.getOne(id);

        if (dataUpdatedReturning.labels.id !== Number(id)) {
            return null;
        }

        return dataUpdatedReturning.labels;
    },

    delete: async (id) => {
        const nbRowDeleted = await db.Labels.destroy({
            where: { id }
        });

        return nbRowDeleted === 1;
    }
};

module.exports = labelsService;