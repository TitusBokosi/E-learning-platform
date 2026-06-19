
const { getUserById } = require("../queries/users");
const JWTStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

module.exports = passport => {

  const accessTokenOptions = {
    jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey:process.env.ACCESS_TOKEN_SECRET,
  };

  passport.use(

    
    "jwt-access",
    new JWTStrategy(accessTokenOptions, async(payload, done)=>{
      try{
        const user = await getUserById(payload.id);

        if(user){
          return done(null, user)
        }

        return done(null, false);
      }
      catch(err){
        return done(err, false);
      }
    })
  )
  const refreshTokenOptions = {
    jwtFromRequest: req => req.cookies?.refreshToken,
    secretOrKey:process.env.REFRESH_TOKEN_SECRET,
  };

  passport.use(
    "jwt-refresh",
    new JWTStrategy(refreshTokenOptions, async(payload, done) =>{
      try{
        const user = await getUserById(payload.id);

      if(user){
        return done(null, user);
      }

      return done (null, false);
      }
      catch(err){
        return done (err, false);
      }
    })
  )
}