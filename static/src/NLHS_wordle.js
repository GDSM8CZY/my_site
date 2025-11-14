const cells = document.getElementsByClassName("cell")

fetch("/NLHS_wordle/get_daily_word")
    .then(res => res.json())
    .then(data => console.log(data.word))

function test() {
    for (let i = 0; i <= cells.length; i++) {
        cells[i].innerHTML = "no";
    }
}