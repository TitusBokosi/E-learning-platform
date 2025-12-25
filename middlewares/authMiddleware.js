const passport = require("passport");

exports.authenticateLocal = (req, res, next) => {
    passport.authenticate("local", {session: false}, (err, user, info) =>{
    if (err)
        return next(err);

    if(!user){
        return res.status(401).json({
            status: "fail",
            message: info.message || "Authentication failed",
        })
    }
    req.user =user;
    next();
}) (req, res, next);
}

exports.authenticateAccessToken = (req, res, next) =>{
    passport.authenticate("jwt-access", {session:false}, (err, user, info) =>{
        if(err)
            return next (err);

        if(!user){
            return res.status(401).json({
                status:"fail",
                message: info.message || "Unauthorized access"
            })
        }

        req.user = user;
        next();
    })(req, res, next);
}

exports.authenticateRefreshToken = (req, res, next) => {
    passport.authenticate("jwt-refresh", {session: false}, (err, user, info)=>{
        if(err)
            return next(err);

        if(!user){
            return res.status(401).json({
                status:"fail",
                message: info.message || "Unauthorized access",
            })
        }

        req.user =user;
        next();
    })(req, res , next);
}