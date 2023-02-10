const { ProjectsDTO } = require('../dto/projectsDTO');
const db = require('../models');

const projectsService = {

    getAll: async (userId) => {
        const project = await db.Projects.findAll({
            where: {
                MemberId: userId
            },
            order: [
                ['id', 'DESC']
            ]
        });

        return {
            projects: project.map(a => new ProjectsDTO(a))
        };
    },

    getOne: async (id) => {
        const project = await db.Projects.findOne({
            where: {
                id: id
            }
        });

        return {
            projects: new ProjectsDTO(project)
        };
    },

    add: async (data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const newProject = await db.Projects.create(data);

        return new ProjectsDTO(newProject);
    },

    getMemberIdFromOneProject: async (id) => {
        const project = await db.Projects.findOne({
            where: {
                id: id
            }
        });

        return {
            projects: new ProjectsDTO(project)
        };
    },

    update: async (id, data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const dataUpdated = await db.Projects.update(data, {
            where: { id },
            validate: true
        });

        const dataUpdatedReturning = await projectsService.getOne(id);

        if (dataUpdatedReturning.projects.id !== Number(id)) {
            return null;
        }

        return dataUpdatedReturning.projects;
    },

    delete: async (id) => {
        const nbRowDeleted = await db.Projects.destroy({
            where: { id }
        });

        return nbRowDeleted === 1;
    }
};

module.exports = projectsService;