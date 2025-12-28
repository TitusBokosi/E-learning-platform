const { generateTokens } = require("../utils/generateToken");

exports.login = user =>{
    const payload = {id:user.id};

    const {accessToken, refreshToken} = generateTokens(payload);
 
    return{
        accessToken,
        refreshToken,
        user:{
            id: user.id,
            email: user.email,
        }
    }
}

exports.logout = () => {
    return true;
}