"""FastAPI dependency — JWT authentication.

Validates the Bearer token from the Authorization header against
JWT_SECRET (the same secret used by the auth-service).
"""

from __future__ import annotations

import os
from typing import Annotated

import jwt
from dotenv import load_dotenv
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

load_dotenv()

_security = HTTPBearer()

JWT_SECRET = os.getenv("JWT_SECRET", "changeme-secret")
JWT_ALGORITHM = os.getenv("JWT_ALGORITHM", "HS256")


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials, Depends(_security)],
) -> dict:
    """Decode and validate a JWT access token.

    Returns the decoded payload dict (contains at least ``sub`` = user ID).
    Raises HTTP 401 if the token is missing, expired, or invalid.
    """
    token = credentials.credentials
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except jwt.InvalidTokenError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return payload


CurrentUser = Annotated[dict, Depends(get_current_user)]
