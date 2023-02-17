const { DataTypes, Sequelize, ModelCtor } = require('sequelize');

/**
 * Constructeur du modele "mine"
 * @param {Sequelize} sequelize
 * @returns {ModelCtor<any>}
 */
module.exports = (sequelize) => {
    const Mine = sequelize.define('tasks', {
        score: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            validate: {
                notEmpty: false,
            }
        },
        difficulty: {
            type: DataTypes.ENUM(),
            allowNull: true,
            values: ['easy', 'medium', 'hard'],
        }
    }, {
        tableName: 'mine'
    });
    return Mine;
};