const { ErrorResponse, InvalidBodyErrorResponse} = require('../api-responses/errorResponse');
const { SuccessResponse } = require('../api-responses/successResponse');
const meetsService = require('../services/meetsService');

const meetsController = {
    getAll: async (req, res) => {
        const meet = await meetsService.getAll(req.user.id);

        res.status(200).json(new SuccessResponse(meet));
    },

    getOne: async (req, res) => {
        const meet = await meetsService.getOne(req.params.id, req.user.id);

        res.status(200).json(new SuccessResponse(meet));
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

        const meet = await meetsService.add(data);

        res.status(201).json(new SuccessResponse(meet));
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

        const member = await meetsService.getMemberIdFromOneMeet(id);

        let isMyMeet = false;
        member.memberId.forEach((memberId)=> {
            if(memberId.MemberId === req.user.id) {
                isMyMeet = true;
            }
        })

        if (!isMyMeet) {
            res.status(403).json(new ErrorResponse(
                `This is not your meet !!`
            ))

            return;
        }

        const meet = await meetsService.update(id, data, req.user.id);

        if (!meet) {
            res.sendStatus(404);
            return;
        }
        res.sendStatus(204);
    },
    delete: async (req, res) => {
        const id = req.params.id;

        const member = await meetsService.getMemberIdFromOneMeet(id);

        let isMyMeet = false;
        member.memberId.forEach((memberId)=> {
            if(memberId.MemberId === req.user.id) {
                isMyMeet = true;
            }
        })

        if (!isMyMeet) {
            res.status(403).json(new ErrorResponse(
                `This is not your meet !!`
            ))

            return;
        }

        await meetsService.delete(id, req.user.id);

        res.sendStatus(204);
    }

};

module.exports = meetsController;