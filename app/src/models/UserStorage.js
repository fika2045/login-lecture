"use strict";

class UserStorage {
    // '#' 은 private 로 선언하기 위한것  
    static #users = {
        id: ["tlpr", "finnala", "jiwoo0815"],
        psword: ["1234", "12345", "123456"],
        name: ["김승재", "조한주", "김지우"],
};

//받아오는 변수 갯수를 모를때 ...변수명
//이부분 로직을 나중에 확인 필요함 ##############
static getUsers(...fields) {
    const users = this.#users;
    const newUsers = fields.reduce((newUsers, field) => {
        if(users.hasOwnProperty(field)) {
 //           console.log(newUsers[field], users[field], field);
            newUsers[field] = users[field];
         
        }
        return newUsers;
    }, {}); 
    return newUsers;
}
}

module.exports = UserStorage;
