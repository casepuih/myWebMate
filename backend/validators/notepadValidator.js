const yup = require('yup');

const notepadValidator = yup.object().shape({
    content: yup.string().trim(),
});


module.exports = {
    notepadValidator
};