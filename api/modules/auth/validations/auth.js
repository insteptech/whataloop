exports.otpInput = [{ key: "mobile", type: "string", required: true }];
exports.verifyOtpInput = [
  { key: "mobile", type: "string", required: true },
  { key: "otp", type: "string", required: true },
];

exports.userDetailInput = [{ key: "id", type: "string", required: true }];

exports.createUserInput = [{ key: "mobile", type: "string", required: true }];
exports.updateUserInput = [
  // { key: "mobile", type: "string", required: true },
  { key: "firstName", type: "string", required: true },
  { key: "lastName", type: "string", required: true },
  { key: "email", type: "string", required: false },
  { key: "otp", type: "string", required: false },
];

exports.profileCompleteInput = [
  { key: "isProfileComplete", type: "boolean", required: true },
];

exports.userDeleteInput = [{ key: "id", type: "string", required: true }];
