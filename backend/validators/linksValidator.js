const yup = require('yup');

const linksValidator = yup.object().shape({
    name: yup.string().trim().min(2).max(50),
    link: yup.string().trim().min(2).max(400),
    description: yup.string().nullable().trim().min(2).max(300),
    linksGroupId: yup.number()
});


module.exports = {
    linksValidator
};