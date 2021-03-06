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
import re

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
        username = bleach.clean(data["username"])
        password = bleach.clean(data["password"])
        if username is None or password is None:
            print("Username or password missing")
            abort(400)
        if (not re.match(r"^[\da-z]{6,32}$", username)):
            abort(400)
        if (not re.match(r".*[a-z].*[a-z].*", username)):
            abort(400)
        if (not re.match(r"[A-Za-z\d@$!%*#?&\-]{6,32}", password)):
            print("Invalid password")
            abort(400)
        else:
            print("Valid password")

        # print(re.match(r"^[\da-z]{6,32}$", username))
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
            abort(401)
        user = db_session.query(User).filter_by(username=username).first()
        if not user:
            print("User not found")
            # This needs to inform the user
            abort(401)
        if not user.verify_password(password):
            print("Incorrect password")
            abort(401)
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

@app.route("/new", methods=["POST"])
def new():

    # Extract data from response
    data = request.data.decode("utf-8")
    print("----")
    print(data)
    data = loads(data)

    # Authenticate
    if "user_id" not in login_session or login_session["user_id"] is not data["user_id"]:
        # print(type(login_session["user_id"]))
        # print(type(data["user_id"]))
        # print(type(login_session))
        # print(login_session.keys())
        return "Forbidden", 403

    # Extract quiz from data
    quiz = data["quiz"]
    questions = data["questions"]


    ###########################
    # Data must be cleaned

    # Validate data

    ## Check questions length 3 or more
    if len(questions) < 3:
        return "Bad Request", 400

    ## Check there is a valid title
    if not isinstance(quiz["title"], str) or len(quiz["title"]) == 0:
        print("1")
        return "Bad Request", 400

    ## Check there is a valid description
    if not isinstance(quiz["description"], str) or len(quiz["description"]) == 0:
        print("2")
        return "Bad Request", 400

    ## Check there is a number for timer
    if not isinstance(quiz["timer"], int) or quiz["timer"] < 0 or quiz["timer"] > 30:
        print("3")
        return "Bad Request", 400

    ## For each question
    for question in questions:

    ### Check valid question
        if not isinstance(question["question"], str) or len(question["question"]) == 0:
            print("4")
            return "Bad Request", 400

    ### Check codes are valid format
        if len(question["codes"]) > 3:
            print("5")
            return "Bad Request", 400
        # Need to confirm these
        valid_codes = ["html", "css", "javascript", "python"]

        for code in question["codes"]:
            if not code["language"] in valid_codes:
                print("6")
                return "Bad Request", 400

            if not isinstance(code["contents"], str) or len(code["contents"]) == 0:
                print("7")
                return "Bad Request", 400

    ### Check valid answer
        if not isinstance(question["answer"], str) or len(question["answer"]) == 0:
            print("8")
            return "Bad Request", 400

    ### Check there is between 1 and 5 duds
        if len(question["duds"]) < 1 or len(question["duds"]) > 5:
            print("9")
            return "Bad Request", 400
    ### Check that the duds are all valid strings
        for dud in question["duds"]:
            if not isinstance(dud, str) or len(dud) == 0:
                print("10")
                return "Bad Request", 400

    ### Check that there is a valid explanation
        if not isinstance(question["explanation"], str) or len(question["explanation"]) == 0:
            print("11")
            return "Bad Request", 400

    # Add quiz to database
    print('Validated')

    new_quiz = Quiz(
        name=bleach.clean(quiz["title"]),
        description=bleach.clean(quiz["description"]),
        time_limit=quiz["timer"],
        visible=True,
        creator=data["user_id"]
    )

    db_session.add(new_quiz)
    db_session.flush()
    print("Added quiz")

    for question in questions:

        new_question = Question(
            text=bleach.clean(question["question"]),
            answer=bleach.clean(question["answer"]),
            explanation=bleach.clean(question["explanation"]),
            correct_replies=0,
            incorrect_replies=0
        )
        db_session.add(new_question)
        db_session.flush()
        print("Added question")

        new_quiz_join = QuizJoin(
            question_id=new_question.id,
            quiz_id=new_quiz.id
        )
        db_session.add(new_quiz_join)
        print("Added quizjoin")

        for dud in question["duds"]:
            new_dud = Dud(question_id=new_question.id,
                          text=bleach.clean(dud))
            db_session.add(new_dud)

            print("Added dud", dud)

        for code in question["codes"]:
            new_code = Code(question_id=new_question.id,
                            type=bleach.clean(code["language"]),
                            sample=bleach.clean(code["contents"])
            )
            db_session.add(new_code)

            print("Added code", code)

    db_session.commit()
    print("Added to database")

    return "OK", 200


if __name__ == "__main__":
    app.debug = True
    app.run(host="0.0.0.0", port=5000)
