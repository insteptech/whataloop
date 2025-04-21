const permissionService = require("../services/permission");
const { sendResponse } = require("../utils/helper.js");

exports.create = async (req, res) => {
  const payload = req.body;
  const result = await permissionService.create(payload);
  return sendResponse(res, 200, true, "Permission Created", result, null);
};
