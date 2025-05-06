const { buildSchema } = require("../../../middlewares/joiValidation");
const constantManager = require("../manager/constant");
const CustomError = require("../../../middlewares/customError");
const { supportedDbTypes } = require("../../../utils/staticData");

exports.getConstantType = async (req, res, next) => {
  try {
    const result = await constantManager.getConstantType(req, res, next);
    return result;

  } catch (error) {
    return next(new CustomError(error.message, 500));
  }
}

exports.create = async (req, res) => {
  try {
    const { type, label, value } = req.body;

    if (!type || !label || !value) {
      return res.status(400).json({ message: 'All fields (type, label, value) are required' });
    }

    const newConstant = await constantManager.createConstant({
      type,
      label,
      value
    });

    return res.status(201).json(newConstant);
  } catch (error) {
    return res.status(500).json({ message: 'Failed to create constant: ' + error.message });
  }
};

exports.remove = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ message: "ID is required" });
    }

    const deleted = await constantManager.deleteConstant(id);

    if (!deleted) {
      return res.status(404).json({ message: "Constant not found or already deleted" });
    }

    return res.status(200).json({ message: "Constant deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Failed to delete constant: " + error.message });
  }
};
