const { SuccessResponse } = require('../api-responses/successResponse');
const notepadService = require('../services/notepadService');
const {InvalidBodyErrorResponse} = require("../api-responses/errorResponse");

const notepadController = {
    getOne: async (req, res) => {
        const notepad = await notepadService.getOne(req.user.id);

        res.status(200).json(new SuccessResponse(notepad));
    },
    update: async (req, res) => {
        const userId = req.user.id;
        const data = req.validateData;

        if (!data.content && data.content!=="") {
            res.status(422).json(new InvalidBodyErrorResponse(
                'Invalid Data',
                {
                    pseudo: 'Title and content is required on update'
                }
            ));
            return;
        }

        const notepad = await notepadService.update(userId, data);

        if (!notepad) {
            res.sendStatus(404);
            return;
        }

        res.status(204).json(new SuccessResponse(notepad, 204));
    }

};

module.exports = notepadController;