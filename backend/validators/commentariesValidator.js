const yup = require('yup');

const commentariesValidator = yup.object().shape({
    commentary: yup.string().trim().required().min(1).max(500),
});

module.exports = {
    commentariesValidator
};