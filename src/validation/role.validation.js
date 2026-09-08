const Joi = require("joi");

const { modulePermissions } = require("../constant/permission");

const moduleSchemaRule = {};

for (const [key, value] of Object.entries(modulePermissions)) {
  if (Array.isArray(value)) {
    moduleSchemaRule[key] = Joi.array()
      .items(Joi.string().valid(...value))
      .unique();
  }
}

// Object.entries(modulePermissions).forEach(([moduleName, allowedActions]) => { // key, value
//   if (Array.isArray(allowedActions)) {
//     console.log(`Module: ${moduleName}, Allowed Actions: ${allowedActions}`);
//     moduleSchemaRule[moduleName] = Joi.array()
//       .items(Joi.string().valid(...allowedActions))
//       .unique();
//   }
// });

const createRole = {
  body: Joi.object().keys({
    roleName: Joi.string().required().lowercase(),
    permissions: Joi.object(moduleSchemaRule).min(1).required(),
  }),
};

const updateRole = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
  body: Joi.object().keys({
    permissions: Joi.object(moduleSchemaRule).min(1).required(),
  }),
};

module.exports = {
  createRole,
  updateRole,
};
