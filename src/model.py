from sqlalchemy import (create_engine,
                        Column, Integer,
                        String,
                        ForeignKey,
                        Boolean)
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from passlib.apps import custom_app_context as pwd_context

import random
import string

Base = declarative_base()

class User(Base):
    __tablename__ = "user"

    id = Column(Integer, primary_key=True)
    username = Column(String)
    password_hash = Column(String, nullable=False)
    salt = Column(String, nullable=False)

    def generate_salt(self):
        self.salt = "".join(random.choice(string.ascii_letters + string.digits) for i in range(16))

    def hash_password(self, password):
        # Check that this is the correct way to salt password
        salted_password = password + self.salt
        print(salted_password)
        self.password_hash = pwd_context.encrypt(salted_password)
        print('----')
        print(self.password_hash)

    def verify_password(self, password):
        salted_password = password + self.salt
        return pwd_context.verify(salted_password, self.password_hash)


class Question(Base):
    __tablename__ = "question"

    id = Column(Integer, primary_key=True)
    text = Column(String)
    answer = Column(String)
    explanation = Column(String)
    correct_replies = Column(Integer)
    incorrect_replies = Column(Integer)


class Dud(Base):
    __tablename__ = "dud"

    id = Column(Integer, primary_key=True)
    text = Column(String)
    question_id = Column(Integer, ForeignKey('question.id'))

    question = relationship(Question)


class Code(Base):
    __tablename__ = "code"

    id = Column(Integer, primary_key=True)
    type = Column(String)
    sample = Column(String)
    question_id = Column(Integer, ForeignKey('question.id'))

    question = relationship(Question)


class Quiz(Base):
    __tablename__ = "quiz"

    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)
    time_limit = Column(Integer)
    visible = Column(Boolean)
    creator = Column(Integer, ForeignKey('user.id'))

    user = relationship(User)


class QuizJoin(Base):
    __tablename__ = "quiz_join"

    id = Column(Integer, primary_key=True)
    question_id = Column(Integer, ForeignKey('question.id'))
    quiz_id = Column(Integer, ForeignKey('quiz.id'))

    question = relationship(Question)
    quiz = relationship(Quiz)

class Score(Base):
    __tablename__ = "score"

    id = Column(Integer, primary_key=True)
    score = Column(Integer)
    user_id = Column(Integer, ForeignKey('user.id'))
    quiz_id = Column(Integer, ForeignKey('quiz.id'))

    user = relationship(User)
    quiz = relationship(Quiz)


engine = create_engine("postgresql+psycopg2://jakechorley@/js_quiz")

Base.metadata.create_all(engine)
