let row_num = 0;
let word = ""

fetch("/NLHS_wordle/get_daily_word")
    .then(res => res.json())
    .then(data => {word = data.word})

function check_guess() {
    const row = document.getElementById(row_num);
    let guess = "";
    for (let i = 0; i < row.children.length; i++) {
        let cell = row.children[i]
        guess += cell.value
        cell.disabled = true
    }
    console.log(guess);

    if (row_num < word.length) {
        row_num++;
    } else {
        console.log("game over")
        alert("wwow");
    }
}