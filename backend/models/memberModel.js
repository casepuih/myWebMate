const { DataTypes, Sequelize, ModelCtor} = require('sequelize');

/**
 * Constructeur du modele "Member"
 * @param {Sequelize} sequelize
 * @returns {ModelCtor<any>}
 */
module.exports = (sequelize) => {
    const Member = sequelize.define('Member', {
        email: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                notEmpty: true,
                isEmail: true
            }
        },
        hashPassword: {
            type: DataTypes.CHAR(97),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        isAdmin: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false
        },
        firstname: {
            type: DataTypes.STRING(100),
            allowNull: false,
        },
        lastname: {
            type: DataTypes.STRING(100),
            allowNull: false,
        }
    }, {
        tableName: 'member',
        timestamps:true,
        indexes: [
            {
                name: 'UK_Member__Email',
                unique: true,
                fields: ['email']
            }
        ]
    });

    return Member
}