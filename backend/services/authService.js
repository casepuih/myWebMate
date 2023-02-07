const argon2 = require('argon2');
const memberService = require("./memberService");

const authService = {
    register: async (email, password, firstname, lastname) => {
        const hashPassword = await argon2.hash(password, {
            type: 2
        });

        console.log("email : ", email, " hasspass : ", hashPassword, " firstname : ", firstname, "lastname : ", lastname);

        const member = await memberService.add({
            email,
            hashPassword,
            firstname,
            lastname
        });

        return member;
    },

    login: async (email, password) => {
        const hashPassword = await memberService.getHashPassword(email);

        if (!hashPassword) {
            return null;
        }

        const isValid = await argon2.verify(hashPassword, password);

        if (!isValid) {
            return null;
        }

        return await memberService.getByEmail(email);
    }
};

module.exports = authService;
