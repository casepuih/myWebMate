const linksRouter = require('./linksRouter');
const linksGroupRouter = require('./linksGroupRouter');
const authRouter = require("./authRouter");
const notepadRouter = require("./notepadRouter");
const notesRouter = require("./notesRouter");
const tasksRouter = require("./tasksRouter");
const friendsRouter = require("./friendsRouter");
const memberRouter = require("./memberRouter");
const meetsRouter = require("./meetsRouter");
const mineRouter = require("./mineRouter");
const projectsRouter = require("./projectsRouter");
const labelsRouter = require("./labelsRouter");
const boardsRouter = require("./boardsRouter");
const groupsRouter = require("./groupsRouter");
const groupsMembersRouter = require("./groupsMembersRouter");
const commentariesRouter = require("./commentariesRouter");

const router = require('express').Router();

router.use('/links', linksRouter);
router.use('/linksGroup', linksGroupRouter);
router.use('/auth', authRouter);
router.use('/notepad', notepadRouter);
router.use('/notes', notesRouter);
router.use('/tasks', tasksRouter);
router.use('/friends', friendsRouter);
router.use('/member', memberRouter);
router.use('/meets', meetsRouter);
router.use('/mine', mineRouter);
router.use('/projects', projectsRouter);
router.use('/labels', labelsRouter);
router.use('/boards', boardsRouter);
router.use('/groups', groupsRouter);
router.use('/groupsMembers', groupsMembersRouter);
router.use('/commentaries', commentariesRouter);

module.exports = router;