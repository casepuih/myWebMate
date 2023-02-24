const { DataTypes, Sequelize, ModelCtor } = require('sequelize');

/**
 * Constructeur du modele "meet"
 * @param {Sequelize} sequelize
 * @returns {ModelCtor<any>}
 */
module.exports = (sequelize) => {
    const Meets = sequelize.define('meets', {
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
            validate: {
                notEmpty: false,
            }
        },
        dateEnding: {
            type: DataTypes.DATE(),
            allowNull: false,
            validate: {
                notEmpty: false,
            }
        },
        isRecurring: {
            type: DataTypes.BOOLEAN(),
            defaultValue: false
        },
        recurrence: {
            type: DataTypes.ENUM(),
            allowNull: true,
            values: ['', 'daily', 'weekly', 'monthly', 'annual'],
            validate: {
                notEmpty: function (value) {
                    if (this.isRecurring && !value) {
                        throw new Error('recurrence ne peut pas être null si isRecurring est true');
                    }
                }
            }
        }
    }, {
        tableName: 'meets'
    });
    return Meets;
};