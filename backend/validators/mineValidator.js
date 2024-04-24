const yup = require('yup');

const mineValidator = yup.object().shape({
    score: yup.number().required(),
    difficulty: yup.string().trim().min(2).max(7),
});

module.exports = {
    mineValidator
};