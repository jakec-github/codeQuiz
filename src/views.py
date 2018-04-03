#!/usr/bin/env python3
from flask import (Flask,
                   render_template,
                   redirect,
                   request,
                   url_for,
                   make_response,
                   jsonify,
                   abort,
                   session as login_session)

from sqlalchemy import (create_engine,
                        desc)
from sqlalchemy.orm import sessionmaker
from model import (Base,
                   User,
                   Question,
                   Dud,
                   Code,
                   Quiz,
                   QuizJoin,
                   Score)

from json import loads
import bleach
import html

app = Flask(__name__)
app.secret_key = "super secret key"

engine = create_engine("postgresql+psycopg2://jakechorley@/js_quiz")
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
db_session = DBSession()


@app.route("/")
def home():
    return render_template("home.html")


@app.route("/allquizzes")
def get_all_quizzes():
    quizzes = db_session.query(Quiz).all()
    all_quizzes = []
    for quiz in quizzes:
        print("Constructing a quiz")
        quiz_dict = {
            "id": quiz.id,
            "name": quiz.name,
            "description": quiz.description,
            "length": db_session.query(QuizJoin).filter_by(quiz_id = quiz.id).count()
        }
        all_quizzes.append(quiz_dict)
        print('Finished constructing the quiz')
    return jsonify(all_quizzes), 200

@app.route("/userscores", methods=["POST"])
def get_scores():
    # Takes a user id to get all scores pertaining to a user
    # This route needs to be authenticated
    data = request.data.decode("utf-8")
    print("----")
    print(data)

    data = loads(data)

    # print(login_session)
    # print(data.user_id)

    if "user_id" not in login_session or login_session["user_id"] is not data["user_id"]:
        return "Forbidden", 403

    scores = db_session.query(Score).filter_by(user_id=data["user_id"]).all()

    all_scores = []
    for score in scores:
        score_dict = {
            "quiz_id": score.quiz_id,
            "score": score.score
        }
        all_scores.append(score_dict)
    return jsonify(all_scores), 200

@app.route("/choosequiz/<int:quiz_id>")
def choose_quiz(quiz_id):
    quiz = db_session.query(Quiz).filter_by(id=quiz_id).first()

    quiz = {
        "id": quiz.id,
        "name": quiz.name,
        "description": quiz.description,
        "timeLimit": quiz.time_limit
    }

    question_ids = db_session.query(QuizJoin).filter_by(quiz_id=quiz["id"]).all()
    question_ids = [x.question_id for x in question_ids]
    questions = db_session.query(Question).filter(Question.id.in_(question_ids)).all()
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

    data = {
        "quiz": quiz,
        "questionSet": all_questions
    }

    return jsonify(data), 200


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

@app.route("/score", methods=["POST"])
def score():
    data = request.data.decode("utf-8")
    print("----")
    print(data)

    data = loads(data)

    if "user_id" not in login_session or login_session["user_id"] is not data["user_id"]:
        print(type(login_session["user_id"]))
        print(type(data["user_id"]))
        return "Forbidden", 403

    current_score = db_session.query(Score) \
                    .filter_by(user_id=data["user_id"]) \
                    .filter_by(quiz_id=data["quiz_id"]) \
                    .first()

    print(current_score)
    if current_score == None:
        print('Creating new score')
        new_score = Score(score=data["score"],
                          user_id=data["user_id"],
                          quiz_id=data["quiz_id"])

        db_session.add(new_score)

    else:
        print('Found current score')
        current_score.score = max(current_score.score, data["score"])

    db_session.commit()


    return "OK", 200

# Authentication

@app.route("/register", methods=["GET", "POST"])
def register():
    # TODO: Make sure to bleach this stuff
    if request.method == "POST":
        # if using json request.json.get('username')
        data = request.get_json()
        username = data["username"]
        password = data["password"]
        if username is None or password is None:
            print("Username or password missing")
            abort(400)
        if db_session.query(User).filter_by(username=username).first() is not None:
            print("Username already taken")
            # This needs to inform the user
            abort(400)
        print("Creating user")
        user = User(username = username)
        user.generate_salt()
        user.hash_password(password)
        db_session.add(user)
        db_session.commit()
        login_session["user"] = user.username
        login_session["user_id"] = user.id
        return jsonify({"username": user.username, "user_id": user.id}), 201

@app.route("/login", methods=["GET","POST"])
def login():
    if request.method == "POST":
        data = request.get_json()
        username = data["username"]
        password = data["password"]
        if username is None or password is None:
            print("Username or password missing")
            abort(400)
        user = db_session.query(User).filter_by(username=username).first()
        if not user:
            print("User not found")
            # This needs to inform the user
            abort(400)
        if not user.verify_password(password):
            print("Incorrect password")
            abort(400)
            # This needs to inform the user
        login_session["user"] = user.username
        login_session["user_id"] = user.id
        return jsonify({"username": user.username, "user_id": user.id}), 201


@app.route("/logout", methods=["POST"])
def log_out():
    print("Log Out being attempted")
    if not login_session["user"]:
        print("Not logged in")
        abort(400)
    print("Destroying user session")
    del login_session["user"]

    return "Logged out", 200
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
        # I am sure it is possible to condense this to one db commit!!!
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
