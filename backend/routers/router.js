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

module.exports = router;
