const yup = require('yup');

const regexPwd = /((?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W_]).+)/;
const regexPwdError = 'Mot de passe trop faible';

const memberRegisterValidator = yup.object().shape({
    email: yup.string().trim().required().email().max(200),
    password: yup.string().required().min(8).matches(regexPwd, regexPwdError),
    firstname: yup.string().required().min(2).max(100),
    lastname: yup.string().required().min(2).max(100),
});

const memberLoginValidator = yup.object().shape({
    email: yup.string().trim().required(),
    password: yup.string().required()
});

const memberProfilValidator = yup.object().shape({
    firstname: yup.string().required().min(2).max(100),
    lastname: yup.string().required().min(2).max(100),
});

const memberPasswordChange = yup.object().shape({
    oldPassword: yup.string().required().min(8),
    newPassword: yup.string().required().min(8).matches(regexPwd, regexPwdError)
})

const memberEmailChange = yup.object().shape({
    newEmail: yup.string().trim().required().email().max(200)
})

module.exports = {
    memberLoginValidator,
    memberRegisterValidator,
    memberProfilValidator,
    memberPasswordChange,
    memberEmailChange
}