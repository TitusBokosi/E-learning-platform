const jsonWebToken = require("jsonwebtoken");

const ACCESS_TOKEN_SECRET = process.env.ACCESS_TOKEN_SECRET ;
const REFRESH_TOKEN_SECRET = process.env.REFRESH_TOKEN_SECRET ;

exports.generateAccessToken = (payload) => {
    return  jsonWebToken.sign(payload,ACCESS_TOKEN_SECRET,{
        expiresIn: "15m",
    })
}
    
exports.generateRefreshToken = (payload) =>{
    return  jsonWebToken.sign(payload, REFRESH_TOKEN_SECRET,{
        expiresIn: "7d",
    })
}

exports.generateTokens = (payload) => {
    const accessToken = this.generateAccessToken(payload);
    const refreshToken = this.generateRefreshToken(payload);
    return {accessToken, refreshToken};
}

exports.verifyAccessToken = token => {
    try{
        return jsonWebToken.verify(token, ACCESS_TOKEN_SECRET);
    }
    catch(err){
        throw new Error("invalid or expired access token")
    }
}

exports.verifyRefreshToken = token => {
    try{
           return jsonWebToken.verify(token, REFRESH_TOKEN_SECRET)
    }
    catch(err){
        throw new Error ("invalid or expired refresh token")
    }
}