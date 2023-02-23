const { DataTypes, Sequelize, ModelCtor } = require('sequelize');

/**
 * Constructeur du modele "commentaries"
 * @param {Sequelize} sequelize
 * @returns {ModelCtor<any>}
 */
module.exports = (sequelize) => {
    const Commentaries = sequelize.define('commentaries', {
        commentary: {
            type: DataTypes.STRING(500),
            allowNull: false,
            validate: {
                notEmpty: false,
            }
        }
    }, {
        tableName: 'commentaries'
    });
    return Commentaries;
};