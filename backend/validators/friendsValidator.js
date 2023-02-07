const yup = require('yup');

const friendsAddValidator = yup.object().shape({
    email: yup.string().trim().required().min(1).max(200).email()
});

module.exports = {
    friendsAddValidator
};