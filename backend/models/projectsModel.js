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
    }, {
        tableName: 'project'
    });
    return Projects;
};