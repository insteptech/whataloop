const { body } = require('express-validator');
const validate = require('./validate');

exports.validateCreateLead = [
  body('name').notEmpty().withMessage('Name is required'),
  body('phone').optional().isString(),
  body('email').optional().isEmail(),
  validate,
];

exports.validateUpdateLead = [
  body('name').optional().isString(),
  body('phone').optional().isString(),
  body('email').optional().isEmail(),
  validate,
];