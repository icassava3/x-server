import { ajvValidator } from "../middlewares/ajvValidator";

export const activateServiceValidator = () => {
  const schema = {
    type: 'object',
    properties: {
      spiderKey: { type: 'string', minLength: 3 },
      partnerKey: { type: 'string' },
      serviceId: { type: 'string' }
    },
    required: ['spiderKey', 'partnerKey', 'serviceId'],
  };
  return ajvValidator(schema)
}




export const deactivateServiceSchema = {
  type: 'object',
  properties: {
    spiderKey: { type: 'string', minLength: 3 },
    partnerKey: { type: 'string' },
    serviceId: { type: 'string' }
  },
  required: ['serviceId']
};

export const initializeServiceSchema = {
  type: 'object',
  properties: {
    serviceId: { type: 'string' }
  },
  required: ['serviceId']
};

