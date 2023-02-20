const yup = require('yup');

const groupsValidator = yup.object().shape({
    name: yup.string().trim().min(2).max(50),
    description: yup.string().nullable().trim().min(2).max(300),
});


module.exports = {
    groupsValidator
};