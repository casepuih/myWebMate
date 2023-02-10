class ProjectsDTO {

    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.MemberId = data.MemberId;
    }
}

module.exports = {
    ProjectsDTO
}