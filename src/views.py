#!/usr/bin/env python3
from flask import (Flask,
                   render_template,
                   redirect,
                   url_for,
                   make_response,
                   jsonify)

from sqlalchemy import (create_engine,
                        desc)
from sqlalchemy.orm import sessionmaker
from model import (Base,
                   Question,
                   Dud)

from json import loads

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
            all_duds.append(dud.text)
        question_dict = {
            "text": question.text,
            "answer": question.answer,
            "explanation": question.explanation,
            "duds": all_duds
        }
        all_questions.append(question_dict)
        print("--------------")
        print("Question", question_dict)

    # with open(app.static_folder + "/questions.json", "r") as f:
    #     questions = loads(f.read())
    print("---------")
    print(all_questions)
    return jsonify(all_questions), 200


if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0", port=5000)
