import { ajvValidator } from "../middlewares/ajvValidator";


const idPersonnel = () => {
    const schema = {
        type: "object",
        properties: {
            idPersonnel: { type: "number", nullable: false, minimum: 0, maximum: 999 },
        },
        required: ["idPersonnel"],
        additionalProperties: false
    }
    return ajvValidator(schema);
};

const getProfData = () => {
    const schema = {
        type: 'object',
        properties: {
            userPhone: { type: 'string' },
            anneeScolaire: { type: "string", nullable: false, minLength: 1, maxLength: 9 },
            codeEtab: { type: "string", nullable: false, minLength: 1, maxLength: 7 },
        },
        required: ['userPhone', 'anneeScolaire', 'codeEtab'],
        additionalProperties: false
    };
    return ajvValidator(schema)
}

const getUpdatedProfData = () => {
    const schema = {
        type: "object",
        properties: {
            appID: { type: "string", nullable: false, maxLength: 30 },
            anneeScolaire: { type: "string", nullable: false, minLength: 1, maxLength: 9 },
            codeEtab: { type: "string", nullable: false, minLength: 1, maxLength: 7 },
            idPersonnel: { type: "number", nullable: false, minimum: 0, maximum: 999 },
        },
        required: ["anneeScolaire", "codeEtab", "idPersonnel"],
        additionalProperties: false
    }
    return ajvValidator(schema);
};

// const ajouterAssiduite = () => {
//     const schema = {
//         type: "array",
//         items: {
//             type: "object",
//             properties: {
//                 anneeScolaire: { type: "string", nullable: false, maxLength: 9 },
//                 codeEtab: { type: "string", nullable: false, maxLength: 7 },
//                 idEleve: { type: "number", nullable: false },
//                 idSeance: { type: "number", nullable: false },
//                 dateAppel: { type: "string", oneOf: [{ format: "date" }, { format: "date-time" }], nullable: false },
//                 plageHoraire: { type: "string", nullable: false },
//                 libelleMatiereCourt: { type: "string", nullable: false },
//                 libelleMatiereLong: { type: "string", nullable: false },
//                 status: { type: "number", nullable: false, minimum: 1, maximum: 2 },
//                 dateSaisie: { type: "string", oneOf: [{ format: "date" }, { format: "date-time" }], nullable: true },
//                 operateurSaisie: { type: "string", nullable: true },
//                 dateModif: { type: "string", oneOf: [{ format: "date" }, { format: "date-time" }], nullable: true },
//                 operateurModif: { type: "string", nullable: true },
//                 recup: { type: "number", nullable: false, minimum: 0, maximum: 1 },
//                 device: { type: "string", nullable: false },
//                 idClasse: { type: "number", nullable: false, minimum: 1, maximum: 999 },
//                 idPersonnel: { type: "number", nullable: false, minimum: 1, maximum: 999 },
//                 motif: { type: "string", nullable: false },
//                 justifie: { type: "number", nullable: false, minimum: 0, maximum: 1 },
//             },
//             required: ["anneeScolaire", "codeEtab", "idEleve", "idSeance", "dateAppel", "status", "recup"],
//             additionalProperties: false
//         }
//     }

//     return ajvValidator(schema);
// };

const ajouterAppel = () => {

    const schemaAssiduites = {
        type: "array",
        items: {
            type: "object",
            properties: {
                idEleve: { type: "number", nullable: false },
                status: { type: "number", nullable: false, minimum: 1, maximum: 2 }
            },
            required: ["idEleve", "status"],
            additionalProperties: false
        }
    }
    const schema = {
        type: "object",
        properties: {
            anneeScolaire: { type: "string", nullable: false, maxLength: 9 },
            codeEtab: { type: "string", nullable: false, maxLength: 7 },
            idSeance: { type: "number", nullable: false },
            dateAppel: { type: "string", oneOf: [{ format: "date" }, { format: "date-time" }], nullable: false },
            plageHoraire: { type: "string", nullable: false },
            libelleMatiereCourt: { type: "string", nullable: false },
            libelleMatiereLong: { type: "string", nullable: false },
            dateSaisie: { type: "string", oneOf: [{ format: "date" }, { format: "date-time" }], nullable: true },
            operateurSaisie: { type: "string", nullable: true },
            dateModif: { type: "string", oneOf: [{ format: "date" }, { format: "date-time" }], nullable: true },
            operateurModif: { type: "string", nullable: true },
            recup: { type: "number", nullable: false, minimum: 0, maximum: 1 },
            device: { type: "string", nullable: false },
            idClasse: { type: "number", nullable: false, minimum: 1, maximum: 999 },
            idPersonnel: { type: "number", nullable: false, minimum: 1, maximum: 999 },
            assiduites: { ...schemaAssiduites }

        },
        required: ["anneeScolaire", "codeEtab", "idSeance", "dateAppel", "assiduites", "recup"],
        additionalProperties: false
    }
    return ajvValidator(schema);
};

const getEvalAndProgValidator = () => {
    const schemaGetEvalAndProgPayload = {
        type: "object",
        properties: {
            codeEtab: { type: "string", nullable: false, minLength: 6, maxLength: 6 },
            anScol: { type: "string", nullable: false, minLength: 9, maxLength: 9 },
            arrayClasse: {
                type: "array",
                nullable: false,
                items: { type: "number" }
            },
            arrayMat: {
                type: "array",
                nullable: false,
                items: { type: "number" }
            },
            arrayPeriode: {
                type: "array",
                nullable: false,
                items: { type: "number" }
            },
            lockEval: { type: "number", nullable: false }
        },
        required: ["codeEtab", "anScol", "arrayClasse", "arrayMat", "arrayPeriode", "lockEval"]
    }
    return ajvValidator(schemaGetEvalAndProgPayload)
}

export default {
    getProfData,
    getUpdatedProfData,
    ajouterAppel,
    idPersonnel,
    getEvalAndProgValidator
}