class MemberDTO {
    constructor(data) {
        this.id = data.id;
        this.email = data.email;
        this.firstname = data.firstname;
        this.lastname = data.lastname;
        this.isAdmin = data.isAdmin;
    }
}

module.exports =  {
    MemberDTO
}