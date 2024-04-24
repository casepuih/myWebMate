const yup = require('yup');

const notesValidator = yup.object().shape({
    title: yup.string().trim().required().min(1).max(100),
    content: yup.string().trim().nullable(),
    MemberId: yup.number()
});

module.exports = {
    notesValidator
};