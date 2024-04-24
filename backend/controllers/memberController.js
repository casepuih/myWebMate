const memberService = require('../services/memberService');
const {SuccessResponse} = require("../api-responses/successResponse");
const {ErrorResponse} = require("../api-responses/errorResponse");

const memberController = {
    getOne: async (req, res) => {
        const member = await memberService.getOne(req.user.id);

        res.status(200).json(new SuccessResponse(member));
    },
    update: async (req, res) => {
        const data = req.validateData;

        const member = await memberService.update(data, req.user.id);

        if (!member) {
            res.sendStatus(404);
            return;
        }

        res.status(201).json(new SuccessResponse(member));
    },
    updatePassword: async (req, res) => {
        const data = req.validateData;

        const member = await memberService.updatePassword(data, req.user.id);

        if (member && member.message === "old password not good") {
            res.status(401).json(new ErrorResponse(member));

            return;
        }

        if (!member) {
            res.sendStatus(404);
            return;
        }

        res.status(202).json(new SuccessResponse(member));
    },
    updateEmail: async (req, res) => {
        const data = req.validateData;

        const member = await memberService.updateEmail(data, req.user.id);

        if (member && member.message) {
            res.status(401).json(new ErrorResponse(member));

            return;
        }

        if (!member) {
            res.sendStatus(404);
            return;
        }

        res.status(202).json(new SuccessResponse(member));
    }
};

module.exports = memberController;