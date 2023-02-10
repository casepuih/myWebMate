const { DataTypes, Sequelize, ModelCtor } = require('sequelize');

/**
 * Constructeur du modele "projects"
 * @param {Sequelize} sequelize
 * @returns {ModelCtor<any>}
 */
module.exports = (sequelize) => {
    const Projects = sequelize.define('project', {
        title: {
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
        dateBegin: {
            type: DataTypes.DATE(),
            allowNull: false,
            defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
        },
        dateEnding: {
            type: DataTypes.DATE(),
            allowNull: true,
        },
    }, {
        tableName: 'project'
    });
    return Projects;
};