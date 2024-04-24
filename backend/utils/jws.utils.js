const jwt = require('jsonwebtoken');

const generateJWT = ({id, email, isAdmin}) => {
    return new Promise((resolve, reject) => {

        const data = {id, email, isAdmin};
        const secret = process.env.JWT_SECRET;

        jwt.sign(data, secret, {
            algorithm: "HS512",
            audience: process.env.JWT_AUDIENCE,
            issuer: process.env.JWT_ISSUER,
            expiresIn: '3650d'
        }, (error, token) =>{
            if(error) {
                reject(error);

                return;
            }

            resolve(token);
        })
    })
}

const decodeJWT = (token) => {
    if (!token) {
        return Promise.reject(new Error('Invalid JWT'));
    }

    return new Promise((resolve, reject) => {
        const secret = process.env.JWT_SECRET;
        const options = {
            audience: process.env.JWT_AUDIENCE,
            issuer: process.env.JWT_ISSUER
        }

        jwt.verify(token, secret, options, (error, data) => {
            if (error) {
                reject(error);

                return;
            }

            resolve({
                id: data.id,
                email: data.email,
                isAdmin: data.isAdmin
            })
        })
    })
}

module.exports = {
    generateJWT,
    decodeJWT
}
