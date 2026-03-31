"""Pydantic models for the Collection Service.

Covers robot connection, session management, episode recording, and
ROS 2 fleet / rosbag2 recording / policy-server relay domains.
"""

from pydantic import BaseModel, Field
from typing import Optional
from datetime import datetime
from enum import Enum


# ── Core Enums ─────────────────────────────────────────────


class RobotEmbodiment(str, Enum):
    ur5 = "ur5"
    ur10 = "ur10"
    franka_panda = "franka_panda"
    xarm6 = "xarm6"
    xarm7 = "xarm7"
    so100 = "so100"
    so101 = "so101"
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
    leader_follower = "leader_follower"
    custom = "custom"


class ConnectionType(str, Enum):
    ros2 = "ros2"
    grpc = "grpc"
    websocket = "websocket"
    usb = "usb"


class SessionMode(str, Enum):
    manual = "manual"
    ai_assisted = "ai_assisted"
    leader_follower = "leader_follower"


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


# ── ROS 2 Enums ───────────────────────────────────────────


class ControllerState(str, Enum):
    unconfigured = "unconfigured"
    inactive = "inactive"
    active = "active"
    finalized = "finalized"


class StorageFormat(str, Enum):
    mcap = "mcap"
    sqlite3 = "sqlite3"


class PolicyProtocol(str, Enum):
    grpc = "grpc"
    zmq = "zmq"


class RecordingState(str, Enum):
    recording = "recording"
    stopped = "stopped"
    converting = "converting"
    completed = "completed"
    error = "error"


# ── ROS 2 Models ──────────────────────────────────────────


class Ros2TopicInfo(BaseModel):
    name: str
    message_type: str
    hz: Optional[float] = None


class Ros2NodeStatus(BaseModel):
    node_active: bool = False
    controller_state: ControllerState = ControllerState.unconfigured
    dds_connected: bool = False
    topics: list[Ros2TopicInfo] = []
    last_heartbeat: Optional[datetime] = None


class FleetRobot(BaseModel):
    robot_id: str
    name: str
    namespace: str = ""
    embodiment: RobotEmbodiment = RobotEmbodiment.custom
    connection_type: ConnectionType = ConnectionType.ros2
    status: RobotStatus = RobotStatus.disconnected
    ros2_status: Optional[Ros2NodeStatus] = None


class FleetStatus(BaseModel):
    total_robots: int = 0
    active_robots: int = 0
    namespaces: list[str] = []
    dds_graph_healthy: bool = False
    robots: list[FleetRobot] = []


class RecordingStartRequest(BaseModel):
    session_id: str
    topic_filters: list[str] = Field(default_factory=list, description="ROS 2 topic patterns to record (empty = all)")
    storage_format: StorageFormat = StorageFormat.mcap


class RosbagRecording(BaseModel):
    id: str
    session_id: str
    status: RecordingState = RecordingState.recording
    storage_format: StorageFormat = StorageFormat.mcap
    file_path: Optional[str] = None
    file_size_mb: float = 0
    duration_seconds: float = 0
    topics_recorded: list[str] = []
    message_count: int = 0
    started_at: Optional[datetime] = None
    stopped_at: Optional[datetime] = None


class PolicyConnectRequest(BaseModel):
    address: str = Field(..., description="Policy server address (host:port)")
    protocol: PolicyProtocol = PolicyProtocol.grpc
    model_name: str = Field(..., description="Model to load (e.g. act, smolvla, pi0)")
    robot_id: Optional[str] = Field(None, description="Robot to bind policy output to")


class PolicyServerStatus(BaseModel):
    connected: bool = False
    address: Optional[str] = None
    protocol: Optional[PolicyProtocol] = None
    model_name: Optional[str] = None
    bound_robot_id: Optional[str] = None
    avg_latency_ms: float = 0
    inference_count: int = 0
    last_inference_at: Optional[datetime] = None


# ── Request/Response Models ────────────────────────────────


class RobotConnectRequest(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    embodiment: RobotEmbodiment
    connection_type: ConnectionType
    ip_address: str
    port: Optional[int] = None
    ros2_namespace: Optional[str] = Field(None, description="ROS 2 namespace, e.g. /robot/arm1")


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
    ros2_namespace: Optional[str] = None
    ros2_status: Optional[Ros2NodeStatus] = None


class SessionCreateRequest(BaseModel):
    task: RobotTask
    mode: SessionMode = SessionMode.manual
    robot_ids: list[str]
    target_episodes: Optional[int] = None


class CollectionSession(BaseModel):
    id: str
    operator_id: str
    task: RobotTask
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
    rosbag_id: Optional[str] = None


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
