"use strict"

const id = document.querySelector("#id"),
    name = document.querySelector("#name"),    
    psword = document.querySelector("#psword"),
    confirmPsword = document.querySelector("#confirm-psword"),
    registerBtn = document.querySelector("#button");


registerBtn.addEventListener("click", register);

function register() {
    const req = {
        id: id.value,
        name: name.value,
        psword: psword.value,
        confirmPsword: confirmPsword.value,
    };
    
//front 데이터를 서버로 POST 를 통해 json으로 전달    
//fetch 의 반환값은 promise 객체
//promise 객체를 읽으려면 반환값 res.json() 으로 then 을 한번 더 찍어줘야함
fetch("/register", {
   method : "POST",
   headers: {
       "Content-Type" : "application/json",
   },
   body: JSON.stringify(req),
})
    .then((res) => res.json())
    .then((res) => {
        if (res.success){
            location.href ="/login";
        } else {
            alert(res.msg);
        }
    })
    .catch((err) => {
        console.error("회원가입 중 에러 발생");
    });
}

