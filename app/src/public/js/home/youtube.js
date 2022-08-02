let convertBtn = document.querySelector(".convert-button");
let URLinput = document.querySelector(".URL-input");

convertBtn.addEventListener("click", function() {
//    console.log(`URL : ${URLinput.value}`);
    sendURL(URLinput.value);
});

function sendURL(URL) {
    // fetch(`/youtube/download?URL=${URL}`, {
    //     method: 'GET'
    // }).then(res => res.json())
    // .then(json => console.log(json));
    window.location.href = `/youtube/download?URL=${URL}`;
}