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

        if (user.isSuspended) {
            return res.status(403).json({
                status: "fail",
                message: "Your account is suspended. Please contact support.",
            });
        }

        req.user = user;
        next();
    })(req, res, next);
}

exports.maybeAuthenticate = (req, res, next) => {
    passport.authenticate("jwt-access", {session:false}, (err, user, info) =>{
        if(err) return next (err);
        if(user && !user.isSuspended) {
            req.user = user;
        }
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
                message: info?.message || "Unauthorized access",
            })
        }

        req.user =user;
        next();
    })(req, res , next);
}

exports.authorize = (...roles) => {
    return (req, res, next) => {
        if (req.user && roles.includes(req.user.role)) {
            next();
        } else {
            res.status(403).json({
                status: "fail",
                message: `Forbidden: Access restricted to roles: ${roles.join(', ')}`,
            });
        }
    };
};

exports.authorizeAdmin = (req, res, next) => {
    if (req.user && req.user.role === 'ADMIN') {
        next();
    } else {
        res.status(403).json({
            status: "fail",
            message: "Forbidden: Admin access required",
        });
    }
};