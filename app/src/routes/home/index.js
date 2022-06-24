"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

//호출된 주소에 따라 home.ctrl.js 의 render 함수 호출
router.get("/", ctrl.home);
router.get("/login", ctrl.login);

module.exports = router; 