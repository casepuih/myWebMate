const { DataTypes, Sequelize, ModelCtor} = require('sequelize');

/**
 * Constructeur du modele "Invitation"
 * @param {Sequelize} sequelize
 * @returns {ModelCtor<any>}
 */
module.exports = (sequelize) => {
    const Invitation = sequelize.define('Invitation', {
        senderInvitationId: {
            type: DataTypes.INTEGER(),
            allowNull: false,
            validate: {
                notEmpty: true
            }
        },
        reiceverInvitationEmail: {
            type: DataTypes.STRING(200),
            allowNull: false,
            validate: {
                notEmpty: true,
                isEmail: true
            }
        },
    }, {
        tableName: 'invitation',
        timestamps:true,
    });

    return Invitation
}