import flask
import csv
import random
from waitress import serve

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

    word = random.choice(word_list)
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
    return {
        "deff": deff,
        "word": word
        }

# Endpoint to check the user's guess
@app.route("/NLHS_wordle/check_guess/<guess>")
def NLHS_check_guess(guess):
    result = []
    for i in range(len(word)):
        if guess[i] == word[i]:
            result.append("correct")
        elif guess[i] in word:
            result.append("present")
        else:
            result.append("absent")
    return {"result": result}

# if __name__ == "__main__":
#     app.run(debug=True)

serve(app, host='0.0.0.0', port=5001)