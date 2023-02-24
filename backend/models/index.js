const { Sequelize } = require('sequelize');
const { DB_SERVER, DB_PORT, DB_DATABASE, DB_USERNAME, DB_PASSWORD } = process.env;

const sequelize = new Sequelize(DB_DATABASE, DB_USERNAME, DB_PASSWORD, {
    host: DB_SERVER,
    port: DB_PORT,
    dialect: 'mysql'
});

const db = {};

db.sequelize = sequelize;

db.Links = require('./linksModel')(sequelize);
db.LinksGroup = require('./linksGroupModel')(sequelize);
db.Member = require('./memberModel')(sequelize);
db.Notepad = require('./notepadModel')(sequelize);
db.Notes = require('./notesModel')(sequelize);
db.Tasks = require('./tasksModel')(sequelize);
db.Meets = require('./meetsModel')(sequelize);
db.Invitation = require('./invitationModel')(sequelize);
db.Mine = require('./mineModel')(sequelize);
db.Projects = require('./projectsModel')(sequelize); //
db.Labels = require('./labelsModel')(sequelize); //
db.Boards = require('./boardsModel')(sequelize); //
db.Groups = require('./groupsModel')(sequelize); //
db.GroupsMembers = require('./groupsMembersModel')(sequelize); //
db.Commentaries = require('./commentariesModel')(sequelize); //

db.Tasks.belongsToMany(db.Member, { through: 'MemberTasks' });
db.Member.belongsToMany(db.Tasks, { through: 'MemberTasks' });

db.Meets.belongsToMany(db.Member, { through: 'MemberMeets' });
db.Member.belongsToMany(db.Meets, { through: 'MemberMeets' });

db.Member.belongsToMany(db.Member, { through: 'Friends', as: 'Friendship' });

db.Mine.belongsTo(db.Member);
db.Member.hasMany(db.Mine, {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'NO ACTION'
});

db.Links.belongsTo(db.LinksGroup);
db.LinksGroup.hasMany(db.Links, {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'NO ACTION'
});

db.Links.belongsTo(db.Member);
db.Member.hasMany(db.Links, {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'NO ACTION'
});

db.Notes.belongsTo(db.Member);
db.Member.hasMany(db.Notes, {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'NO ACTION'
});

db.LinksGroup.belongsTo(db.Member);
db.Member.hasMany(db.LinksGroup, {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'NO ACTION'
});


db.Member.hasOne(db.Notepad);
db.Notepad.belongsTo(db.Member);

//
db.Projects.belongsTo(db.Member);
db.Member.hasMany(db.Projects, {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'NO ACTION'
});

db.Labels.belongsTo(db.Projects);
db.Projects.hasMany(db.Labels, {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'NO ACTION'
});

db.Labels.belongsTo(db.Member);
db.Member.hasMany(db.Labels, {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'NO ACTION'
});

db.Boards.belongsTo(db.Member);
db.Projects.belongsTo(db.Boards);

db.Boards.belongsToMany(db.Groups, {
    through: "groups_boards",
    as: "groups",
    foreignKey: "boardId",
});
db.Groups.belongsToMany(db.Boards, {
    through: "groups_boards",
    as: "boards",
    foreignKey: "groupId",
});

db.GroupsMembers.belongsTo(db.Member, {
    foreignKey: "member_id",
});
db.GroupsMembers.belongsTo(db.Groups, {
    foreignKey: "group_id",
});

db.Commentaries.belongsTo(db.Member, {
    foreignKey: "memberId",
})

db.Projects.hasMany(db.Commentaries, {
    foreignKey: {
        allowNull: false
    },
    onDelete: 'NO ACTION'
});

module.exports = db;

