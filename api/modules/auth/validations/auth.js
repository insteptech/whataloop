exports.signupInput = [
  { key: "phone", type: "string", required: true },
  { key: "full_name", type: "string", required: true }
];
exports.otpInput = [{ key: "phone", type: "string", required: true }];
exports.verifyOtpInput = [
  { key: "phone", type: "string", required: true },
  { key: "otp", type: "string", required: true },
];
