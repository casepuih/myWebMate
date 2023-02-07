const { decodeJWT } = require('../utils/jws.utils');

/**
 * Middleware d'authentification via les JSON Web Token
 * @param {{adminOnly: boolean}} options
 * @returns {(req: Request, res: Response, next: NextFunction) => Void}
 */
const authentificate = (options = { adminOnly: false }) => {

    /**
     * Middleware pour gérer les jwt
     * @param {Request} req
     * @param {Response} res
     * @param {NextFunction} next
     */
    return async (req, res, next) => {
        // Récuperation du header d'authenfication
        // -> Exemple de résultat: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6..."
        const authHeader = req.headers['authorization'];

        // Récuperation du JWT
        const token = authHeader && authHeader.split(' ')[1];

        // Si aucun token n'a été recu, erreur 401.
        if (!token) {
            return res.sendStatus(401);
        }

        // Récuperation des données du JWT
        let tokenData;
        try {
            // Extraction des données
            tokenData = await decodeJWT(token);
        }
        catch (error) {
            // En cas d'erreur, envoi d'un erreur
            return res.sendStatus(403);
        }

        // Vérification des droits de l'utilisateur si le flag "adminOnly" est présent
        if (options.adminOnly && !tokenData.isAdmin) {

            // Erreur 403 si l'utilisateur n'a pas les droits
            return res.sendStatus(403);
        }

        // Ajout des infos du token a l'object "request" de Express
        req.user = tokenData;

        // On continue :)
        next();
    };
};

module.exports = authentificate;