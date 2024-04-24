const { ErrorResponse, InvalidBodyErrorResponse} = require('../api-responses/errorResponse');
const { SuccessResponse } = require('../api-responses/successResponse');
const tasksService = require('../services/tasksService');

const tasksController = {
    getAll: async (req, res) => {
        const task = await tasksService.getAll(req.user.id);

        res.status(200).json(new SuccessResponse(task));
    },

    getOne: async (req, res) => {
        const task = await tasksService.getOne(req.params.id, req.user.id);

        res.status(200).json(new SuccessResponse(task));
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

        if (!data.dateBegin) {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'Date is required'
                }
            ));
            return;
        }

        const task = await tasksService.add(data);

        res.status(201).json(new SuccessResponse(task));
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

        if (!data.dateBegin) {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'Date is required'
                }
            ));
            return;
        }

        const member = await tasksService.getMemberIdFromOneTask(id);

        let isMyTask = false;
        member.memberId.forEach((memberId)=> {
            if(memberId.MemberId === req.user.id) {
                isMyTask = true;
            }
        })

        if (!isMyTask) {
                res.status(403).json(new ErrorResponse(
                    `This is not your task !!`
                ))

                return;
        }

        const task = await tasksService.update(id, data, req.user.id);

        if (!task) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    },
    delete: async (req, res) => {
        const id = req.params.id;

        const member = await tasksService.getMemberIdFromOneTask(id);

        let isMyTask = false;
        member.memberId.forEach((memberId)=> {
            if(memberId.MemberId === req.user.id) {
                isMyTask = true;
            }
        })

        if (!isMyTask) {
            res.status(403).json(new ErrorResponse(
                `This is not your task !!`
            ))

            return;
        }

        await tasksService.delete(id, req.user.id);

        res.sendStatus(204);
    }

};

module.exports = tasksController;