const bcrypt = require("bcrypt");

//number of salt rounds
const SALT_ROUNDS = 10;

exports.hashPassword = async(plainPassword) => {
    return await bcrypt.hash(plainPassword, SALT_ROUNDS);
    
}

exports.comparePassword = async(plainPassword, hashedPassword) => {
    return await bcrypt.compare(plainPassword, hashedPassword);
}