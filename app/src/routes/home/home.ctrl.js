"use strict"

//const { use } = require(".");
//const { response } = require("../../../app");
const UserStorage = require("../../models/UserStorage");
const User = require("../../models/User");
const getConnection = require("../../config/db");
var fs = require('fs');
var ejs = require('ejs');
const ytdl = require("ytdl-core")

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
    metronome : (req, res) => {
        if(req.session.user) {
            res.render("home/metronome");    
        } else { res.render("home/login")};
  
    },
    youtube : (req, res) => {
        if(req.session.user) {
        //if(1) {
                res.render("home/youtube");    
        } else { res.render("home/login")};
  
    },
    download : (req, res) => {
    
        if(req.session.user) {
        //if(1) {
                let URL = req.query.URL;
        
        res.header('Content-Disposition', 'attachment; filename="video.mp4"');

        ytdl(URL, {
            format: 'mp4'
        }).on('error', (err) => {
            //console.log(err);
            console.error('?????? ?????????');
        }).pipe(res);

    } else { res.render("home/login")};

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
//        console.log("?????? ????????? ????????? ??????");
        var body = req.body;
        
        getConnection((conn) =>{
            conn.query('insert into products(name,modelnumber,series) values (?,?,?)', [body.name, body.num, body.section], function (err) { 
                if(err) throw err;
                //??????
                res.redirect('main');
            })
            conn.release();
        });
    },
    
    edit : (req, res) =>{
        console.log("?????? ????????? ??????");
        var body = req.body;
        
        getConnection((conn) =>{

             conn.query('update products set name = ?, modelnumber = ?, series = ? where id = ?',
            [body.name, body.num, body.section, req.params.id], function (err) {
                if(err) throw err;
                res.redirect('../main')
            });
            conn.release();
        });
    },
    golfedit : (req, res) =>{
        var body = req.body;
        getConnection((conn) =>{

            conn.query('update golf_tmp3 set shot = ?, putt = ?, review = ? where holeno = ?',
                [body.shot, body.putt, body.review, req.params.id], function (err) {
                    if(err) throw err;
                    res.redirect('../list')
                })
            conn.release();
        });
    },

}





const product = {
    pasing : (req, res) =>{
            //???????????? ????????? ??? : ??? ????????? ??? 10??? ?????????    
    var page_size = 10;    
    //???????????? ?????? : 1 ~ 10??? ?????????    
    var page_list_size = 10;    
    //limit ??????    
    var no = "";    
    //?????? ???????????? ??????    
    var totalPageCount = 0;

    var queryString = 'select count(*) as cnt from products' 
    getConnection((conn) =>{

    conn.query(queryString, function (error2, data) {
        if (error2) {
            console.log(error2 + "?????? ?????? mysql ?????? ??????");
            return;
        }
        //?????? ???????????? ??????
        totalPageCount = data[0].cnt;
        
        //?????? ?????????
        var curPage = req.params.cur;
        
        console.log("?????? ????????? : " + curPage, "?????? ????????? : " + totalPageCount);
        
        //?????? ????????? ??????
        if (totalPageCount < 0) {
            totalPageCount = 0
        }
        
        var totalPage = Math.ceil(totalPageCount / page_size);// ?????? ????????????
        var totalSet = Math.ceil(totalPage / page_list_size); //?????? ?????????
        var curSet = Math.ceil(curPage / page_list_size) // ?????? ?????? ??????
        var startPage = ((curSet - 1) * 10) + 1 //?????? ????????? ????????? ?????? ?????????
        var endPage = (startPage + page_list_size) - 1; //?????? ????????? ????????? ????????? ?????????
        
        //?????????????????? 0 ?????? ?????????
        if (curPage < 0) {
            no = 0
        } else {
            //0?????? ?????? limit ????????? ????????? ????????? ?????? ??? ?????????
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
                console.log("ejs??????" + error);
                return
            }
            console.log("???????????? ???????????????~~~~~~~" + no)
            
            var queryString = 'select * from products order by id desc limit ?,?';

            conn.query(queryString, [no, page_size], function (error, result) {
                if (error) {
                    console.log("????????? ??????" + error);
                    return
                }
                
                res.send(ejs.render(data, {
                    data: result,
                    pasing: result2
                }));
            });
        });
    })
    conn.release();
});   
    },

    main : (req, res) =>{
        console.log("????????????");
        //main ?????? ???????????? ?????? ????????? ??????
        res.redirect('/product/pasing/' + 1);

    },

    delete : (req, res) =>{
        console.log("?????? ??????");
    
        getConnection((conn) =>{

            conn.query('delete from products where id = ?', [req.params.id], function (err) {
                if(err) throw err;
                res.redirect('/product/main')
            });
            conn.release();
        });
    },

    insert : (req, res) =>{
        console.log("?????? ????????? ?????????")
    
        fs.readFile('src/tmp/insert.html', 'utf-8', function (error, data) {
            res.send(data)
        })
    },

    edit : (req, res) =>{
        console.log("?????? ??????")
    
        fs.readFile('src/tmp/edit.html', 'utf-8', function (error, data) {
            getConnection((conn) =>{

                conn.query('select * from products where id = ?', [req.params.id], function (error, result) {
                    if(error) throw error;
                    res.send(ejs.render(data, {
                        data: result[0]
                    }))
                })
                conn.release();
            });
        });
    
    },

    detail : (req,res) => {
        console.log("?????? ?????????")
    
        fs.readFile('src/tmp/detail.html', 'utf-8', function (error, data) {
            getConnection((conn) =>{

                conn.query('select * from products where id = ?', [req.params.id], function (error, result) {
                    if(error) throw error;
                    res.send(ejs.render(data, {
                        data: result[0]
                    }))
                })
                conn.release();
            });
        });
    }
}

const golf = {
    list : (req, res) =>{
        fs.readFile('src/tmp/golflist.html', 'utf-8', function (error, data) {
            if (error) {
                console.log("ejs??????" + error);
                return
            }
            
            var queryString = 'select * from golf_tmp3';

            getConnection((conn) =>{

                conn.query(queryString, function (error, result) {
                    if (error) {
                        console.log("????????? ??????" + error);
                        return
                    }
                    //console.log(result);
                    res.send(ejs.render(data, {
                        data: result
                    }));
                });
                conn.release();
            });
        })
    },

    detail : (req,res) => {
        fs.readFile('src/tmp/golfdetail.html', 'utf-8', function (error, data) {
            getConnection((conn) =>{

                conn.query('select * from golf_tmp3 where holeno = ?', [req.params.hole], function (error, result) {
                    if(error) throw error;
                
                    res.send(ejs.render(data, {
                        data: result[0]
                    }))
                })
            conn.release();
        });
        });
    },

    edit : (req,res) => {
        fs.readFile('src/tmp/golfedit.html', 'utf-8', function (error, data) {
            getConnection((conn) =>{

                conn.query('select * from golf_tmp3 where holeno = ?', [req.params.hole], function (error, result) {
                    if(error) throw error;
                    res.send(ejs.render(data, {
                        data: result[0]
                    }))
                })
                conn.release();
            });
        });
    },
     
}

// connection.connect();

// connection.query('SELECT * from table1 where id = 2',  function(err, rows, fields) {
//   if (err) return console.log(err);

//   if (rows[0]) { 
//     console.log('The result is  ', rows[0].user);
//   }
// });
// connection.end();

module.exports = {
    output,
    process,
    product,
    golf,
}