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
            const cells = row.querySelectorAll("input.cell");
            cells.forEach((cell, index) => {
                cell.addEventListener('keydown', function (event) {
                    if (cell.value.length >= 1 && event.key != 'Backspace') {
                        if (index + 1 < cells.length) {
                            cells[index + 1].focus();
                        }
                    } else if (cell[index] = document.activeElement) {
                        if (index > 0 && cell.value == '') {
                            cell.value = '';
                            cells[index - 1].focus();
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
function get_guess(event) {
    // do nothing if the key is not enter
    if(event.key != 'Enter') {
        return "not submited";
    }

    const row = document.getElementById("R" + row_num);
    let cells = row.querySelectorAll("input.cell");
    let guess = "";
    // Construct the guess from the input fields
    for (let i = 0; i < cells.length; i++) {
        let cell = cells[i]
        guess += cell.value
        // If the guess is not full, return early
        if (cell.value === "") {
            // alert("Please fill in all letters before submitting your guess.");
            Swal.fire({
                title: "Incomplete Guess",
                text: "Please fill in all letters before submitting your guess.",
                icon: "warning",
                confirmButtonText: "OK",
                theme: "dark"
            })
            return;
        }
    }
    console.log(guess);
    // Send the guess to the server for checking
    fetch("/NLHS_wordle/check_guess/" + guess)
        .then(res => res.json())
        .then(data => {
            const result = data.result;
            // Check if the guess is valid
            if (result === "invalid") {
                Swal.fire({
                    title: "Invalid Word",
                    text: "Please try again.",
                    icon: "error",
                    confirmButtonText: "OK",
                    theme: "dark"
                });
                return;
            } else {
                // disable all the cells when row is complete and enable the next row
                for (let i = 0; i < cells.length; i++) {cells[i].disabled = true}
                try {
                    const next_cells = document.getElementById("R" + (row_num + 1)).querySelectorAll("input.cell");
                    for(let i=0; i<next_cells.length; i++) {
                        next_cells[i].disabled = false;
                    }
                } catch {}

                // Update cell color based on the result
                for (let i = 0; i < result.length; i++) {
                    let cell = row.children[i]
                    cell.classList.add(result[i])
                }

                // If the result only contains "correct", the user has guessed the word
                if (result.every(status => status === "correct")) {
                    Swal.fire({
                        title: "Congratulations!",
                        text: "You guessed the word!",
                        icon: "success",
                        confirmButtonText: "OK",
                        theme: "dark"
                    });
                    // disable all the cells
                    let cells = document.querySelectorAll(".cell")
                    cells.forEach((cell) => { cell.disabled = true; });

                }

                // increment row
                if(row_num < max_row) {
                    row_num++
                } else {
                    Swal.fire({
                        title: "You lose",
                        text: "You did not guess the word",
                        icon: "warning",
                        confirmButtonText: "OK",
                        theme: "dark"
                    });
                }
            }
        });
}