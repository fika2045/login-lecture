"use strict"

//const { use } = require(".");
//const { response } = require("../../../app");
const UserStorage = require("../../models/UserStorage");
const User = require("../../models/User");
const db = require("../../config/db");
var fs = require('fs');
var ejs = require('ejs');
//const { addListener } = require("../../config/db");

const output = {
    
    home : (req, res) => {
        if(req.session.user) {
            res.render("home/index", {
                id:req.session.user.id, 
                name: req.session.user.name});    
        } else { res.render("home/login")};
  
    },
    login : (req, res) => {
        
        if(req.session.user) {
            res.render("home/index", {
                id:req.session.user.id, 
                name: req.session.user.name});    
        } else { res.render("home/login")};
    },
    register : (req, res) => {
        if(req.session.user) {
            res.render("home/index", {
                id:req.session.user.id, 
                name: req.session.user.name});    
        } else { res.render("home/register")};

    },
    logout : (req, res) => {
        if(req.session.user) {
            req.session.destroy(function(err) {
                if (err) {throw err;}
            });
            res.render("home/login");
        } else { res.render("home/login")  };
    },
}

const process = {
    login : async (req, res) => {
        const user = new User(req.body);
        const response = await user.login();
        
         req.session.user = {
             id: response.id,
             name: response.name,
             authorized: true,
            
        };
        
         return res.json(response);
    },

    register : async (req, res) => {
        const user = new User(req.body);
        const response = await user.register();
         return res.json(response);
    },

    insert : (req, res) =>{
        console.log("삽입 포스트 데이터 진행");
        var body = req.body;

        db.query('insert into products(name,modelnumber,series) values (?,?,?)', [body.name, body.num, body.section], function () { 
            //응답
            res.redirect('main');
        })
    },
    
    edit : (req, res) =>{
        console.log("수정 포스트 진행");
        var body = req.body;
        db.query('update products set name = ?, modelnumber = ?, series = ? where id = ?',
            [body.name, body.num, body.section, req.params.id], function () {
                res.redirect('../main')
            })
    },


}





const product = {
    pasing : (req, res) =>{
            //페이지당 게시물 수 : 한 페이지 당 10개 게시물    
    var page_size = 10;    
    //페이지의 갯수 : 1 ~ 10개 페이지    
    var page_list_size = 10;    
    //limit 변수    
    var no = "";    
    //전체 게시물의 숫자    
    var totalPageCount = 0;

    var queryString = 'select count(*) as cnt from products'    
    db.query(queryString, function (error2, data) {
        if (error2) {
            console.log(error2 + "메인 화면 mysql 조회 실패");
            return;
        }
        //전체 게시물의 숫자
        totalPageCount = data[0].cnt;
        
        //현제 페이지
        var curPage = req.params.cur;
        
        console.log("현재 페이지 : " + curPage, "전체 페이지 : " + totalPageCount);
        
        //전체 페이지 갯수
        if (totalPageCount < 0) {
            totalPageCount = 0
        }
        
        var totalPage = Math.ceil(totalPageCount / page_size);// 전체 페이지수
        var totalSet = Math.ceil(totalPage / page_list_size); //전체 세트수
        var curSet = Math.ceil(curPage / page_list_size) // 현재 셋트 번호
        var startPage = ((curSet - 1) * 10) + 1 //현재 세트내 출력될 시작 페이지
        var endPage = (startPage + page_list_size) - 1; //현재 세트내 출력될 마지막 페이지
        
        //현재페이지가 0 보다 작으면
        if (curPage < 0) {
            no = 0
        } else {
            //0보다 크면 limit 함수에 들어갈 첫번째 인자 값 구하기
            no = (curPage - 1) * 10
        }
        
        console.log('[0] curPage : ' + curPage + ' | [1] page_list_size : ' + page_list_size + ' | [2] page_size : ' + page_size + ' | [3] totalPage : ' + totalPage + ' | [4] totalSet : ' + totalSet + ' | [5] curSet : ' + curSet + ' | [6] startPage : ' + startPage + ' | [7] endPage : ' + endPage)        
        var result2 = {
            "curPage": curPage,
            "page_list_size": page_list_size,
            "page_size": page_size,
            "totalPage": totalPage,
            "totalSet": totalSet,
            "curSet": curSet,
            "startPage": startPage,
            "endPage": endPage
        };
        
        fs.readFile('src/tmp/list.html', 'utf-8', function (error, data) {
            if (error) {
                console.log("ejs오류" + error);
                return
            }
            console.log("몇번부터 몇번까지냐~~~~~~~" + no)
            
            var queryString = 'select * from products order by id desc limit ?,?';
            db.query(queryString, [no, page_size], function (error, result) {
                if (error) {
                    console.log("페이징 에러" + error);
                    return
                }
                
                res.send(ejs.render(data, {
                    data: result,
                    pasing: result2
                }));
            });
        });
    })

    },

    main : (req, res) =>{
        console.log("메인화면");
        //main 으로 들어오면 바로 페이징 처리
        res.redirect('/product/pasing/' + 1);

    },

    delete : (req, res) =>{
        console.log("삭제 진행");
    
        db.query('delete from products where id = ?', [req.params.id], function () {
            res.redirect('/product/main')
        });
    },

    insert : (req, res) =>{
        console.log("삽입 페이지 나와라")
    
        fs.readFile('src/tmp/insert.html', 'utf-8', function (error, data) {
            res.send(data)
        })
    },

    edit : (req, res) =>{
        console.log("수정 진행")
    
        fs.readFile('src/tmp/edit.html', 'utf-8', function (error, data) {
            db.query('select * from products where id = ?', [req.params.id], function (error, result) {
                res.send(ejs.render(data, {
                    data: result[0]
                }))
            })
        });
    
    },

    detail : (req,res) => {
        console.log("상세 페이지")
    
        fs.readFile('src/tmp/detail.html', 'utf-8', function (error, data) {
            db.query('select * from products where id = ?', [req.params.id], function (error, result) {
                res.send(ejs.render(data, {
                    data: result[0]
                }))
            })
        });
    }
}


module.exports = {
    output,
    process,
    product,
}