const { DataTypes, Sequelize, ModelCtor } = require('sequelize');

/**
 * Constructeur du modele "groups"
 * @param {Sequelize} sequelize
 * @returns {ModelCtor<any>}
 */
module.exports = (sequelize) => {
    const Groups = sequelize.define('groups', {
        name: {
            type: DataTypes.STRING(100),
            allowNull: false,
            validate: {
                notEmpty: false,
            }
        },
        description: {
            type: DataTypes.TEXT(),
            allowNull: true,
        },
    }, {
        tableName: 'groups'
    });
    return Groups;
};