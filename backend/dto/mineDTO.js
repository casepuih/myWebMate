class MineDTO {

    constructor(data) {
        this.id = data.id;
        this.score = data.score;
        this.difficulty = data.difficulty;
        this.MemberId = data.MemberId;
        this.highscore = data?.highscore;
        this.firstname = data.Member?.firstname;
        this.lastname = data.Member?.lastname;
    }
}

module.exports =  {
    MineDTO
}