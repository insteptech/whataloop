const roleService = require("../services/role");
const { sendResponse } = require("../utils/helper.js");

exports.createRole = async (req, res) => {
  let payload = req.body;
  const result = await roleService.createRole(payload);
  return sendResponse(res, 200, true, "Role Created", result, null);
};
