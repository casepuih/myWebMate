const { TasksDTO } = require('../dto/tasksDTO');
const db = require('../models');
const sql = require('../utils/sql.utils');

const tasksService = {

    getAll: async (userId) => {
        const tasks = await db.Tasks.findAll({
            include: [{
                model: db.Member,
                through: {
                    where: { MemberId: userId }
                }
            }],
            where: { '$MemberId$': userId }
        });

        const tasksClear = tasks.map(a => new TasksDTO(a));

        let taskArray = [];
        tasksClear.forEach( task => taskArray.push(task.id));

        if (taskArray.length === 0) {
            taskArray.push(0);
        }

        const [tasksId] = await (await sql).query(`SELECT taskId, MemberId FROM membertasks
                                         WHERE taskId IN (?)`, [taskArray]);

        const grouped = {};

        tasksId.forEach(item => {
            if (!grouped[item.taskId]) {
                grouped[item.taskId] = {
                    taskId: item.taskId,
                    MemberId: [item.MemberId]
                };
            } else {
                grouped[item.taskId].MemberId.push(item.MemberId);
            }
        });

        const arrayToAdd = Object.values(grouped);

        const tasksWithMember = tasksClear.map(a => {
            const matchedData = arrayToAdd.find(data => data.taskId === a.id);
            a.MemberId = matchedData ? matchedData.MemberId : [];
            return a;
        });

        return {
            tasks: tasksWithMember
        };
    },

    getOne: async (id, userId) => {
        const [tasks] = await (await sql).query(`SELECT tasks.* FROM tasks
                                         LEFT JOIN membertasks ON membertasks.taskId = tasks.id
                                         WHERE membertasks.MemberId= ? AND tasks.id = ?`, [userId, id]);

        return {
            task: tasks.map(a => new TasksDTO(a))
        };
    },

    add: async (data) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const newTask = await db.Tasks.create(data);
        newTask.MemberId = data.MemberIdArray;

        newTask.MemberId.forEach( async (id)=> {
              const relation = await newTask.addMember(id);
            }
        )

        return new TasksDTO(newTask);
    },

    getMemberIdFromOneTask: async (id) => {
        const [tasks] = await (await sql).query(`SELECT membertasks.MemberId FROM tasks
                                         LEFT JOIN membertasks ON membertasks.taskId = tasks.id
                                         WHERE tasks.id = ?`, [id]);

        return {
            memberId: tasks
        };
    },

    update : async (id, data, userId) => {
        if (!data) {
            throw new Error('Data is required !');
        }

        const dataUpdated = await db.Tasks.update(data, {
            where: { id },
            validate: true
        });

        const dataUpdatedReturning = await tasksService.getOne(id, userId);
        console.log(dataUpdatedReturning.task.id, "dddddd", Number(id));
        if (dataUpdatedReturning.task[0].id !== Number(id)) {
            return null;
        }

        return dataUpdatedReturning.task;
    },

    delete : async (id, userId) => {
        await (await sql).query(`DELETE FROM membertasks
                                     WHERE taskId = ? AND MemberId = ?`, [id, userId]);

        const [tasks] = await (await sql).query(`SELECT taskId FROM membertasks
                                         WHERE taskId = ?`, [id]);

        if (tasks.length === 0) {
            await db.Tasks.destroy({
                where: {
                    id: id
                }
            });
        }

        return true;
    }
};

module.exports = tasksService;