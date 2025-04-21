// Content for userDetail.js

exports.userDetailInput = [
  { key: "gender", type: "string", required: true },
  { key: "dob", type: "date", required: true },
  { key: "height", type: "string", required: true },
  { key: "heightUnit", type: "string", required: true },
  { key: "weight", type: "string", required: true },
  { key: "weightUnit", type: "string", required: true },
  { key: "waist", type: "string", required: true },
  { key: "waistUnit", type: "string", required: true },
];

exports.addressInput = [
  { key: "country", type: "string", required: true },
  { key: "state", type: "string", required: false },
  { key: "city", type: "string", required: false },
  { key: "zip", type: "string", required: false },
  { key: "lat", type: "string", required: false },
  { key: "lng", type: "string", required: false },
  { key: "address", type: "string", required: false },
];
