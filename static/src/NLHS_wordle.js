let row_num = 0;

// Fetch the daily word from the server
fetch("/NLHS_wordle/get_daily_word")
    .then(res => res.json())
    .then(data => {
        const word = data.word;
        let deff = data.deff;
        
        // replace the "#" in deff with ","
        deff = deff.replace(/#/g, ", ");
        
        // Set the text for deffinition with the deff variable
        document.getElementById("deff").innerHTML = "Deffinition: " + deff;
    })

// Function to check the user's guess
function get_guess() {
    const row = document.getElementById("R" + row_num);
    let guess = "";
    // Construct the guess from the input fields
    for (let i = 0; i < row.children.length; i++) {
        let cell = row.children[i]
        guess += cell.value
        // If the guess is not full, return early
        if (cell.value === "") {
            alert("Please fill in all letters before submitting your guess.");
            return;
        }
        cell.disabled = true
    }
    console.log(guess);

    // Send the guess to the server for checking
    fetch("/NLHS_wordle/check_guess/" + guess)
        .then(res => res.json())
        .then(data => {
            const result = data.result;
            for (let i = 0; i < result.length; i++) {
                let cell = row.children[i]
                // Update cell color based on the result
                if (result[i] === "correct") {
                    cell.classList.add("correct");
                } else if (result[i] === "present") {
                    cell.classList.add("present");
                } else {
                    cell.classList.add("absent");
                }
            }
            // If the result only contains "correct", the user has guessed the word
            if (result.every(status => status === "correct")) {
                alert("Congratulations! You guessed the word!");
                let cells_all = document.querySelectorAll("input.cell");
            }
        });
    
    // increment row
    row_num += 1;
}