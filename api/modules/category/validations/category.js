// Content for category.js

exports.createInput = [
  { key: "name", type: "string", required: true },
  { key: "parentId", type: "number", required: false },
];
exports.updateInput = [
  { key: "name", type: "string", required: true },
  { key: "parentId", type: "number", required: false },
  { key: "id", type: "number", required: true },
];

exports.getCategoryInput = [{ key: "id", type: "number", required: true }];
