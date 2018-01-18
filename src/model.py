from sqlalchemy import create_engine, Column, Integer, String, ForeignKey
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship

Base = declarative_base()


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


engine = create_engine("postgresql+psycopg2://jakechorley@/js_quiz")

Base.metadata.create_all(engine)
