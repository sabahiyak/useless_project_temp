import logging
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.config import settings
from app.database import init_db
from app.api.routes import router as api_router

# Configure structured logging
logging.basicConfig(
    level=logging.INFO if not settings.DEBUG else logging.DEBUG,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s",
)
logger = logging.getLogger("coconut_counter")


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup: Initialize database schema
    logger.info(f"Starting {settings.PROJECT_NAME} backend v{settings.ALGORITHM_VERSION}")
    try:
        init_db()
        logger.info("Database schema initialized successfully.")
    except Exception as e:
        logger.warning(f"Could not initialize DB on startup: {e}")
    yield
    # Shutdown
    logger.info("Shutting down Coconut Counter API.")


app = FastAPI(
    title="Is My Coco Losing Hair?? 🥥 (Coconut Hair Counter)",
    description=(
        "Production-ready computer vision API for estimating visible fibres and hair patterns "
        "on coconut husks. Employs classical computer vision with honest confidence scoring."
    ),
    version=settings.ALGORITHM_VERSION,
    lifespan=lifespan,
)

# Configure Cross-Origin Resource Sharing (CORS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS if isinstance(settings.CORS_ORIGINS, list) else ["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Attach API routes
app.include_router(api_router)


@app.get("/")
def root():
    return {
        "app": settings.PROJECT_NAME,
        "version": settings.ALGORITHM_VERSION,
        "status": "online",
        "docs_url": "/docs",
    }


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception on {request.method} {request.url}: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "success": False,
            "error": "Internal Server Error",
            "message": "An unexpected error occurred while processing your request. Please try again.",
        },
    )


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
