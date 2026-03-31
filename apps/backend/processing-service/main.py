"""ROBOTFORGE Processing Service — FastAPI application."""

from __future__ import annotations

import asyncio
import logging
import os
from contextlib import asynccontextmanager
from typing import AsyncIterator

import aio_pika
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routers import jobs, pipeline

logger = logging.getLogger("processing-service")
logging.basicConfig(level=logging.INFO, format="%(asctime)s  %(levelname)-8s  %(message)s")

# ---------------------------------------------------------------------------
# Global state shared across the application
# ---------------------------------------------------------------------------
RABBITMQ_URL = os.getenv("RABBITMQ_URL", "amqp://guest:guest@localhost:5672/")
QUEUE_NAME = "processing_tasks"

_rabbitmq_connection: aio_pika.abc.AbstractRobustConnection | None = None
_rabbitmq_channel: aio_pika.abc.AbstractChannel | None = None
_consumer_tag: str | None = None


async def _on_processing_message(message: aio_pika.abc.AbstractIncomingMessage) -> None:
    """Handle an incoming processing-task message from RabbitMQ."""
    async with message.process():
        body = message.body.decode()
        logger.info("Received processing task: %s", body)
        # Delegate to the pipeline runner via the jobs store (fire-and-forget)
        # In production this would deserialise & call pipeline.run_pipeline
        await asyncio.sleep(0)  # yield to event-loop


async def _connect_rabbitmq() -> None:
    """Establish a RabbitMQ connection, declare the queue and start consuming."""
    global _rabbitmq_connection, _rabbitmq_channel, _consumer_tag  # noqa: PLW0603

    try:
        _rabbitmq_connection = await aio_pika.connect_robust(RABBITMQ_URL)
        _rabbitmq_channel = await _rabbitmq_connection.channel()
        await _rabbitmq_channel.set_qos(prefetch_count=5)

        queue = await _rabbitmq_channel.declare_queue(QUEUE_NAME, durable=True)
        _consumer_tag = await queue.consume(_on_processing_message)
        logger.info("Connected to RabbitMQ — consuming queue '%s'", QUEUE_NAME)
    except Exception:
        logger.warning("RabbitMQ unavailable — running without message queue", exc_info=True)


async def _disconnect_rabbitmq() -> None:
    """Gracefully close the RabbitMQ connection."""
    global _rabbitmq_connection, _rabbitmq_channel, _consumer_tag  # noqa: PLW0603

    if _rabbitmq_channel is not None:
        try:
            await _rabbitmq_channel.close()
        except Exception:
            pass
        _rabbitmq_channel = None
    if _rabbitmq_connection is not None:
        try:
            await _rabbitmq_connection.close()
        except Exception:
            pass
        _rabbitmq_connection = None
    _consumer_tag = None
    logger.info("Disconnected from RabbitMQ")


# ---------------------------------------------------------------------------
# Lifespan
# ---------------------------------------------------------------------------
@asynccontextmanager
async def lifespan(_app: FastAPI) -> AsyncIterator[None]:
    """Application lifespan: connect on startup, disconnect on shutdown."""
    await _connect_rabbitmq()
    yield
    await _disconnect_rabbitmq()


# ---------------------------------------------------------------------------
# Application
# ---------------------------------------------------------------------------
app = FastAPI(
    title="ROBOTFORGE Processing Service",
    version="0.1.0",
    description="Episode processing pipeline — frame filtering, compression, annotation, quality scoring & packaging.",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[os.getenv("CORS_ORIGIN", "http://localhost:5173")],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Routers ---------------------------------------------------------------
app.include_router(jobs.router, prefix="/jobs", tags=["jobs"])
app.include_router(pipeline.router, prefix="/pipeline", tags=["pipeline"])


# --- Health -----------------------------------------------------------------
@app.get("/health", tags=["health"])
async def health_check() -> dict[str, str]:
    return {"status": "ok", "service": "processing"}


# ---------------------------------------------------------------------------
# Entrypoint
# ---------------------------------------------------------------------------
if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8002, reload=True)
