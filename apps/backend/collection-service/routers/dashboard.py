from datetime import datetime, timedelta, timezone
from fastapi import APIRouter
from deps import CurrentUser
from models import EpisodeStatus, RobotStatus

router = APIRouter()


def _now() -> datetime:
    return datetime.now(timezone.utc)


@router.get("/kpis")
async def get_kpis(current_user: CurrentUser):
    from routers.episodes import _episodes
    from routers.robots import _robots

    user_id = current_user["sub"]
    now = _now()
    week_ago = now - timedelta(days=7)
    two_weeks_ago = now - timedelta(days=14)

    user_episodes = [e for e in _episodes.values() if e.metadata.operator_id == user_id]

    this_week = [e for e in user_episodes if e.created_at >= week_ago]
    last_week = [e for e in user_episodes if two_weeks_ago <= e.created_at < week_ago]

    if last_week:
        growth_pct = round((len(this_week) - len(last_week)) / len(last_week) * 100)
        weekly_growth = f"{'+' if growth_pct >= 0 else ''}{growth_pct}%"
    elif this_week:
        weekly_growth = "+100%"
    else:
        weekly_growth = "+0%"

    storage_bytes = sum(e.metadata.compressed_size_bytes for e in user_episodes)
    storage_gb = round(storage_bytes / 1e9, 2)

    completed = [e for e in user_episodes if e.status == EpisodeStatus.packaged]
    avg_quality = round(sum(e.quality_score for e in completed) / len(completed), 1) if completed else 0

    active_robots = sum(1 for r in _robots.values() if r.status == RobotStatus.connected)

    return {
        "data": {
            "totalEpisodes": len(user_episodes),
            "weeklyGrowth": weekly_growth,
            "storageUsedGb": storage_gb,
            "storageQuotaGb": 500,
            "activeRobots": active_robots,
            "avgQuality": avg_quality,
        }
    }


@router.get("/activity")
async def get_activity(current_user: CurrentUser):
    from routers.episodes import _episodes
    from routers.sessions import _sessions

    user_id = current_user["sub"]
    now = _now()
    items = []

    # Recent episodes
    user_episodes = sorted(
        [e for e in _episodes.values() if e.metadata.operator_id == user_id],
        key=lambda e: e.created_at,
        reverse=True,
    )[:5]
    for ep in user_episodes:
        age = now - ep.created_at
        items.append({
            "type": "episode",
            "title": f"Episode recorded — {ep.task.value.replace('_', ' ').title()}",
            "time": _relative_time(age),
        })

    # Recent sessions
    user_sessions = sorted(
        [s for s in _sessions.values() if s.operator_id == user_id],
        key=lambda s: s.started_at,
        reverse=True,
    )[:5]
    for sess in user_sessions:
        age = now - sess.started_at
        items.append({
            "type": "session",
            "title": f"Session {sess.status.value} — {sess.task.value.replace('_', ' ').title()}",
            "time": _relative_time(age),
        })

    # Sort combined list by recency (best effort — relative time strings)
    return {"data": items[:10]}


@router.get("/efficiency")
async def get_efficiency(current_user: CurrentUser):
    from routers.episodes import _episodes

    user_id = current_user["sub"]
    now = _now()
    days = 14

    buckets: dict[str, list[float]] = {}
    for i in range(days):
        day = (now - timedelta(days=days - 1 - i)).strftime("%Y-%m-%d")
        buckets[day] = []

    user_episodes = [e for e in _episodes.values() if e.metadata.operator_id == user_id]
    cutoff = now - timedelta(days=days)
    for ep in user_episodes:
        if ep.created_at >= cutoff and ep.status == EpisodeStatus.packaged:
            day = ep.created_at.strftime("%Y-%m-%d")
            if day in buckets:
                buckets[day].append(ep.quality_score)

    result = []
    for day, scores in buckets.items():
        efficiency = round(sum(scores) / len(scores), 1) if scores else 0
        result.append({"date": day, "efficiency": efficiency})

    return {"data": result}


def _relative_time(delta: timedelta) -> str:
    secs = int(delta.total_seconds())
    if secs < 60:
        return "just now"
    if secs < 3600:
        return f"{secs // 60}m ago"
    if secs < 86400:
        return f"{secs // 3600}h ago"
    return f"{secs // 86400}d ago"
