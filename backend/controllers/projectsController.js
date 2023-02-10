const { InvalidBodyErrorResponse, ErrorResponse } = require('../api-responses/errorResponse');
const { SuccessResponse } = require('../api-responses/successResponse');
const projectsService = require('../services/projectsService');

const projectsController = {
    getAll: async (req, res) => {
        const projects = await projectsService.getAll(req.user.id);

        res.status(200).json(new SuccessResponse(projects));
    },

    getOne: async (req, res) => {
        const projects = await projectsService.getOne(req.params.id);

        res.status(200).json(new SuccessResponse(projects));
    },

    add: async (req, res) => {
        const data = req.validateData;
        data.MemberId = req.user.id;

        if (!data.title) {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'Title is required'
                }
            ));
            return;
        }

        const project = await projectsService.add(data);

        res.status(201).json(new SuccessResponse(project));
    },
    update: async (req, res) => {
        const id = req.params.id;
        const data = req.validateData;

        if (!data.title) {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'Title is required'
                }
            ));
            return;
        }

        const member = await projectsService.getMemberIdFromOneProject(id);

        if (member.projects.MemberId !== req.user.id) {
            res.status(403).json(new ErrorResponse(
                `This is not your project !!`
            ))

            return;
        }

        const projects = await projectsService.update(id, data);

        if (!projects) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    },
    delete: async (req, res) => {
        const id = req.params.id;

        const member = await projectsService.getMemberIdFromOneProject(id);

        if (member.projects.MemberId !== req.user.id) {
            res.status(403).json(new ErrorResponse(
                `This is not your project !!`
            ))

            return;
        }

        const isDeleted = await projectsService.delete(id);

        if (!isDeleted) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    }

};

module.exports = projectsController;