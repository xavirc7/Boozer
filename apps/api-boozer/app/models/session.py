from sqlalchemy import Column, Integer, Double, String
from base import Base

class Session(Base):
    __tablename__ = "session"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, unique=True)
    username = Column(String, unique=False, nullable=False)
    time_to_pay_seconds = Column(Double, default=None)
    score = Column(Integer, default=0)

    def __repr__(self):
        return f"<Player(username='{self.username}', score={self.score})>"