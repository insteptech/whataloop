// Content for userDetail.js

const { getAllModels } = require("../../../middlewares/loadModels");

const findUserDetail = async (where) => {
  if (typeof where !== "object" || Object.keys(where).length === 0) {
    throw { message: "Invalid where condition" };
  }
  const { UserDetail, Address } = await getAllModels(process.env.DB_TYPE);
  let user = null;

  user = await UserDetail.findOne({
    where: where,
    include: [
      {
        model: Address,
        as: "address",
      },
    ],
  });

  return user;
};

const findUserAddress = async (where) => {
  if (typeof where !== "object" || Object.keys(where).length === 0) {
    throw { message: "Invalid where condition" };
  }
  const { Address } = await getAllModels(process.env.DB_TYPE);
  let user = null;

  user = await Address.findOne({
    where: where,
  });

  return user;
};

const updateUserDetail = async (requestBody, where) => {
  if (
    typeof requestBody !== "object" ||
    Object.keys(requestBody).length === 0
  ) {
    throw { message: "Invalid request body" };
  }

  if (typeof where !== "object" || Object.keys(where).length === 0) {
    throw { message: "Invalid where condition" };
  }
  const { UserDetail } = await getAllModels(process.env.DB_TYPE);
  return await UserDetail.update(requestBody, { where: where });
};

const updateUserInfo = async (requestBody, userId) => {
  if (
    typeof requestBody !== "object" ||
    Object.keys(requestBody).length === 0
  ) {
    throw { message: "Invalid request body" };
  }

  const { User, UserDetail, Address, sequelize } = await getAllModels(
    process.env.DB_TYPE
  );

  let userInfo = await findUserDetail({ auth_user_id: userId });
  console.log(userInfo, "userInfouserInfo");

  const transaction = await sequelize.transaction();
  const userDetailReq = {
    gender: requestBody.gender,
    dob: requestBody.dob,
    height: requestBody.height,
    heightUnit: requestBody.heightUnit,
    weight: requestBody.weight,
    weightUnit: requestBody.weightUnit,
    waist: requestBody.waist,
    waistUnit: requestBody.waistUnit,
  };
  const userAddressReq = {
    address: requestBody.address,
  };

  const userDataReq = {
    firstName: requestBody.firstName,
    lastName: requestBody.lastName,
    email: requestBody.email,
  };
  const userDataUpdateResult = await User.update(
    userDataReq,
    { where: { id: userId } },
    { transaction }
  );
  console.log("22222222222222");
  const userDetailUpdateResult = await UserDetail.update(
    userDetailReq,
    { where: { auth_user_id: userId } },
    { transaction }
  );
  console.log("3333333333333");
  const addressUpdateResult = await Address.update(
    userAddressReq,
    { where: { user_detail_id: userInfo.id } },
    { transaction }
  );
  console.log("4444444444444");
  return {
    userDataUpdate: userDataUpdateResult,
    userDetailUpdate: userDetailUpdateResult,
    addressUpdate: addressUpdateResult,
  };
};

const createUserDetail = async (requestBody) => {
  if (
    typeof requestBody !== "object" ||
    Object.keys(requestBody).length === 0
  ) {
    throw { message: "Invalid request body" };
  }
  const { UserDetail } = await getAllModels(process.env.DB_TYPE);
  return await UserDetail.create(requestBody);
};

const updateUserAddress = async (requestBody, where) => {
  if (
    typeof requestBody !== "object" ||
    Object.keys(requestBody).length === 0
  ) {
    throw { message: "Invalid request body" };
  }

  if (typeof where !== "object" || Object.keys(where).length === 0) {
    throw { message: "Invalid where condition" };
  }
  const { Address } = await getAllModels(process.env.DB_TYPE);
  return await Address.update(requestBody, { where: where });
};

const createUserAddress = async (requestBody) => {
  if (
    typeof requestBody !== "object" ||
    Object.keys(requestBody).length === 0
  ) {
    throw { message: "Invalid request body" };
  }
  const { Address } = await getAllModels(process.env.DB_TYPE);
  return await Address.create(requestBody);
};

const addReportDetail = async (requestBody) => {
  if (
    typeof requestBody !== "object" ||
    Object.keys(requestBody).length === 0
  ) {
    throw { message: "Invalid request body" };
  }
  const { ReportHistory } = await getAllModels(process.env.DB_TYPE);
  return await ReportHistory.create(requestBody);
};

const fetchLatestReportDetail = async (user_detail_id) => {
  const { ReportHistory } = await getAllModels(process.env.DB_TYPE);
  const recentReport = await ReportHistory.findOne({
    where: { user_detail_id },
    order: [["createdAt", "DESC"]], // Sort by `createdAt` in descending order
  });

  return recentReport;
};
module.exports = {
  findUserDetail,
  findUserAddress,
  updateUserDetail,
  updateUserInfo,
  createUserDetail,
  updateUserAddress,
  createUserAddress,
  addReportDetail,
  fetchLatestReportDetail,
};
