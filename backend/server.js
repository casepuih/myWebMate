'use strict';

require('dotenv').config({
    override: false
});


const express = require('express');
require('express-async-errors');

const cors = require('cors');
const router = require('./routers/router');

const db = require('./models');

db.sequelize.authenticate()
    .then(() => console.log('Connection DB successfull'))
    .catch((error) => console.log('Connection DB fail', error));

if (process.env.NODE_ENV === 'development') {
    db.sequelize.sync({ alter: { drop: false } });
}

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api', router);

app.use((error, req, res, next) => {
    if (process.env.NODE_ENV === 'development') {
        console.error(error);
        res.status(500).json(error);
        return;
    }

    res.sendStatus(500);
});

app.listen(process.env.PORT, () => {
    console.log(`Web API up on port ${process.env.PORT}`);
});
