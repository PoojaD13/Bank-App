const mongoose = require("mongoose");
const { modulePermissions } = require("../constant/permission");
const mongoosePaginate = require("mongoose-paginate-v2");

const roleSchema = mongoose.Schema(
  {
    roleName: { type: String, unique: true, lowercase: true, required: true },
    permissions: {
      type: Map,
      of: [String],
      required: true,
      validate: {
        validator: function (permissions) {
          for (const [module, actions] of permissions) {
            // Module exists
            if (!modulePermissions[module]) {
              return false;
            }

            // Every action must be valid for that module
            for (const action of actions) {
              if (!modulePermissions[module].includes(action)) {
                return false;
              }
            }
          }
          return true;
        },
        message: "invalid module or permission action",
      },
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isArchive: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

roleSchema.plugin(mongoosePaginate);
const Role = mongoose.model("Role", roleSchema);

module.exports = Role;
