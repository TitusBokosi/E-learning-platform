const {validationResult} = require('express-validator');

const validateRequest = (req, res, next)=>{

    const errors = validateRequest(req);

    if(errors.isEmpty()){

        return next();
    }

    const formatted = errors.array().map(err => ({
        //formatted errors
    }))

    return res.status(400).json({
        // return
    })

}

module.exports = validateRequest