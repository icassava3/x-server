const Ajv = require("ajv");
const addFormats = require("ajv-formats");
const localize = require("ajv-i18n");


export const ajvValidator = (schema) => {
  return (req, res, next) => {
    const ajvInstance = new Ajv({ allErrors: true });
    addFormats(ajvInstance);
    const validate = ajvInstance.compile(schema)
    const valid = validate(req.body);
    if (!valid) {
      // it is imperative that the reference to the error is copied
      // the next time ajv runs the error object could be overridden
      // because under the hood it is just a pointer
      // that's why the reference needs to be copied in the same execution
      // block. Note that Node is single-threaded and you do not have
      // concurrency
      // in this simple example it would work without copying
      // simply because we are directly terminating the request with
      // res.status(400).json(...)
      // but in general copying the error reference is crucial
      const error: any[] = validate.errors;
      console.log('validator error :++ ',error)
      localize.fr(validate.error);
      return res.status(400).send({ status: 0, error });
    }
    next();
  };
};

/**
 * Valider un schema en renvoyant un boolean
 * @param schema le schema de validation
 * @param data le payload a valider
 * @returns 
 */
export const ajvValidateSchema = (schema, data) => {
console.log("🚀 ~ file: ajvValidator.ts:47 ~ ajvValidateSchema ~ ajvValidateSchema+++++++++++++:")

  const ajvInstance = new Ajv({ allErrors: true });
  addFormats(ajvInstance);
  console.log("🚀 ~ file: ajvValidator.ts:44 ~ ajvValidateSchema ~ addFormats:")
  const validate = ajvInstance.compile(schema)
  console.log("🚀 ~ file: ajvValidator.ts:44 ~ ajvValidateSchema ~ validate:", validate)
  const valid = validate(data);
  console.log("🚀 ~ file: ajvValidator.ts:43 ~ ajvValidateSchema ~ valid:", valid)
  if (!valid) return false;
  return true;
};
