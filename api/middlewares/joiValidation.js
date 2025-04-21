const Joi = require("joi");

// Function to build Joi schema from field definitions
exports.buildSchema = (fields) => {
  const schemaDefinition = {};

  fields.forEach((field) => {
    let fieldSchema;

    // Determine the field type and apply the corresponding Joi method
    switch (field.type) {
      case "string":
        fieldSchema = Joi.string();
        break;
      case "number":
        fieldSchema = Joi.number();
        break;
      case "boolean":
        fieldSchema = Joi.boolean();
        break;
      case "date":
        fieldSchema = Joi.date();
        break;
      case "array":
        fieldSchema = Joi.array();
        break;
      case "object":
        fieldSchema = Joi.object();
        break;
      default:
        throw new Error(`Unsupported field type: ${field.type}`);
    }

    // Apply additional constraints based on the field definition
    if (field.required) {
      fieldSchema = fieldSchema.required().not().empty(); // Required, not empty
    } else {
      fieldSchema = fieldSchema.optional().allow(""); // Optional
    }

    if (field.min) {
      fieldSchema = fieldSchema.min(field.min);
    }

    if (field.max) {
      fieldSchema = fieldSchema.max(field.max);
    }

    if (field.regex) {
      fieldSchema = fieldSchema.pattern(new RegExp(field.regex));
    }

    schemaDefinition[field.key] = fieldSchema;
  });

  return Joi.object(schemaDefinition);
};
