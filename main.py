import flask

app = flask.Flask(__name__)

word = "salve"

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
    return {"word": word}

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