const { DataTypes, Sequelize, ModelCtor } = require('sequelize');

/**
 * Constructeur du modele "LinksGroup"
 * @param {Sequelize} sequelize
 * @returns {ModelCtor<any>}
 */
module.exports = (sequelize) => {
    const LinksGroup = sequelize.define('linksGroup', {
        name: {
            type: DataTypes.STRING(50),
            allowNull: false,
            validate: {
                notEmpty: false,
            }
        },
        description: {
            type: DataTypes.STRING(300),
            allowNull: true
        }
    }, {
        tableName: 'links_group'
    });
    return LinksGroup;
};