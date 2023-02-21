const { GroupsMembersDTO } = require('../dto/groupsMembersDTO');
const db = require('../models');

const groupsMembersService = {

    getAll: async (userId) => {
        const rows = await db.GroupsMembers.findAll();

        return {
            groupsMembers: rows.map(a => new GroupsMembersDTO(a))
        };
    },

    getOne: async (group_id) => {
        const groupsMembers = await db.GroupsMembers.findOne({
            where: {
                group_id: id
            }
        });

        return {
            groupsMembers: new GroupsMembersDTO(groupsMembers)
        };
    },

    isGroupMemberUnique: async (group_id, member_id) => {

        return db.GroupsMembers.count({
            where: {
                group_id: group_id,
                member_id: member_id
            }
        }).then(count => {
            if (count != 0) {
                return false
            }
            return true
        })
    },

    getMemberIdFromOneGroupsMembers: async (group_id, member_id) => {
        const groupsMembers = await db.GroupsMembers.findOne({
            where: {
                group_id: group_id,
                member_id: member_id
            }
        });

        return {
            groupsMembers: new GroupsMembersDTO(groupsMembers)
        };
    },

    add: async (data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const newGroupMember = await db.GroupsMembers.create(data);

        return new GroupsMembersDTO(newGroupMember);
    },

    update: async (id, data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const dataUpdated = await db.GroupsMembers.update(data, {
            where: { id },
            validate: true
        });

        const dataUpdatedReturning = await groupsMembersService.getOne(id);

        console.log(dataUpdatedReturning);

        if (dataUpdatedReturning.groupsMembers.id !== Number(id)) {
            return null;
        }

        return dataUpdatedReturning.groupsMembers;
    },

    delete: async (id) => {
        const nbRowDeleted = await db.GroupsMembers.destroy({
            where: { id }
        });

        return nbRowDeleted === 1;
    }
};

module.exports = groupsMembersService;