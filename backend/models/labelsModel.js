const { DataTypes, Sequelize, ModelCtor } = require('sequelize');

/**
 * Constructeur du modele "labels"
 * @param {Sequelize} sequelize
 * @returns {ModelCtor<any>}
 */
module.exports = (sequelize) => {
    const Labels = sequelize.define('labels', {
        title: {
            type: DataTypes.STRING(12),
            allowNull: false,
            validate: {
                notEmpty: false,
            }
        },
        color: {
            type: DataTypes.STRING(10),
            allowNull: false,
            validate: {
                notEmpty: false,
            }
        },
    }, {
        tableName: 'labels'
    });
    return Labels;
};