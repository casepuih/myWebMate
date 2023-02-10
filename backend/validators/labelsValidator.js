const yup = require('yup');

const labelsValidator = yup.object().shape({
    title: yup.string().trim().required().min(1).max(100),
    color: yup.string().trim().required().min(3).max(12),
    ProjectId: yup.number(),
    MemberId: yup.number()
});

module.exports = {
    labelsValidator
};