import { ajvValidator } from "../../../middlewares/ajvValidator";

const nouveauRapportValidator = () => {
    const schema = {
        type: 'object',       
        properties: {
            idModeleRapport: { type: 'string', nullable: false, minLength: 1 },
            libelleRapport: { type: 'string', nullable: false, minLength: 1 },
            revisionModeleRapport: { type: 'number', nullable: false },
            planModeleRapport: {
                type: 'array',
                items: {
                    type: 'object',
                    properties: {
                        index: { type: 'number', nullable: false },
                        title: { type: 'string', nullable: false, minLength: 1 },
                        name: { type: 'string', nullable: false, minLength: 1},
                        typographie: { type: 'string', nullable: false, minLength: 1 },
                    },
                },
            },            // rapportData: { type: 'array', minLength: 1, errorMessage: { minLength: "Le contenu du rapport ne peut pas être vide !" } },
        },
        required: ['idModeleRapport', 'libelleRapport', 'planModeleRapport', 'revisionModeleRapport'],
        additionalProperties: false,
    
    }
    return ajvValidator(schema);

}
export const modifierRapportDataValidator = () => {
    const schema = {
        type: 'object',
        properties: {
            idRapport: { type: 'number', nullable: false, minLength: 1},
            rapportDataItem: {
                type: 'object',
                properties: {
                    index: { type: 'number', nullable: false },
                    title: { type: 'string', nullable: false, minLength: 1 },
                    name: { type: 'string', nullable: false, minLength: 1},
                    typographie: { type: 'string', nullable: false, minLength: 1},
                },

            },    
        },
        required: ['idRapport', 'rapportDataItem'],
        additionalProperties: false,


    }
    return ajvValidator(schema);

}
export const modifierLibelleRapportValidator = () => {
    const schema = {
        type: 'object',
        required: ['idRapport', 'libelleRapport'],
        properties: {
            idRapport: { type: 'number', nullable: false, minLength: 1 },
            libelleRapport: { type: 'string', nullable: false, minLength: 1},
        },

    }
    return ajvValidator(schema);

}

export default {
    nouveauRapportValidator,
    modifierLibelleRapportValidator,
    modifierRapportDataValidator
}