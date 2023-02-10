class LabelsDTO {

    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.color = data.color;
        this.projectId = data.projectId;
        this.MemberId = data.MemberId;
    }
}

module.exports = {
    LabelsDTO
}