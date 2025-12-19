let row_num = 0;
let max_row = 0;

// Fetch the daily word from the server
fetch("/NLHS_wordle/get_daily_word")
    .then(res => res.json())
    .then(data => {
        const word = data.word;
        let deff = data.deff;
        // set the max_row
        max_row = word.length + 1;

        // Add event listeners to inputs now that max_row is known
        for (let i = 0; i < max_row; i++) {
            const row = document.getElementById("R" + i);
            if (!row) continue;
            const cells = row.querySelectorAll("input.cell");
            cells.forEach((cell, index) => {
                cell.addEventListener('input', function () {
                    if (cell.value.length >= 1) {
                        if (index + 1 < cells.length) {
                            cells[index + 1].focus();
                        }
                    }
                });
                if(i == 0) {cell.disabled = false}
            });
        }

        // replace the "#" in deff with ","
        deff = deff.replace(/#/g, ", ");

        // Set the text for deffinition with the deff variable
        document.getElementById("deff").innerHTML = deff;
    })

// Function to check the user's guess
function get_guess() {
    const row = document.getElementById("R" + row_num);
    let cells = row.querySelectorAll("input.cell");
    let guess = "";
    // Construct the guess from the input fields
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i]
        guess += cell.value
        // If the guess is not full, return early
        if (cell.value === "") {
            alert("Please fill in all letters before submitting your guess.");
            return;
        }
    }
    console.log(guess);
    // disable all the cells when row is complete and enable the next row
    for (let i = 0; i < cells.length; i++) {cells[i].disabled = true}
    try {
        const next_cells = document.getElementById("R" + (row_num + 1)).querySelectorAll("input.cell");
        for(let i=0; i<next_cells.length; i++) {
            next_cells[i].disabled = false;
        }
    } catch {}

    // Send the guess to the server for checking
    fetch("/NLHS_wordle/check_guess/" + guess)
        .then(res => res.json())
        .then(data => {
            const result = data.result;
            for (let i = 0; i < result.length; i++) {
                let cell = row.children[i]
                // Update cell color based on the result
                cell.classList.add(result[i])
            }
            // If the result only contains "correct", the user has guessed the word
            if (result.every(status => status === "correct")) {
                alert("Congratulations! You guessed the word!");
            }
        });
    
    // increment row
    if(row_num < max_row) {
        row_num++
    } else {
        alert("Out of Guesses, L")
    }
}