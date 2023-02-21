class GroupsMembersDTO {

    constructor(data) {
        this.id = data.id;
        this.isAdmin = data.isAdmin;
        this.member_id = data.member_id;
        this.group_id = data.group_id;
        this.tier = data.tier;
    }
}

module.exports = {
    GroupsMembersDTO
}