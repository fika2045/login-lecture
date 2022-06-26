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
//지금은 사용하는 곳이 없음
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

    static getUserInfo(id) {
        const users = this.#users;
        const idx = users.id.indexOf(id);
        const usersKeys = Object.keys(users);
        const userInfo = usersKeys.reduce((newUser, info) =>{
            newUser[info] = users[info][idx];
            return newUser;
        }, {});

        return userInfo;
    }

    static save(userInfo){
        const users = this.#users;
        users.id.push(userInfo.id);
        users.name.push(userInfo.name);
        users.psword.push(userInfo.psword);
        console.log(users);
    }
}

module.exports = UserStorage;
  