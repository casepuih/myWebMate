const { DataTypes, Sequelize, ModelCtor } = require('sequelize');

/**
 * Constructeur du modele "groupsMembers"
 * @param {Sequelize} sequelize
 * @returns {ModelCtor<any>}
 */
module.exports = (sequelize) => {
    const GroupsMembers = sequelize.define('groups_members', {
        isAdmin: {
            type: DataTypes.BOOLEAN(),
            defaultValue: 0
        },
        tier: {
            type: DataTypes.INTEGER(),
            defaultValue: 0
        },
    }, {
        tableName: 'groups_members'
    });
    return GroupsMembers;
};