"use strict"
//모듈
const express = require("express");
const app = express();

//const PORT = 3000;

//라우팅 : 주소를 받아서 routes/home 으로 보내서 열어줘야하는 화면 열어줌
const home = require("./src/routes/home");

//앱 세팅 뷰의 위치 설정
app.set("views", "./src/views");
app.set("view engine", "ejs");

// use -> 미들 웨어를 등록해주는 메서드
app.use("/", home); 

module.exports = app;