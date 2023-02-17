const { InvalidBodyErrorResponse } = require('../api-responses/errorResponse');
const { SuccessCollectionResponse, SuccessResponse } = require('../api-responses/successResponse');
const mineService = require("../services/mineService");

const mineController = {
    getAllEasy: async (req, res) => {
        const scores = await mineService.getAllEasy();

        res.status(200).json(new SuccessCollectionResponse(scores));
    },

    getAllEasyFromOneUser: async (req, res) => {
        const scores = await mineService.getAllEasyFromOneUser(req.user.id);

        res.status(200).json(new SuccessCollectionResponse(scores));
    },

    addEasy: async (req, res) => {
        const data = req.validateData;
        data.MemberId = req.user.id;

        if (data.difficulty !== 'easy') {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'that is not an easy add'
                }
            ));
            return;
        }

        const score = await mineService.addEasy(data);

        res.json(new SuccessResponse(score));
    },

    getAllMedium: async (req, res) => {
        const scores = await mineService.getAllMedium();

        res.status(200).json(new SuccessCollectionResponse(scores));
    },

    getAllMediumFromOneUser: async (req, res) => {
        const scores = await mineService.getAllMediumFromOneUser(req.user.id);

        res.status(200).json(new SuccessCollectionResponse(scores));
    },

    addMedium: async (req, res) => {
        const data = req.validateData;
        data.MemberId = req.user.id;

        if (data.difficulty !== 'medium') {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'that is not an medium add'
                }
            ));
            return;
        }

        const score = await mineService.addMedium(data);

        res.json(new SuccessResponse(score));
    },

    getAllHard: async (req, res) => {
        const scores = await mineService.getAllHard();

        res.status(200).json(new SuccessCollectionResponse(scores));
    },

    getAllHardFromOneUser: async (req, res) => {
        const scores = await mineService.getAllHardFromOneUser(req.user.id);

        res.status(200).json(new SuccessCollectionResponse(scores));
    },

    addHard: async (req, res) => {
        const data = req.validateData;
        data.MemberId = req.user.id;

        if (data.difficulty !== 'hard') {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'that is not an hard add'
                }
            ));
            return;
        }

        const score = await mineService.addHard(data);

        res.json(new SuccessResponse(score));
    },
};

module.exports = mineController;