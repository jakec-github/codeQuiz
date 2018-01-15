#!/usr/bin/env python3
from flask import (Flask,
                   render_template,
                   redirect,
                   url_for,
                   make_response,
                   jsonify)

from json import loads

app = Flask(__name__)


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/quiz")
def quiz():
    with open(app.static_folder + "/questions.json", "r") as f:
        questions = loads(f.read())

    return jsonify(questions), 200


if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0", port=5000)
