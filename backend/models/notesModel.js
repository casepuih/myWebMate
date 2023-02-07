const { DataTypes, Sequelize, ModelCtor } = require('sequelize');

/**
 * Constructeur du modele "notes"
 * @param {Sequelize} sequelize
 * @returns {ModelCtor<any>}
 */
module.exports = (sequelize) => {
    const Notes = sequelize.define('links', {
        title: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: false,
            }
        },
        content: {
            type: DataTypes.TEXT(),
            allowNull: true,
        }
    }, {
        tableName: 'notes'
    });
    return Notes;
};