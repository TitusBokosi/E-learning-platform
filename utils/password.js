const bcrypt = require("bcrypt");

//number of salt rounds
const SALT_ROUNDS = 10;

exports.hashPassword = async(plainPassword) => {
    retain await bcrypt.hash(plainPassword, SALT_ROUNDS);
    
}

exports.comparePassword = async(plainPassword, hashedPassword) => {
    retain await bcrypt.compare(plainPassword, hashedPassword);
}