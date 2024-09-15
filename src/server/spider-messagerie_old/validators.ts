import { ajvValidator } from "../middlewares/ajvValidator";


const providerValidator = () => {
    const schema = {
        type: "object",
        properties: {
            providerId: { type: "number", nullable: false },
            login: { type: "string", nullable: false },
            password: { type: "string", nullable: false },
            sender: { type: "string", nullable: false },
            sendSmsAfterControl: { type: "number", nullable: false },
            // price: { type: "number", nullable: true },
            sendSmsAppel: { type: "number", nullable: false },
        },
        required: ["providerId", "login", "password", "sender"],
        additionalProperties: true
    }
    return ajvValidator(schema);
};

const sendSmsVbaValidator = () => {
    const schema = {
        type: "object",
        properties: {
            providerId: { type: "number", nullable: false }
        },
        required: ["providerId"],
        additionalProperties: false
    }
    return ajvValidator(schema);
};

const vbaSmsToSendBoxValidator = () => {
    const schema = {
        type: "object",
        properties: {
            phone: {
                type: "array", items: {
                    type: "string",
                    minLength: 1
                }
            },
            smsContent: { type: "string", nullable: false }
        },
        required: ["phone", "smsContent"],
        additionalProperties: false
    }
    return ajvValidator(schema);
}


const sessionIdsValidator = () => {
    const schema = {
        type: "object",
        properties: {
            sessionIds: {
                type: "array", items: {
                    type: "string",
                    minLength: 1
                }
            }
        },
        required: ["sessionIds"],
        additionalProperties: false
    }
    return ajvValidator(schema);
}

const envoyerMessagesAssiduiteValidator = () => {
    const schema = {
        type: "object",
        properties: {
            seance: {
                type: "object",
                properties: {
                    dateDebut: { type: "string", format: "date", nullable: false },
                    dateFin: { type: "string", format: 'date', nullable: false },
                },
                required: ["dateDebut", "dateFin"],
                additionalProperties: false
            },
            idEleves: {
                type: "array", items: {
                    type: "number",
                    minLength: 1
                }
            },
            sendNow: { type: 'boolean' },
        },
        required: ["seance", "idEleves", "sendNow"],
        additionalProperties: false
    }
    return ajvValidator(schema);
}

const envoyerSmsAssiduiteValidator = () => {
    const schema = {
        type: "object",
        properties: {
            seance: {
                type: "object",
                properties: {
                    dateDebut: { type: "string", format: "date", nullable: false },
                    dateFin: { type: "string", format: 'date', nullable: false },
                },
                required: ["dateDebut", "dateFin"],
                additionalProperties: false
            },
            idEleves: {
                type: "array", items: {
                    type: "number",
                    minLength: 1
                }
            },
            sendNow: { type: 'boolean' },
            providerId: { type: "number", nullable: false },
            smsDestinataireKey: { type: "string", nullable: false },
        },
        required: ["seance", "idEleves", "sendNow", "providerId", "smsDestinataireKey"],

        additionalProperties: false
    }
    return ajvValidator(schema);
}

const addOrUpdateFournisseurValidator = () => {
    const schema = {
        type: 'object',
        properties: {
            idFournisseur: { type: 'string' },
            nomPrenomFournisseur: { type: 'string' },
            fonctionFournisseur: { type: 'string' },
            cellulaireFournisseur: { type: 'string' },
        },
        required: ['idFournisseur', 'nomPrenomFournisseur', 'fonctionFournisseur', 'cellulaireFournisseur'],
        additionalProperties: true
    };
    return ajvValidator(schema);
};

const deleteFournisseurValidator = () => {
    const schema = {
        type: 'object',
        properties: {
            idFournisseur: { type: 'string' },
        },
        required: ['idFournisseur'],
        additionalProperties: false
    };
    return ajvValidator(schema);
};



const insererMessageGroupeBoiteEnvoiValidator = () => {
    const schema = {
        type: 'object',
        properties: {
            targetAppId: { type: 'string' },
            idEleves: {
                type: 'array',
                items: { type: 'number' }
            },
            messageTitle: { type: 'string' },
            messageContent: { type: 'string' },
            alertLevel: { enum: ['Info', 'Success', 'Warning', 'Danger'] },
            sendNow: { type: 'boolean' },
        },
        required: ['targetAppId', 'idEleves', 'messageTitle', 'messageContent', 'alertLevel', 'sendNow'],
        additionalProperties: false
    };
    return ajvValidator(schema);
}

const insererSmsBoiteEnvoie = () => {
    const schema = {
        type: 'object',
        properties: {
            providerId: { type: "number", nullable: false },
            idPersonnes: {
                type: 'array',
                items: {
                    "oneOf": [
                        { "type": "number" },
                        { "type": "string" }
                    ]
                }
            },
            smsContent: { type: 'string' },
            sendNow: { type: 'boolean' },
            smsDestinataireKey: { type: 'string' },
        },
        required: ['providerId', 'idPersonnes', 'smsContent', 'sendNow', 'smsDestinataireKey'],
        additionalProperties: false
    };
    return ajvValidator(schema);
}

const envoyerSmsBoiteEnvoiValidator = () => {
    const schema = {
        type: 'object',
        properties: {
            providerId: { type: "number", nullable: false },
            sessionIds: {
                type: 'array',
                items: { type: 'string' }
            }
        },
        required: ['providerId', 'sessionIds'],
        additionalProperties: false
    };
    return ajvValidator(schema);
}

const envoyerSmsResultatScolaireValidator = () => {
    const schema = {
        type: 'object',
        properties: {
            sendNow: { type: 'boolean' },
            providerId: { type: 'number' },
            smsDestinataireKey: { type: 'string' },
            etabElevesSelected: { type: 'array', items: { type: 'any' } }, // Allow any type
            typesResultatsSelectedId: { type: 'string' },
            dateDebut: { type: ['string', 'undefined'] },
            dateFin: { type: ['string', 'undefined'] },
        },
        required: ['sendNow', 'providerId', 'smsDestinataireKey', 'etabElevesSelected', 'typesResultatsSelectedId'],
        additionalProperties: false
    };
    return ajvValidator(schema);
};

const envoyerNotificationResultatsScolairesValidator = () => {
    const schema = {
        type: 'object',
        properties: {
            sendNow: { type: 'boolean' },
            etabElevesSelected: { type: 'array', items: { type: 'any' } }, // Allow any type
            typesResultatsSelectedId: { type: 'string' },
            dateDebut: { type: ['string', 'undefined'] },
            dateFin: { type: ['string', 'undefined'] },
        },
        required: ['sendNow',  'etabElevesSelected', 'typesResultatsSelectedId'],
        additionalProperties: false
    };
    return ajvValidator(schema);
};


export default {
    providerValidator,
    sendSmsVbaValidator,
    sessionIdsValidator,
    envoyerMessagesAssiduiteValidator,
    insererMessageGroupeBoiteEnvoiValidator,
    insererSmsBoiteEnvoie,
    envoyerSmsBoiteEnvoiValidator,
    envoyerSmsAssiduiteValidator,
    vbaSmsToSendBoxValidator,
    addOrUpdateFournisseurValidator,
    deleteFournisseurValidator,
    envoyerSmsResultatScolaireValidator,
    envoyerNotificationResultatsScolairesValidator
}