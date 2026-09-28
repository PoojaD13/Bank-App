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

const createRole = {
  body: Joi.object().keys({
    roleName: Joi.string().required().lowercase(),
    permissions: Joi.object(moduleSchemaRule).min(1).required(),
  }),
};

const getAllRole = {
  query: Joi.object().keys({
    name: Joi.string(),
    sortBy: Joi.string(),
    page: Joi.number().integer(),
    limit: Joi.number().integer(),
  }),
};

const getById = {
  params: Joi.object().keys({
    id: Joi.string().required(),
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
const deleteRole = {
  params: Joi.object().keys({
    id: Joi.string().required(),
  }),
};

module.exports = {
  createRole,
  updateRole,
  getAllRole,
  getById,
  deleteRole,
};
