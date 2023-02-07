class InvitationDTO {
    constructor(data) {
        this.id = data.id;
        this.senderInvitationId = data.senderInvitationId;
        this.reiceverInvitationEmail = data.reiceverInvitationEmail;
    }
}

module.exports =  {
    InvitationDTO
}