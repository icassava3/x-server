import { ajvValidateSchema, ajvValidator } from "../middlewares/ajvValidator";

const vbaclientLogin = () => {
/**
 device: {
    appID: 'SPD2021',
    appName: 'SPIDER-APP-DEV',
    userPhone: '0000000000',
    userName: 'samloba',
    modelName: 'DESKTOP-RDE3BUP',
    deviceName: 'DESKTOP-RDE3BUP',
    deviceType: 'Desktop'
  },
 */
    const schemaDevice = {
        type: "object",
        properties: {
            appID: { type: "string", nullable: false },
            appName: { type: "string", nullable: false },
            userPhone: { type: "string", nullable: false },
            userName: { type: "string", nullable: true },
            modelName: { type: "string", nullable: false },
            deviceName: { type: "string", nullable: false },
            deviceType: { type: "string", nullable: false },
        },
        required: ["appID", "appName", "userPhone", "userName", "modelName", "deviceName", "deviceType"],
        additionalProperties: false
    }
    const schemaSpiderUsers = {
        type: "array",
        items: {
            type: "object",
            properties: {
                username: { type: "string", nullable: false },
                password: { type: "string", nullable: true }
            },
            required: ["username", "password"],
            additionalProperties: false
        }
    }

    const schemaSpiderSuperAdmins = {
        type: "array",
        items: {
            type: "object",
            properties: {
                username: { type: "string", nullable: false },
                password: { type: "string", nullable: true }
            },
            required: ["username", "password"],
            additionalProperties: false
        }
    }

    const schemaSpiderAgents = {
        type: "array",
        items: {
            type: "object",
            properties: {
                username: { type: "string", nullable: false },
                password: { type: "string", nullable: false }
            },
            required: ["username", "password"],
            additionalProperties: false
        }
    }

    const schema = {
        type: 'object',
        properties: {
            device: schemaDevice,
            spiderUsers: schemaSpiderUsers,
            spiderSuperAdmins: schemaSpiderSuperAdmins,
            spiderAgents: schemaSpiderAgents
        },
        required: ['device',/*  'spiderUsers', */ 'spiderSuperAdmins', 'spiderAgents'],
        additionalProperties: true
    };

    // const schema = {
    //     type: 'object',
    //     properties: {
    //         device: schemaDevice,
    //     },
    //     required: ['device'],
    //     additionalProperties: true
    // };
    return ajvValidator(schema)
}
/*
{
 appID: 'SC2023',
 appName: 'SCHOOL-CONTROL',
 userName: 'AMOUZOU KOFFI',
 modelName: 'iPhone 7',
 deviceName: 'iPhone',
 deviceType: 'Phone',
 EIO: '4',
 transport: 'websocket'
}
*/
export const handshakeQueryValidate = (handshakeQuery) => {
    const schema = {
        type: "object",
        properties: {
            appID: { type: "string", nullable: false },
            appName: { type: "string", nullable: false },
            userPhone: { type: "string", nullable: false },
            userName: { type: "string", nullable: false, minLength:1 },
            modelName: { type: "string", nullable: false },
            deviceName: { type: "string", nullable: false },
            deviceType: { type: "string", nullable: false },
        },
        required: ["appID", "appName", "userPhone", "userName", "modelName", "deviceName", "deviceType"],
        additionalProperties: true
    }
    return ajvValidateSchema(schema, handshakeQuery);
}


export default {
    vbaclientLogin,
    handshakeQueryValidate
}