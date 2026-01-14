from collections import Counter
import flask
import csv
import random

app = flask.Flask(__name__)

# pick and decline a random latin word
def pick_latin_word():
    # Load the list of words from the CSV file
    word_dict = {}
    with open("static/data/latin_core_vocabulary_list1.csv", "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        next(reader, None)  # Skip the header row
        for row in reader:
            # col 1 is deffinition, col 2 is part of speech
            word_dict[row[0]] = (row[1], row[2])

        
    word_list = list(word_dict.keys())

    word = random.choice(word_list).replace('#', '')
    deff = word_dict[word][1] + "; " + word_dict[word][0]

    return word.split()[0], deff


word, deff = pick_latin_word()

# Endpoint to serve the home page
@app.route("/")
def home():
    return flask.render_template("home.html")

# Endpoint to serve the NLHS Wordle game page
@app.route("/NLHS_wordle")
def NLHS_wordle():
    row = len(word) + 1
    col = len(word)

    grid = [[f"R{r}C{c}" for c in range(col)] for r in range(row)]

    return flask.render_template("NLHS_wordle.html", grid=grid)

# Endpoint to get the daily word
@app.route("/NLHS_wordle/get_daily_word")
def NLHS_get_daily_word():
    print(word)
    print(deff)
    return {
        "deff": deff,
        "word": word
        }

# Endpoint to check the user's guess
@app.route("/NLHS_wordle/check_guess/<guess>")
def NLHS_check_guess(guess):
    result = ['absent'] * len(word)
    word_count = Counter(word)

    # First pass for all the green letters
    for i in range(len(word)):
        if guess[i] == word[i]:
            result[i] == 'correct'
            word_count[guess[i]] -= 1
    
    # Second pass to find yellow letters
    for i in range(len(word)):
        if result[i] == 'absent' and word_count.get(guess[i], 0) < 0:
            result[i] = 'present'
            word_count[guess[i]] -= 1
    
    return {"result": result}

if __name__ == "__main__":
    app.run(debug=True)