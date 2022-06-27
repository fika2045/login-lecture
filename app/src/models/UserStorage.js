"use strict";

const fs = require("fs").promises;
const db = require("../config/db");

class UserStorage {

    static getUserInfo(id) {
        //Promise 내부 구문이 성공하면 resolve, 실패하면 reject
        return new Promise((resolve, reject) => {
            const query = "SELECT * FROM users where id = ?";
            db.query(query, [id], (err, data) => {
                if(err) reject(err.message);
                //db 결과 배열로 데이터가 넘어오는데 데이터는 하나밖에 없으므로 첫번째 데이터를 반환한다. 
                resolve(data[0]);        
            });
        });
    }

    
    static async save(userInfo){
        //Promise 내부 구문이 성공하면 resolve, 실패하면 reject
        return new Promise((resolve, reject) => {
            const query = "INSERT INTO users(id, name, psword) VALUES (?,?,?);";
            db.query(
                query, 
                [userInfo.id, userInfo.name, userInfo.psword], 
                (err) => {
                if(err) reject(err.message);
                //db 결과 배열로 데이터가 넘어오는데 데이터는 하나밖에 없으므로 첫번째 데이터를 반환한다. 
                resolve ({success: true});        
            });
        });

    }
}

module.exports = UserStorage;
  