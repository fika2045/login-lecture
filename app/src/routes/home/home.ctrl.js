"use strict"

//const { use } = require(".");
//const { response } = require("../../../app");
const UserStorage = require("../../models/UserStorage");
const User = require("../../models/User");
const getConnection = require("../../config/db");
var fs = require('fs');
var ejs = require('ejs');
const ytdl = require("ytdl-core");
const cp = require('child_process');
//const readline = require('readline');
const ffmpeg = require('ffmpeg-static');

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
    download : async(req, res) => {
    
        if(req.session.user) {
        //if(1) {
            let URL = req.query.URL;
            

            if(ytdl.validateURL(URL))
            {
                //highest 퀄리티로 저장하기
                let info = await ytdl.getInfo(URL);
                let format = ytdl.chooseFormat(info.formats, { quality: 'highest' });

                res.header('Content-Disposition', 'attachment; filename="video.mp4"');
                ytdl(URL, {
                    format: 'mp4'
                }).pipe(res);
                
                
        //         //highestaudio + highestvideo 합치기 근데 서버에 저장되네 ㅠㅜ
        //         const ref = URL;
        //         const tracker = {
        //           start: Date.now(),
        //           audio: { downloaded: 0, total: Infinity },
        //           video: { downloaded: 0, total: Infinity },
        //           merged: { frame: 0, speed: '0x', fps: 0 },
        //         };
                
        //         // Get audio and video streams
        //         const audio = ytdl(ref, { quality: 'highestaudio' })
        //           .on('progress', (_, downloaded, total) => {
        //             tracker.audio = { downloaded, total };
        //           });
        //         const video = ytdl(ref, { quality: 'highestvideo' })
        //           .on('progress', (_, downloaded, total) => {
        //             tracker.video = { downloaded, total };
        //           });
                
        //         // Prepare the progress bar
        //         let progressbarHandle = null;
        //         const progressbarInterval = 1000;
                
                
        //         // Start the ffmpeg child process
        //         const ffmpegProcess = cp.spawn(ffmpeg, [
        //           // Remove ffmpeg's console spamming
        //           '-loglevel', '8', '-hide_banner',
        //           // Redirect/Enable progress messages
        //           '-progress', 'pipe:3',
        //           // Set inputs
        //           '-i', 'pipe:4',
        //           '-i', 'pipe:5',
        //           // Map audio & video from streams
        //           '-map', '0:a',
        //           '-map', '1:v',
        //           // Keep encoding
        //           '-c:v', 'copy',
        //           // Define output file
        //           'out2.mkv',
        //         ], {
        //           windowsHide: true,
        //           stdio: [
        //             /* Standard: stdin, stdout, stderr */
        //             'inherit', 'inherit', 'inherit',
        //             /* Custom: pipe:3, pipe:4, pipe:5 */
        //             'pipe', 'pipe', 'pipe',
        //           ],
        //         });
        //         ffmpegProcess.on('close', () => {
        //           console.log('done');
        //           // Cleanup
        //   //        process.stdout.write('\n\n\n\n');
        //           clearInterval(progressbarHandle);
        //         });
                
        //         // Link streams
        //         // FFmpeg creates the transformer streams and we just have to insert / read data
        //         ffmpegProcess.stdio[3].on('data', chunk => {
        //           // Start the progress bar
        //           //if (!progressbarHandle) progressbarHandle = setInterval(showProgress, progressbarInterval);
        //           // Parse the param=value list returned by ffmpeg
        //           const lines = chunk.toString().trim().split('\n');
        //           const args = {};
        //           for (const l of lines) {
        //             const [key, value] = l.split('=');
        //             args[key.trim()] = value.trim();
        //           }
        //           tracker.merged = args;
        //         });
        //         audio.pipe(ffmpegProcess.stdio[4]);
        //         video.pipe(ffmpegProcess.stdio[5]);

            }
            else {
                res.send('<script>location.href="/youtube";alert("하하하");</script>');
            }
     

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
//        console.log("삽입 포스트 데이터 진행");
        var body = req.body;
        
        getConnection((conn) =>{
            conn.query('insert into products(name,modelnumber,series) values (?,?,?)', [body.name, body.num, body.section], function (err) { 
                if(err) throw err;
                //응답
                res.redirect('main');
            })
            conn.release();
        });
    },
    
    edit : (req, res) =>{
        console.log("수정 포스트 진행");
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
            //페이지당 게시물 수 : 한 페이지 당 10개 게시물    
    var page_size = 10;    
    //페이지의 갯수 : 1 ~ 10개 페이지    
    var page_list_size = 10;    
    //limit 변수    
    var no = "";    
    //전체 게시물의 숫자    
    var totalPageCount = 0;

    var queryString = 'select count(*) as cnt from products' 
    getConnection((conn) =>{

    conn.query(queryString, function (error2, data) {
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

            conn.query(queryString, [no, page_size], function (error, result) {
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
    conn.release();
});   
    },

    main : (req, res) =>{
        console.log("메인화면");
        //main 으로 들어오면 바로 페이징 처리
        res.redirect('/product/pasing/' + 1);

    },

    delete : (req, res) =>{
        console.log("삭제 진행");
    
        getConnection((conn) =>{

            conn.query('delete from products where id = ?', [req.params.id], function (err) {
                if(err) throw err;
                res.redirect('/product/main')
            });
            conn.release();
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
        console.log("상세 페이지")
    
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
                console.log("ejs오류" + error);
                return
            }
            
            var queryString = 'select * from golf_tmp3';

            getConnection((conn) =>{

                conn.query(queryString, function (error, result) {
                    if (error) {
                        console.log("페이징 에러" + error);
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