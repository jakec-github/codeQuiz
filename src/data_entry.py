import sys

from json import loads

from sqlalchemy import (create_engine,
                        desc)
from sqlalchemy.orm import sessionmaker
from model import (Base,
                   Question,
                   Dud)

engine = create_engine('postgresql+psycopg2://jakechorley@/js_quiz')
Base.metadata.bind = engine
DBSession = sessionmaker(bind=engine)
db_session = DBSession()

target = sys.argv[1]

with open(target, "r") as f:
    questions = loads(f.read())

for question in questions:
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
