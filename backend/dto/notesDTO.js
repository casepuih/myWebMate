class NotesDTO {

    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.content = data.content;
        this.MemberId = data.MemberId;
    }
}

module.exports =  {
    NotesDTO
}