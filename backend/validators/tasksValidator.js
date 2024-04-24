const yup = require('yup');

const tasksAddValidator = yup.object().shape({
    title: yup.string().trim().required().min(1).max(100),
    description: yup.string().trim().nullable(),
    dateBegin: yup.date().required(),
    isRecurring: yup.boolean(),
    recurrence: yup.mixed().oneOf([null, '', 'daily', 'weekly', 'monthly', 'annual']),
    MemberIdArray: yup.array().of(yup.number().min(1)).min(1).required()
});

const tasksValidator = yup.object().shape({
    title: yup.string().trim().required().min(1).max(100),
    description: yup.string().trim().nullable(),
    dateBegin: yup.date().required(),
    isRecurring: yup.boolean(),
    recurrence: yup.mixed().oneOf([null, '', 'daily', 'weekly', 'monthly', 'annual'])
});

module.exports = {
    tasksValidator, tasksAddValidator
};