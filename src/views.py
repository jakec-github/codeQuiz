#!/usr/bin/env python3
from flask import (Flask,
                   render_template,
                   redirect,
                   request,
                   url_for,
                   make_response,
                   jsonify)

from sqlalchemy import (create_engine,
                        desc)
from sqlalchemy.orm import sessionmaker
from model import (Base,
                   Question,
                   Dud,
                   Code)

from json import loads
import bleach
import html

app = Flask(__name__)

engine = create_engine('postgresql+psycopg2://jakechorley@/js_quiz')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
db_session = DBSession()


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/quiz")
def quiz():

    questions = db_session.query(Question).all()
    all_questions = []
    for question in questions:
        duds = db_session.query(Dud).filter_by(question_id=question.id).all()
        all_duds = []
        for dud in duds:
            all_duds.append(html.unescape(dud.text))

        codes = db_session.query(Code).filter_by(question_id=question.id).all()
        all_codes = []
        for code in codes:
            all_codes.append({
                "type": html.unescape(code.type),
                "sample": html.unescape(code.sample)
            })

        # TODO if statement needs testing
        if question.correct_replies == 0:
            if question.incorrect_replies == 0:
                difficulty = 1
            else:
                difficulty = 0
        else:
            difficulty = question.incorrect_replies / question.correct_replies

        question_dict = {
            "id": question.id,
            "text": html.unescape(question.text),
            "answer": html.unescape(question.answer),
            "explanation": html.unescape(question.explanation),
            "duds": all_duds,
            "codes": all_codes,
            "difficulty": difficulty
        }
        all_questions.append(question_dict)
        print("--------------")
        print("Question", question_dict["difficulty"])

    print("---------")
    all_questions = sorted(all_questions, key=lambda k: k["difficulty"])
    print(all_questions)
    return jsonify(all_questions), 200


@app.route("/difficulty", methods=["POST"])
def difficulty():
    data = request.data.decode("utf-8")
    print("----")
    print(data)
    print("----")
    data = loads(data)
    question = db_session.query(Question).filter_by(id=data["id"]).first()
    if data["correct"] == "correct":
        question.correct_replies += 1
    elif data["correct"] == "incorrect":
        question.incorrect_replies += 1
    db_session.commit()
    return "OK", 200


# Admin routes


@app.route("/add", methods=["GET", "POST"])
def add():
    if request.method == "GET":

        return render_template("add.html")

    if request.method == "POST":

        # Loop could be stopped when it reaches an empty string instead
        types = [x for x in request.form.getlist("code-type") if x != ""]
        samples = [x for x in request.form.getlist("code-sample") if x != ""]
        codes = []
        for i, t in enumerate(types):
            next_code = {
                "type": bleach.clean(t),
                "sample": bleach.clean(samples[i])
            }
            codes.append(next_code)

        question = {
            "text": bleach.clean(request.form["text"]),
            "answer": bleach.clean(request.form["answer"]),
            "duds": [bleach.clean(x)
                     for x
                     in request.form.getlist("incorrect")
                     if x != ""],
            "explanation": bleach.clean(request.form["explanation"]),
            "codes": codes
        }

        with open("log.txt", "a") as f:
            f.write(str(question["duds"]) + "\n\n")

        new_question = Question(text=question["text"],
                                answer=question["answer"],
                                explanation=question["explanation"],
                                correct_replies=0,
                                incorrect_replies=0)
        db_session.add(new_question)
        db_session.commit()
        print("Added question", question["text"])
        for dud in question["duds"]:
            new_dud = Dud(question_id=new_question.id,
                          text=dud)
            db_session.add(new_dud)
            db_session.commit()
            print("Added dud", dud)

        for code in question["codes"]:
            with open("log.txt", "a") as f:
                f.write("Loading code" + str(code) + "\n")
            new_code = Code(question_id=new_question.id,
                            type=code["type"],
                            sample=code["sample"])
            db_session.add(new_code)
            db_session.commit()

        return render_template("add.html"), 200


if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0", port=5000)
