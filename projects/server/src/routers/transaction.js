const express = require("express");
const { authUser, authUserTrans } = require("../controllers/authorize");
const { transactionController } = require("../controllers");
const route = express.Router();

route.post("/list", authUser, transactionController.getTransaction);
route.post("/add", authUser, transactionController.addTrans);
route.get(
  "/changestatus",
  authUserTrans,
  transactionController.changeStatusTrans
);
route.get("/warehouse", authUser, transactionController.getWarehouse);
route.get("/detail", transactionController.getTransDetail);
module.exports = route;
