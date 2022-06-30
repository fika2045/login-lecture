"use strict"

//const { use } = require(".");
//const { response } = require("../../../app");
const UserStorage = require("../../models/UserStorage");
const User = require("../../models/User");

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
        res.render("home/register");
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

    //    const id = req.body.id,
    //        psword = req.body.psword;

    //     const users = UserStorage.getUsers("id", "psword");

    // const response = {};       
    // if(users.id.includes(id)){
    //     const idx = users.id.indexOf(id);
    //     if(users.psword[idx]=== psword){
    //         response.success = true;
    //         return res.json(response);
    //     }
    // }
 
    // response.success = false;
    // response.msg = "로그인에 실패하셨습니다."
    // return res.json(response);
    },
    register : async (req, res) => {
        const user = new User(req.body);
        const response = await user.register();
         return res.json(response);
    },
}

module.exports = {
    output,
    process,
}