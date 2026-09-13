import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker
from app.config import settings

logger = logging.getLogger(__name__)

Base = declarative_base()


def get_engine():
    """
    Attempts to connect to configured DATABASE_URL.
    If PostgreSQL is unreachable (e.g. during local dev without Docker),
    gracefully falls back to SQLite so local development and testing never break.
    """
    db_url = settings.DATABASE_URL
    try:
        if db_url.startswith("postgresql"):
            # Test connectivity with a short timeout
            engine = create_engine(
                db_url,
                pool_pre_ping=True,
                connect_args={"connect_timeout": 3},
            )
            # Try connecting
            with engine.connect():
                pass
            logger.info("Successfully connected to PostgreSQL database.")
            return engine
    except Exception as e:
        logger.warning(
            f"Could not connect to PostgreSQL ({e}). Falling back to SQLite: {settings.DATABASE_SQLITE_FALLBACK}"
        )

    # SQLite fallback
    sqlite_url = settings.DATABASE_SQLITE_FALLBACK
    engine = create_engine(
        sqlite_url,
        connect_args={"check_same_thread": False} if sqlite_url.startswith("sqlite") else {},
    )
    return engine


engine = get_engine()
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def init_db():
    """Create database tables if they do not exist."""
    Base.metadata.create_all(bind=engine)


def get_db():
    """FastAPI dependency to yield database session."""
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
