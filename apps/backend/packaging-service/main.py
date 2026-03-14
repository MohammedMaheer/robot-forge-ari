"""ROBOTFORGE Packaging Service — FastAPI application."""

from __future__ import annotations

import logging
from contextlib import asynccontextmanager
from typing import AsyncIterator

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import export, formats

logger = logging.getLogger("packaging-service")
logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(levelname)-8s  %(message)s")


@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    """Application lifespan hook."""
    logger.info("Packaging Service starting up")
    yield
    logger.info("Packaging Service shutting down")


app = FastAPI(
    title="ROBOTFORGE Packaging Service",
    version="0.1.0",
    description="Package robot-learning episodes into distributable dataset formats (HDF5, RLDS, LeRobot, Parquet, etc.).",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---------------------------------------------------------------
app.include_router(formats.router, prefix="/formats", tags=["formats"])
app.include_router(export.router, prefix="/export", tags=["export"])


# --- Health -----------------------------------------------------------------
@app.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "packaging"}


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8003, reload=True)
