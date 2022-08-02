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


//상품페이지 
router.get("/product/pasing/:cur", ctrl.product.pasing);
router.get("/product/main", ctrl.product.main);
router.get("/product/delete/:id", ctrl.product.delete);
router.get("/product/insert", ctrl.product.insert);
router.get("/product/detail/:id", ctrl.product.detail);
router.get("/product/edit/:id", ctrl.product.edit);

router.post("/product/insert", ctrl.process.insert);
router.post("/product/edit/:id", ctrl.process.edit);

router.get("/golf/list", ctrl.golf.list);
router.get("/golf/detail/:hole", ctrl.golf.detail);
router.get("/golf/edit/:hole", ctrl.golf.edit);

router.post("/golf/edit/:id", ctrl.process.golfedit);

router.get("/metronome", ctrl.output.metronome);
router.get("/youtube", ctrl.output.youtube);

router.get("/youtube/download", ctrl.output.download);

module.exports = router; 