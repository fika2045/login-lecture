"use strict";

const UserStorage = require("./UserStorage");
const bcrypt = require("bcrypt");
const saltRounds = 10;

class User {
    constructor(body) {
        this.body = body;
    }
    async login() {
        const client = this.body;

        
        //promise 객체가 데이터를 다 받아오기전에 실핼되는 것을 막기 위해 await 을 씀. 
        //await 은 promise 객체에서만 쓸수 있다.
        //또한 await 은 async 함수에서만 사용가능해서 login 을 async 함수로 선언함
        try{
            const user = await UserStorage.getUserInfo(client.id);
            
            if(user){
                if (user.id === client.id && bcrypt.compareSync(client.psword,user.psword)){
                    
                    return { success: true, id:user.id, name:user.name};
                }
                return {success: false, msg: "비밀번호가 틀렸습니다."};
            }
            return { success: false, msg: "존재하지 않는 아이디입니다."};
        } catch(err){
            return { success: false, msg:err };
        }


    }

    async register() {
        const client = this.body;
        try {
                //동기화로 암호화
                const salt = bcrypt.genSaltSync(saltRounds);
                const hash = bcrypt.hashSync(client.psword,salt);
                client.psword = hash;

                const response = await UserStorage.save(client);
                return response;

        } catch(err) {
            if(err.errno == 1062)
                return {success: false, msg: "중복 아이디 : 다른 아이디를 입력해주세요" }
            return { success: false, msg: err.msg};
        }


        // const client = this.body;
        // try {
        // const response = await UserStorage.save(client);
        // return response; 
        // } catch (err) {
        //     return { success: false, msg: err};
        // }
    }
}

module.exports = User;