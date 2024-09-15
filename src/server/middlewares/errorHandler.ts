import { hasOnlyProperties, isObject } from "../helpers/function";

const GLOBAL_ERROR_MSG = { name: "ERROR_OCCURED", message: "Une erreur est survenue." }
// ErrorHandler.js
const errorHandler = (err, req, res, next) => {
    console.log("Middleware Error Hadnling", err);
    let error: { name: string, message: string };

    if (!isObject(err)) error = GLOBAL_ERROR_MSG
    else if (hasOnlyProperties(err, ['name', 'message'])) error = { name: err.name, message: err.message };
    else error =GLOBAL_ERROR_MSG

    res.json({
        status: 0,
        error: error
    })
}
// les catch des controller doivent etre ==>  .catch(error => next(error))
export default errorHandler


