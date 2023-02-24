const yup = require('yup');

const groupsMembersValidator = yup.object().shape({
    isAdmin: yup.boolean(),
    tier: yup.number(),
    member_id: yup.number(),
    group_id: yup.number()
});


module.exports = {
    groupsMembersValidator
};