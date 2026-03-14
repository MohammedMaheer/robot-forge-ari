"""Pydantic models for the Collection Service."""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


class RobotEmbodiment(str, Enum):
    ur5 = "ur5"
    ur10 = "ur10"
    franka_panda = "franka_panda"
    xarm6 = "xarm6"
    xarm7 = "xarm7"
    unitree_h1 = "unitree_h1"
    unitree_g1 = "unitree_g1"
    figure01 = "figure01"
    agility_digit = "agility_digit"
    boston_dynamics_spot = "boston_dynamics_spot"
    clearpath_husky = "clearpath_husky"
    custom = "custom"


class RobotTask(str, Enum):
    bin_picking = "bin_picking"
    assembly = "assembly"
    packing = "packing"
    palletizing = "palletizing"
    navigation = "navigation"
    inspection = "inspection"
    surgical = "surgical"
    manipulation = "manipulation"
    whole_body_loco = "whole_body_loco"
    custom = "custom"


class ConnectionType(str, Enum):
    ros2 = "ros2"
    grpc = "grpc"
    websocket = "websocket"
    usb = "usb"


class SessionMode(str, Enum):
    manual = "manual"
    ai_assisted = "ai_assisted"


class SessionStatus(str, Enum):
    idle = "idle"
    recording = "recording"
    paused = "paused"
    processing = "processing"


class RobotStatus(str, Enum):
    connected = "connected"
    disconnected = "disconnected"
    error = "error"
    recording = "recording"


class EpisodeStatus(str, Enum):
    recording = "recording"
    processing = "processing"
    packaged = "packaged"
    listed = "listed"
    failed = "failed"


# ── Request/Response Models ────────────────────────────────


class RobotConnectRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    embodiment: RobotEmbodiment
    connection_type: ConnectionType
    ip_address: str
    port: Optional[int] = None


class CameraStream(BaseModel):
    id: str
    name: str
    resolution: dict = Field(default={"width": 640, "height": 480})
    fps: int = 30


class ConnectedRobot(BaseModel):
    id: str
    name: str
    embodiment: RobotEmbodiment
    connection_type: ConnectionType
    ip_address: str
    status: RobotStatus = RobotStatus.connected
    battery_level: Optional[int] = None
    cameras: list[CameraStream] = []


class SessionCreateRequest(BaseModel):
    task: RobotTask
    mode: SessionMode = SessionMode.manual
    robot_ids: list[str]
    target_episodes: Optional[int] = None


class CollectionSession(BaseModel):
    id: str
    operator_id: str
    robots: list[ConnectedRobot] = []
    status: SessionStatus = SessionStatus.idle
    mode: SessionMode = SessionMode.manual
    episode_count: int = 0
    started_at: datetime
    target_episodes: Optional[int] = None


class EpisodeMetadata(BaseModel):
    environment: str = "lab"
    lighting: str = "bright"
    object_variety: int = 0
    success_label: Optional[bool] = None
    operator_id: str = ""
    ai_assisted: bool = False
    compression_ratio: float = 1.0
    raw_size_bytes: int = 0
    compressed_size_bytes: int = 0


class Episode(BaseModel):
    id: str
    session_id: str
    robot_id: str
    embodiment: RobotEmbodiment
    task: RobotTask
    duration_ms: int = 0
    frame_count: int = 0
    quality_score: float = 0
    status: EpisodeStatus = EpisodeStatus.recording
    sensor_modalities: list[str] = []
    storage_url: Optional[str] = None
    thumbnail_url: Optional[str] = None
    metadata: EpisodeMetadata = EpisodeMetadata()
    created_at: datetime
