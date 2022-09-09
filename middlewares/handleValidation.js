const {validationResult} = require("express-validator");

const validate = (req, resp, next) => {
    
    const errors = validationResult(req);

    if(errors.isEmpty()){
        return next();
    };

    const extractedErrors = [];

    errors.array().map((err) => extractedErrors.push(err.msg));

    return resp.status(422).json({
        errors: extractedErrors
    })

}

module.exports = validate;