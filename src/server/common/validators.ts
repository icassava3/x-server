import { ajvValidator } from "../middlewares/ajvValidator";


const authentification = () => {
    const schema = {
        type: "object",
        properties: {
            userLogin: { type: "string", nullable: false },
            userPassword: { type: "string", nullable: false },
        },
        required: ["userLogin", "userPassword",],
        additionalProperties: false
    }
    return ajvValidator(schema);
};

export default {
    authentification
}