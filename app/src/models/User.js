"use strict";

const UserStorage = require("./UserStorage");

class User {
    constructor(body) {
        this.body = body;
    }
    async login() {
        const client = this.body;
        //promise 객체가 데이터를 다 받아오기전에 실핼되는 것을 막기 위해 await 을 씀. 
        //await 은 promise 객체에서만 쓸수 있다.
        //또한 await 은 async 함수에서만 사용가능해서 login 을 async 함수로 선언함
        const {id, psword} = await UserStorage.getUserInfo(client.id);

        if(id){
            if (id === client.id && psword === client.psword){
                return { success: true};
            }
            return {success: false, msg: "비밀번호가 틀렸습니다."};
        }
        return { success: false, msg: "존재하지 않는 아이디입니다."};


    }

    async register() {
        const client = this.body;
        try {
        const response = await UserStorage.save(client);
        return response; 
        } catch (err) {
            return { success: false, msg: err};
        }
    }
}

module.exports = User;