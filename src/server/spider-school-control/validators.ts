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

const historiquePointage = () => {
  const schema = {
    type: "object",
    properties: {
      idActivite: { type: "string" },
      anneeScolaire: { type: "string", nullable: false, minLength: 1, maxLength: 9 },
      codeEtab: { type: "string", nullable: false, minLength: 1, maxLength: 7 },
      datePointage: { type: "string", format: "date", nullable: true }
    },
    required: ["codeEtab", "anneeScolaire", "idActivite"],
    additionalProperties: false
  }
  return ajvValidator(schema);
};

const updateSchoolControlActivitiesParams = () => {
  const schema = {
    type: "object",
    properties: {
      idActivite: { type: "string" },
      config: {
        type: "object",
        properties: {
          params: {
            anyOf: [
              { type: "array", items: { $ref: "#/definitions/IParamPlageHorraire" } },
              { type: "array" }, // Allow an empty array
            ],
          }
        },
        additionalProperties: false,

      },
    },
    required: ["idActivite", "config"],
    additionalProperties: false,
    definitions: {
      IParamPlageHorraire: {
        type: "object",
        properties: {
          idPlage: { type: "number" },
          heureDebut: { type: "string" },
          heureFin: { type: "string" },
        },
        required: ["idPlage", "heureDebut", "heureFin"],
        additionalProperties: false,
      },
    },
  };
  return ajvValidator(schema);

};




const modifierPointageConfig = () => {
  const schema = {
    type: "object",
    properties: {
      codeEtab: { type: "string", minLength: 1, maxLength: 7 },
      anneeScolaire: { type: "string", minLength: 1, maxLength: 9 },
      idActivite: { type: "string" },
      config: {
        type: "array",
        items: {
          type: "object",
          properties: {
            idPlage: { type: "number" },
            heureDebut: { type: "string" },
            heureFin: { type: "string" }
          },
          required: ["idPlage", "heureDebut", "heureFin"],
          additionalProperties: false
        }
      }
    },
    required: ["codeEtab", "anneeScolaire", "idActivite", "config"],
    additionalProperties: false
  }
  return ajvValidator(schema);

};

const updateUserActivitiesInSchoolControlConfig = () => {
  const schema = {
    type: "object",
    properties: {
      idActivities: { type: "array" },
      user: {
        type: "object",
        properties: {
          userId: { type: "string" },
          userName: { type: "string" },
          deviceName: { type: "string" },
          modelName: { type: "string" },
          deviceType: { type: "string" },
          createdBy: { type: "string"},
          status: {type: "boolean"}
        },
        required: ["userId", "userName", "deviceName", "modelName", "deviceType", "createdBy", "status"],
        additionalProperties: false,
      },
    },
    required: ["idActivities", "user"],
    additionalProperties: false
  }
  return ajvValidator(schema);

};

const toggleSchoolControlActivitiesUserStatus = () => {
  const schema = {
    type: "object",
    properties: {
      status: { type: "boolean" },
      user: {
        type: "object",
        properties: {
          userId: { type: "string" },
          userName: { type: "string" },
          deviceName: { type: "string" },
          modelName: { type: "string" },
          deviceType: { type: "string" },
          createdBy: { type: "string"},
          status: { type: "boolean" }
        },
        required: ["userId", "userName", "deviceName", "modelName", "deviceType", "status", "createdBy"],
        additionalProperties: false,
      },
    },
    required: [ "user", "status"],
    additionalProperties: false
  }
  return ajvValidator(schema);
};


const pointageValidator = () => {
  const schema = {
    type: "object",
    properties: {
      idPersonne: { type: "number" },
      idActivite: { type: "number" },
      codeEtab: { type: "string", minLength: 1, maxLength: 7 },
      operateur: { type: "string" },
      anneeScolaire: { type: "string", minLength: 1, maxLength: 9 }
    },
    required: ["idPersonne", "idActivite", "codeEtab", "operateur", "anneeScolaire"],
    additionalProperties: false
  }
  return ajvValidator(schema);
};


const getCredentialsValidator = () => {
  const schema = {
    type: "object",
    properties: {
      codeEtab: { type: "string", minLength: 1, maxLength: 7 },
      anneeScolaire: { type: "string", minLength: 1, maxLength: 9 }
    },
    required: ["codeEtab", "anneeScolaire"],
    additionalProperties: false
  }
  return ajvValidator(schema);
};

const toggleSchoolControlActivityStatus = () => {
  const schema = {
    type: "object",
    properties: {
      idActivite: { type: "string" },
      status: { type: "boolean" }, // Only allow 0 or 1
    },
    required: ["idActivite", "status"],
    additionalProperties: false
  }
  return ajvValidator(schema);
};

export default {
  authentification,
  historiquePointage,
  // insererPointageConfig,
  pointageValidator,
  modifierPointageConfig,
  getCredentialsValidator,
  updateSchoolControlActivitiesParams,
  updateUserActivitiesInSchoolControlConfig,
  toggleSchoolControlActivitiesUserStatus,
  toggleSchoolControlActivityStatus
}