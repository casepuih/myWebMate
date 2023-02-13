const yup = require('yup');

const boardsValidator = yup.object().shape({
    title: yup.string().trim().required().min(1).max(100),
});

module.exports = {
    boardsValidator
};