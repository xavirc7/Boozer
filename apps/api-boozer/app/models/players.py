from sqlalchemy import create_engine, Column, Integer, String
from base import Base

class Player(Base):
    __tablename__ = "players"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, nullable=False)
    score = Column(Integer, default=0)

    def __repr__(self):
        return f"<Player(username='{self.username}', score={self.score})>"