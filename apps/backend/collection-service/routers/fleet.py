"""Fleet management router — ROS 2 multi-robot discovery and namespace control.

Provides:
  GET  /fleet/status            — aggregate fleet health
  GET  /fleet/robots            — per-robot ROS 2 status
  POST /fleet/robots/{id}/namespace — assign / change ROS 2 namespace
"""

from fastapi import APIRouter, HTTPException

from models import (
    FleetStatus,
    FleetRobot,
    RobotStatus,
    ControllerState,
    Ros2NodeStatus,
)
from deps import CurrentUser

router = APIRouter()


@router.get("/status", response_model=dict)
async def fleet_status(_: CurrentUser):
    """Return aggregate fleet health.

    In production: queries the DDS graph via ``rclpy.get_node_names()``
    and checks controller_manager state for each discovered robot node.
    """
    from routers.robots import _robots

    robots: list[FleetRobot] = []
    namespaces: set[str] = set()

    for r in _robots.values():
        ns = r.ros2_namespace or ""
        if ns:
            namespaces.add(ns)
        robots.append(
            FleetRobot(
                robot_id=r.id,
                name=r.name,
                namespace=ns,
                embodiment=r.embodiment,
                connection_type=r.connection_type,
                status=r.status,
                ros2_status=r.ros2_status,
            )
        )

    active = sum(1 for r in _robots.values() if r.status == RobotStatus.connected)

    fleet = FleetStatus(
        total_robots=len(_robots),
        active_robots=active,
        namespaces=sorted(namespaces),
        dds_graph_healthy=active > 0,
        robots=robots,
    )
    return {"data": fleet.model_dump()}


@router.get("/robots", response_model=dict)
async def list_fleet_robots(_: CurrentUser):
    """List all robots with ROS 2 node status."""
    from routers.robots import _robots

    robots: list[dict] = []
    for r in _robots.values():
        robots.append(
            FleetRobot(
                robot_id=r.id,
                name=r.name,
                namespace=r.ros2_namespace or "",
                embodiment=r.embodiment,
                connection_type=r.connection_type,
                status=r.status,
                ros2_status=r.ros2_status,
            ).model_dump()
        )
    return {"data": robots}


@router.post("/robots/{robot_id}/namespace", response_model=dict)
async def set_namespace(robot_id: str, namespace: str, _: CurrentUser):
    """Assign or change the ROS 2 namespace for a connected robot.

    In production: triggers ``ros2 param set`` on the robot node and
    reconfigures the DDS discovery filter.
    """
    from routers.robots import _robots

    robot = _robots.get(robot_id)
    if not robot:
        raise HTTPException(status_code=404, detail="Robot not found")

    robot.ros2_namespace = namespace

    # Ensure ros2_status exists when namespace is set
    if robot.ros2_status is None:
        robot.ros2_status = Ros2NodeStatus(
            node_active=True,
            controller_state=ControllerState.active,
            dds_connected=True,
        )

    return {"data": {"robotId": robot_id, "namespace": namespace}}
