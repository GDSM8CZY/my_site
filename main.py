import flask

app = flask.Flask(__name__)

word = "salve"

@app.route("/")
def home():
    return flask.render_template("home.html")

@app.route("/NLHS_wordle")
def NLHS_wordle():
    row = len(word) + 1
    col = len(word)

    grid = [[f"R{r}C{c}" for c in range(col)] for r in range(row)]

    return flask.render_template("NLHS_wordle.html", grid=grid)

@app.route("/NLHS_wordle/get_daily_word")
def NLHS_get_daily_word():
    return {"word": word}

if __name__ == "__main__":
    app.run(debug=True)