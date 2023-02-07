const authService = require("../services/authService");
const {ErrorResponse} = require("../api-responses/errorResponse");
const {generateJWT} = require("../utils/jws.utils");
const {SuccessResponse} = require("../api-responses/successResponse");

const authController = {
    register: async (req,res) => {
        const {email, password, firstname, lastname} = req.validateData;

        const data = await authService.register(email, password, firstname, lastname);
        console.log("register data", data);
        if (!data) {
            res.sendStatus(400);
            return;
        }

        res.status(204).json(new SuccessResponse(data, 204));
    },

    login: async (req,res) => {
        const {email, password} = req.validateData;

        const data = await authService.login(email, password);

        if (!data) {
            res.status(400).json(new ErrorResponse('Bad Credential'));
            return;
        }

        try {
            const token = await generateJWT(data);

            res.status(200).json({ token, data });
        }
        catch (error) {
            res.status(500);
        }
    }
}

module.exports = authController;
