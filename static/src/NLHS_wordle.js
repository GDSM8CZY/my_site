let row_num = 0;

// Fetch the daily word from the server
fetch("/NLHS_wordle/get_daily_word")
    .then(res => res.json())
    .then(data => {
        const word = data.word;
    })

// Function to check the user's guess
function check_guess() {
    const row = document.getElementById(row_num);
    let guess = "";
    // Construct the guess from the input fields
    for (let i = 0; i < row.children.length; i++) {
        let cell = row.children[i]
        guess += cell.value
        cell.disabled = true
    }
    console.log(guess);

    // Send the guess to the server for checking
    fetch("/NLHS_wordle/check_guess/" + guess)
        .then(res => res.json())
        .then(data => {
            const result = data.result;
            // If the result only contains "correct", the user has guessed the word
            if (result.every(status => status === "correct")) {
                alert("Congratulations! You guessed the word!");
            }
            })
}