const { generateTokens } = require("../utils/generateToken");

exports.login = user =>{
    const payload = {id:user.id};

    const {accessToken, refrshToken} = generateTokens(payload);

    return{
        accessToken,
        refrshToken,
        user:{
            id: user.id,
            email: user.email,
        }
    }
}

exports.logout = () => {
    return true;
}