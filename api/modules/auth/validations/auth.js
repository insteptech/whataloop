
exports.otpInput = [{ key: "email", type: "string", required: true }];
exports.verifyOtpInput = [
  { key: "email", type: "string", required: true },
  { key: "otp", type: "string", required: true },
];

exports.userDetailInput = [{ key: "id", type: "string", required: true }];

exports.createUserInput = [{ key: "email", type: "string", required: true }];

// exports.updateUserInput = [
//   { key: "firstName", type: "string", required: true },
//   { key: "lastName", type: "string", required: true },
//   { key: "email", type: "string", required: false },
//   { key: "otp", type: "string", required: false },
// ];

exports.updateUserProfileInput = [
  { key: "fullName", type: "string", required: true },
  { key: "email", type: "string", required: false },
  { key: "phone", type: "string", required: false },
  { key: "profileImage", type: "string", required: false },
  { key: "bio", type: "string", required: false },
  { key: "location", type: "string", required: false },];

exports.profileCompleteInput = [
  { key: "isProfileComplete", type: "boolean", required: true },
];

exports.userDeleteInput = [{ key: "id", type: "string", required: true }];
exports.loginInput = [
  { key: "email", type: "string", required: true },
  { key: "password", type: "string", required: true },
];
exports.signupInput = [
  { key: "phone", type: "string", required: true },
  { key: "email", type: "string", required: true },
  { key: "fullName", type: "string", required: true },
  { key: "password", type: "string", required: true },
];