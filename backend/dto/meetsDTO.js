class MeetsDTO {

    constructor(data) {
        this.id = data.id;
        this.title = data.title;
        this.description = data.description;
        this.dateBegin = data.dateBegin;
        this.dateEnding = data.dateEnding;
        this.isRecurring = data.isRecurring;
        this.recurrence = data.recurrence;
        this.MemberId = data.MemberId;
    }
}

module.exports =  {
    MeetsDTO
}