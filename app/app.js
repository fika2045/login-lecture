"use strict"
//모듈
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cookieParser = require("cookie-parser");
const expressSession = require("express-session");

dotenv.config();

const app = express();
//const PORT = 3000;

//라우팅 : 주소를 받아서 routes/home 으로 보내서 열어줘야하는 화면 열어줌
const home = require("./src/routes/home");

//앱 세팅 뷰의 위치 설정
app.set("views", "./src/views");
app.set("view engine", "ejs");


// use -> 미들 웨어를 등록해주는 메서드
app.use(express.static(__dirname +'/src/public'));
//use 순서 때문에 고생함 왜 그랬을까?
app.use(bodyParser.json());
// URL 을 통해 전달되는 데이터에 한글, 공백 등과 같은 문자가 포함될 경우 제대로 인식되지 않는 문제 해결
app.use(bodyParser.urlencoded({ extended: true}));

app.use(cookieParser());
app.use(expressSession({
    secret:'my key',
    resave:true,
    saveUninitialized:true
}));

app.use("/", home);  




module.exports = app;