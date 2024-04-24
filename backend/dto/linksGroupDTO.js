class LinksGroupDTO {

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.description = data.description;
        this.MemberId = data.MemberId;
    }
}

module.exports =  {
    LinksGroupDTO
}