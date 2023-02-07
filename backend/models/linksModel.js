const { DataTypes, Sequelize, ModelCtor } = require('sequelize');

/**
 * Constructeur du modele "Links"
 * @param {Sequelize} sequelize
 * @returns {ModelCtor<any>}
 */
module.exports = (sequelize) => {
    const Links = sequelize.define('links', {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: false,
            }
        },
        link: {
            type: DataTypes.STRING(400),
            allowNull: false,
            validate: {
                notEmpty: false
            }
        },
        description: {
            type: DataTypes.STRING(300),
            allowNull: true
        }
    }, {
        tableName: 'links'
    });
    return Links;
};