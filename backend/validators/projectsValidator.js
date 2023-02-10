const yup = require('yup');

const projectsValidator = yup.object().shape({
    title: yup.string().trim().required().min(1).max(100),
    description: yup.string().trim().nullable(),
    dateBegin: yup.date().required(),
    dateEnding: yup.date().nullable(),
    MemberId: yup.number()
});

module.exports = {
    projectsValidator
};