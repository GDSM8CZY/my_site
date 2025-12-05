import flask
import csv
import random

app = flask.Flask(__name__)

# pick and decline a random latin word
def pick_latin_word():
    # Load the list of words from the CSV file
    word_dict = {}
    word_list = []
    with open("static/data/latin_core_vocabulary_list1.csv", "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        for row in reader:
            word_dict[row[0]] = row[1]
            word_list.append(row[0])

    word = random.choice(word_list)
    deff = word_dict[word]

    # NEED TO FIX
    if len(word.split()) == 4:
        print("verb")
    elif len(word.split()) == 3:
        print("adjective")
    elif len(word.split()) == 2:
        print("noun")
    else:
        print("preposition")

    return word.split()[0], word_dict[word]


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
    result = []
    for i in range(len(word)):
        if guess[i] == word[i]:
            result.append("correct")
        elif guess[i] in word:
            result.append("present")
        else:
            result.append("absent")
    return {"result": result}

if __name__ == "__main__":
    app.run(debug=True)