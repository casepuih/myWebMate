const { Request, Response, NextFunction } = require('express');
const { BaseSchema } = require('yup');
const { InvalidBodyErrorResponse } = require('../api-responses/errorResponse');

/**
 * Fonction pour générer le middlewares "bodyValidation"
 * @param {BaseSchema} validator Schema de validation "yup"
 * @param {Number} errorCode Code d'erreur si les données sont invalides
 * @returns {(req: Request, res: Response, next: NextFunction) => undefined}
 */
const bodyValidation = (validator, errorCode = 422) => {

    /**
     * Middleware de validation de body via "yup"
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    return (req, res, next) => {
        console.log("pass");
        console.log(req);
        validator.noUnknown().validate(req.body, { abortEarly: false })
            .then((data) => {
                req.validateData = data;

                next();
            })
            .catch((yupError) => {
                const validationErrors = {};
                for (const { path, message, type } of yupError.inner) {
                    if (validationErrors[path] === undefined) {
                        validationErrors[path] = [message];
                    }
                    else {
                        validationErrors[path].push(message);
                    }
                }

                res.status(errorCode).json(new InvalidBodyErrorResponse(
                    'Data invalid',
                    validationErrors,
                    errorCode
                ));
            });
    };
};

module.exports = bodyValidation;