// Content for userDetail.js

const express = require("express");
const userDetailController = require("../controllers/userDetail");
const {
  authenticate,
  // authorize,
} = require("../../../middlewares/authenticate");

const router = express.Router();

router.post(
  "/update",
  authenticate,
  // authorize,
  userDetailController.addUpdateDetail
);

router.post(
  "/address/update",
  authenticate,
  // authorize,
  userDetailController.addUpdateAddress
);

router.get(
  "/get",
  authenticate,
  // authorize,
  userDetailController.fetchUserDetail
);

router.post(
  "/update/info",
  authenticate,
  // authorize,
  userDetailController.addUpdateInfo
);

router.post(
  "/add/report-detail",
  authenticate,
  // authorize,
  userDetailController.addReportDetail
);

router.get(
  "/fetch/latest-report-detail",
  authenticate,
  // authorize,
  userDetailController.fetchLatestReportDetail
);

module.exports = router;
