const yup = require('yup');

const linksGroupValidator = yup.object().shape({
    name: yup.string().trim().min(2).max(50),
    description: yup.string().nullable().trim().max(300),
});


module.exports = {
    linksGroupValidator
};