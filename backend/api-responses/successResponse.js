/**
 * Modele de réponse de l'api pour renvoyer un objet
 */
class SuccessResponse {
    constructor(result, status = 200) {
        this.result = result;
        this.status = status;
    }
}

/**
 * Modele de reponse de l'api pour renvoyer une collection
 */
class SuccessCollectionResponse {
    constructor(results, count, status = 200) {
        this.results = results;
        this.count = count;
        this.status = status;
    }
}


module.exports = {
    SuccessResponse,
    SuccessCollectionResponse
};