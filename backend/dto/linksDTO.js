class LinksDTO {

    constructor(data) {
        this.id = data.id;
        this.name = data.name;
        this.link = data.link;
        this.description = data.description;
        this.linksGroupId = data.linksGroupId;
        this.MemberId = data.MemberId;
    }
}

module.exports =  {
    LinksDTO
}