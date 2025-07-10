from sqlalchemy import (
    Column,
    Integer,
    String,
    Text,
    Float,
    DateTime,
    ForeignKey,
    create_engine,
    CheckConstraint,
)
from sqlalchemy.orm import declarative_base, relationship, sessionmaker
from datetime import datetime
from pathlib import Path

Base = declarative_base()
DB_PATH = Path(__file__).parent.parent / "data" / "sample.db"


class Session(Base):
    __tablename__ = "sessions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    title = Column(String)
    created_at = Column(DateTime, default=datetime.now)
    updated_at = Column(DateTime, default=datetime.now)

    messages = relationship(
        "Message", back_populates="session", cascade="all, delete-orphan"
    )
    settings = relationship(
        "Setting", back_populates="session", cascade="all, delete-orphan"
    )


class Message(Base):
    __tablename__ = "messages"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(
        Integer, ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False
    )
    role = Column(
        String, CheckConstraint("role IN ('user', 'assistant')"), nullable=False
    )
    content = Column(Text, nullable=False)
    timestamp = Column(DateTime, default=datetime.now)

    session = relationship("Session", back_populates="messages")


class Setting(Base):
    __tablename__ = "settings"

    id = Column(Integer, primary_key=True, autoincrement=True)
    session_id = Column(
        Integer, ForeignKey("sessions.id", ondelete="CASCADE"), nullable=False
    )
    model = Column(String, default="gpt-3.5-turbo")
    temperature = Column(Float, default=1.0)
    top_p = Column(Float, default=1.0)

    session = relationship("Session", back_populates="settings")


def create_mock_data():
    engine = create_engine(f"sqlite:///{DB_PATH}", echo=False, future=True)
    Base.metadata.drop_all(engine)
    Base.metadata.create_all(engine)

    SessionLocal = sessionmaker(bind=engine, future=True)
    db = SessionLocal()

    # セッション1
    s1 = Session(
        id=1,
        title="最初の会話",
        created_at=datetime(2025, 7, 10, 10, 0, 0),
        updated_at=datetime(2025, 7, 10, 10, 5, 0),
    )
    s1.messages = [
        Message(
            role="user",
            content="こんにちは。",
            timestamp=datetime(2025, 7, 10, 10, 0, 5),
        ),
        Message(
            role="assistant",
            content="こんにちは。今日は何をしましょうか？",
            timestamp=datetime(2025, 7, 10, 10, 0, 6),
        ),
        Message(
            role="user",
            content="自己紹介してください。",
            timestamp=datetime(2025, 7, 10, 10, 1, 0),
        ),
        Message(
            role="assistant",
            content="私はOpenAIが開発したAIアシスタントです。",
            timestamp=datetime(2025, 7, 10, 10, 1, 1),
        ),
    ]
    s1.settings = [
        Setting(model="gpt-3.5-turbo", temperature=1.0, top_p=1.0),
    ]

    # セッション2
    s2 = Session(
        id=2,
        title="プロジェクト相談",
        created_at=datetime(2025, 7, 10, 11, 0, 0),
        updated_at=datetime(2025, 7, 10, 11, 12, 0),
    )
    s2.messages = [
        Message(
            role="user",
            content="ReactでチャットUIを作りたいんだけど",
            timestamp=datetime(2025, 7, 10, 11, 0, 0),
        ),
        Message(
            role="assistant",
            content="もちろん。どういった構成を考えていますか？",
            timestamp=datetime(2025, 7, 10, 11, 0, 2),
        ),
        Message(
            role="user",
            content="OpenAI APIと連携して、会話を保存したい",
            timestamp=datetime(2025, 7, 10, 11, 10, 0),
        ),
        Message(
            role="assistant",
            content="SQLiteでセッションとメッセージを管理する構成が良いでしょう。",
            timestamp=datetime(2025, 7, 10, 11, 12, 0),
        ),
    ]
    s2.settings = [
        Setting(model="gpt-4", temperature=0.7, top_p=1.0),
    ]

    db.add_all([s1, s2])
    db.commit()
    db.close()


if __name__ == "__main__":
    create_mock_data()
