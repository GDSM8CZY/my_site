# Copilot instructions for this repository

This is a small Flask site (learning/experimental). The goal of this file is to give an AI coding agent immediate, practical context so it can make safe, focused edits.

## Quick start (how maintainers run this)
- Install dependencies: `pip install flask`.
- Run locally: `python main.py` (the app calls `app.run(debug=True)` so this starts a dev server on localhost).

## Big-picture architecture
- Single-process Flask app: main entry point is `main.py`.
- Routes defined in `main.py`:
  - `/` → renders `templates/home.html` (extends `templates/base.html`).
  - `/NLHS_wordle` → builds a `grid` and renders `templates/NLHS_wordle.html`.
  - `/NLHS_wordle/get_daily_word` → returns JSON with a hard-coded `word` (see `main.py`).
- Templates use Jinja2 blocks: `title`, `extras`, and `content` (defined in `templates/base.html`).
- Static assets are under `static/` with two subfolders:
  - `static/src/` — front-end JavaScript (`NLHS_wordle.js`).
  - `static/style/` — CSS files (`style.css`, `NLHS_wordle.css`).

## Project-specific patterns and conventions
- Template inheritance: every page extends `base.html` and fills the `title`, optionally `extras` (for per-page CSS/JS), and `content` blocks.
- Static referencing: front-end assets are referenced using `url_for('static', filename='...')` (do not hardcode `/static/` paths).
- The word for the Wordle prototype is currently hard-coded in `main.py` as `word = "salve"`. Changing the daily word requires editing that variable or replacing it with a function that returns a value.
- Grid generation: `main.py` creates `grid = [[f"R{r}C{c}" ...]]` and passes it to the template; the template iterates the rows and prints inputs with ids matching `R{r}C{c}`. JS expects rows to have an id equal to their first cell's prefix (e.g., `R0`).

## Frontend ↔ Backend interaction
- `static/src/NLHS_wordle.js` fetches `GET /NLHS_wordle/get_daily_word` and stores `data.word` into a global `word` variable.
- The JS `check_guess()` function reads values from the input row, disables inputs, and increments `row_num`. The backend is only used to provide the daily word; there is no server-side guess validation yet.

## Developer workflows, debugging, and common edits
- To change layout or add global styles: edit `templates/base.html` and `static/style/style.css`.
- To change wordle behavior: edit `main.py` (word/grid), `templates/NLHS_wordle.html` (DOM/grid structure), and `static/src/NLHS_wordle.js` (client-side logic). These three files are tightly coupled — change all three if you change the grid size or ID naming.
- Debugging: run `python main.py` in a terminal and check the Flask console logs for route access and print statements. Use browser devtools to inspect network requests (the `GET /NLHS_wordle/get_daily_word` fetch) and the DOM for input IDs.

## Examples (concrete edits)
- Add a new route that returns JSON:
  - Edit `main.py` and add a function decorated with `@app.route('/my_endpoint')` that returns a dict — Flask will jsonify it automatically when returned as a Python dict.
- Change the daily word to be random each run:
  - Replace `word = "salve"` with a function that picks from a list or reads a file, and update the `/NLHS_wordle/get_daily_word` handler to call that function.

## Files to inspect first for PRs or bug fixes
- `main.py` — routes, app startup, and the hard-coded `word`.
- `templates/base.html` — global HTML structure and Jinja blocks.
- `templates/NLHS_wordle.html` — grid rendering and included JS/CSS.
- `static/src/NLHS_wordle.js` — client logic and fetch to backend.
- `static/style/NLHS_wordle.css` — visual layout for the wordle grid.

## What NOT to change without asking
- Do not rename the `static` or `templates` directories — Flask expects these paths by default.
- Avoid changing input `id` or row `id` naming in the template unless you update the JS accordingly (IDs are referenced directly by `document.getElementById`).

If anything here is incomplete or you want me to expand any section (e.g., add example PR checklists or propose a daily-word persistence strategy), tell me which part and I'll iterate.
