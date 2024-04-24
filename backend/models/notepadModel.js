const { DataTypes, Sequelize, ModelCtor } = require('sequelize');

/**
 * Constructeur du modele "Notepad"
 * @param {Sequelize} sequelize
 * @returns {ModelCtor<any>}
 */
module.exports = (sequelize) => {
    const Notepad = sequelize.define('notepad', {
        content: {
            type: DataTypes.TEXT(),
            allowNull: false
        }
    }, {
        tableName: 'notepad'
    });
    return Notepad;
};