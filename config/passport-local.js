const { getUserByEmail } = require("../queries/users");
const { comparePassword } = require("../utils/password");
const LocalStrategy = require("passport-local").Strategy;


export const initializePassport = passport =>{
    passport.use(
        new LocalStrategy({
            usernameField: "email",
            passwordField: "password",
        },
    async (email, password, done)=>{
        try{
            const user = await getUserByEmail(email);
            if(!user){
                return done (null, false, {message: "User not found"});
            }

            const isMatch = await comparePassword(password, user.password);

            if(!isMatch){
                return done (null, false, {message: "Incorrect password"});
            }

            return done(null, user);
        }
        catch(err){
            return done (err);
        }
    })
    )
}
