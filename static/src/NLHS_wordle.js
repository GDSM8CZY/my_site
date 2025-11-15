const { append } = require("express/lib/response");

const cells = document.getElementsByClassName("cell");

let row_num = 0;

fetch("/NLHS_wordle/get_daily_word")
    .then(res => res.json())

function check_guess() {
    const row = document.getElementById(row_num);
    let guess = "";
    for (let i = 0; i < row.children.length; i++) {
        guess += row.children[i].value;
    }
    console.log(guess);
    row_num++;
}