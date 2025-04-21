// Content for userDetail.js
const userDetailService = require("../services/userDetail.js");
const { sendResponse } = require("../utils/helper.js");

exports.addUpdateDetail = async (req, res) => {
  const { id } = req.decoded;
  let userDetail = null;
  let message = "";
  let userInfo = await userDetailService.findUserDetail({ auth_user_id: id });
  if (userInfo) {
    userDetail = await userDetailService.updateUserDetail(req.body, {
      id: userInfo.id,
    });
    message = "User Detail Updated Successfully";
  } else {
    req.body["auth_user_id"] = id;
    userDetail = await userDetailService.createUserDetail(req.body);
    message = "User Detail Created Successfully";
  }

  return sendResponse(res, 200, true, message, userDetail);
};

exports.addUpdateAddress = async (req, res) => {
  const { id } = req.decoded;
  let userDetail = null;
  let message = "";
  let userInfo = await userDetailService.findUserDetail({ auth_user_id: id });

  let addressInfo = await userDetailService.findUserAddress({
    user_detail_id: userInfo.id,
  });
  if (addressInfo) {
    userDetail = await userDetailService.updateUserAddress(req.body, {
      id: addressInfo.id,
    });
    message = "User Address Updated Successfully";
  } else {
    req.body["user_detail_id"] = userInfo.id;
    userDetail = await userDetailService.createUserAddress(req.body);
    message = "User Address Created Successfully";
  }

  return sendResponse(res, 200, true, message, userDetail);
};

exports.fetchUserDetail = async (req, res) => {
  const { id } = req.decoded;

  let userInfo = await userDetailService.findUserDetail({ auth_user_id: id });

  return sendResponse(
    res,
    200,
    true,
    "User Detail fetched successfully",
    userInfo
  );
};

exports.addUpdateInfo = async (req, res) => {
  const { id } = req.decoded;

  const userDetail = await userDetailService.updateUserInfo(req.body, id);
  return sendResponse(res, 200, true, userDetail);
};

exports.addReportDetail = async (req, res) => {
  const { id } = req.decoded;
  let userInfo = await userDetailService.findUserDetail({ auth_user_id: id });
  req.body["user_detail_id"] = userInfo.id;
  let reportInfo = await userDetailService.addReportDetail(req.body);

  return sendResponse(res, 200, true, "Report added successfully", reportInfo);
};

exports.fetchLatestReportDetail = async (req, res) => {
  const { id } = req.decoded;
  let userInfo = await userDetailService.findUserDetail({ auth_user_id: id });
  let reportInfo = await userDetailService.fetchLatestReportDetail(userInfo.id);

  return sendResponse(res, 200, true, "Report added successfully", reportInfo);
};
