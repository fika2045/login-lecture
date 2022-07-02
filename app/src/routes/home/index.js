"use strict";

const express = require("express");
const router = express.Router();

const ctrl = require("./home.ctrl");

//호출된 주소에 따라 home.ctrl.js 의 render 함수 호출
//GET 으로 호출될 경우 req.query 에서 데이터 받아옴. 
//ex) http://localhost:3000/?name=mike  라면 req.query.name 으로 데이터를 받아올수 있다. 
//POST 로 호출될 경우 req.body 로 데이터 받아옴
router.get("/", ctrl.output.home);
router.get("/login", ctrl.output.login);
router.get("/register", ctrl.output.register);
router.get("/logout", ctrl.output.logout);

router.post("/login", ctrl.process.login);
router.post("/register", ctrl.process.register);

module.exports = router; 