const { DataTypes, Sequelize, ModelCtor } = require('sequelize');

/**
 * Constructeur du modele "boards"
 * @param {Sequelize} sequelize
 * @returns {ModelCtor<any>}
 */
module.exports = (sequelize) => {
    const Boards = sequelize.define('boards', {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: false,
            }
        }
    }, {
        tableName: 'boards'
    });
    return Boards;
};