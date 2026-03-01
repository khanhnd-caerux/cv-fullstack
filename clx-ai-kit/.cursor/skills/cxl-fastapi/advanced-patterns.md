# FastAPI Advanced Patterns

## Background Tasks

```python
from fastapi import BackgroundTasks

@router.post("/users/{user_id}/send-welcome")
async def send_welcome_email(
    user_id: int,
    background_tasks: BackgroundTasks,
    db: AsyncSession = Depends(get_db),
):
    user = await UserService(db).get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    background_tasks.add_task(send_email, user.email, "Welcome!")
    return {"message": "Welcome email queued"}

async def send_email(to: str, subject: str) -> None:
    # Email sending logic
    pass
```

## Response Caching with Redis

```python
from fastapi_cache import FastAPICache
from fastapi_cache.backends.redis import RedisBackend
from fastapi_cache.decorator import cache
from redis import asyncio as aioredis

# Setup in lifespan
@asynccontextmanager
async def lifespan(app: FastAPI):
    redis = aioredis.from_url("redis://localhost")
    FastAPICache.init(RedisBackend(redis), prefix="fastapi-cache")
    yield
    await redis.close()

# Usage
@router.get("/items/{item_id}")
@cache(expire=300)  # Cache for 5 minutes
async def get_item(item_id: int):
    return await fetch_item(item_id)
```

## Streaming Responses

```python
from fastapi.responses import StreamingResponse

@router.get("/export/users")
async def export_users(db: AsyncSession = Depends(get_db)):
    async def generate_csv():
        yield "id,email,full_name\n"
        async for user in stream_users(db):
            yield f"{user.id},{user.email},{user.full_name}\n"
    
    return StreamingResponse(
        generate_csv(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=users.csv"},
    )
```

## Rate Limiting

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@router.post("/auth/login")
@limiter.limit("5/minute")
async def login(request: Request, ...):
    pass
```

## WebSocket Support

```python
from fastapi import WebSocket, WebSocketDisconnect

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: str):
        for connection in self.active_connections:
            await connection.send_text(message)

manager = ConnectionManager()

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: int):
    await manager.connect(websocket)
    try:
        while True:
            data = await websocket.receive_text()
            await manager.broadcast(f"Client {client_id}: {data}")
    except WebSocketDisconnect:
        manager.disconnect(websocket)
```

## File Uploads

```python
from fastapi import File, UploadFile
import aiofiles

@router.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    # Validate file
    if file.content_type not in ["image/jpeg", "image/png"]:
        raise HTTPException(status_code=400, detail="Invalid file type")
    
    if file.size > 5 * 1024 * 1024:  # 5MB limit
        raise HTTPException(status_code=400, detail="File too large")
    
    # Save file
    file_path = f"uploads/{file.filename}"
    async with aiofiles.open(file_path, "wb") as f:
        content = await file.read()
        await f.write(content)
    
    return {"filename": file.filename, "size": file.size}

@router.post("/upload-multiple")
async def upload_multiple(files: list[UploadFile] = File(...)):
    return {"filenames": [f.filename for f in files]}
```

## Custom Middleware

```python
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
import time
import logging

logger = logging.getLogger(__name__)

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        start_time = time.time()
        
        response = await call_next(request)
        
        process_time = time.time() - start_time
        logger.info(
            f"{request.method} {request.url.path} "
            f"completed in {process_time:.3f}s "
            f"status={response.status_code}"
        )
        
        response.headers["X-Process-Time"] = str(process_time)
        return response

app.add_middleware(RequestLoggingMiddleware)
```

## API Versioning

```python
# app/api/v1/router.py
from fastapi import APIRouter
v1_router = APIRouter(prefix="/api/v1")

# app/api/v2/router.py
from fastapi import APIRouter
v2_router = APIRouter(prefix="/api/v2")

# app/main.py
app.include_router(v1_router)
app.include_router(v2_router)
```

## Health Check Endpoint

```python
from fastapi import APIRouter
from sqlalchemy import text

router = APIRouter(tags=["health"])

@router.get("/health")
async def health_check():
    return {"status": "healthy"}

@router.get("/health/ready")
async def readiness_check(db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(text("SELECT 1"))
        return {"status": "ready", "database": "connected"}
    except Exception as e:
        raise HTTPException(
            status_code=503,
            detail={"status": "not ready", "database": str(e)}
        )
```

## Request Context and Correlation IDs

```python
import uuid
from contextvars import ContextVar
from starlette.middleware.base import BaseHTTPMiddleware

request_id_var: ContextVar[str] = ContextVar("request_id", default="")

class RequestIDMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = request.headers.get("X-Request-ID", str(uuid.uuid4()))
        request_id_var.set(request_id)
        
        response = await call_next(request)
        response.headers["X-Request-ID"] = request_id
        return response

def get_request_id() -> str:
    return request_id_var.get()
```

## Async Database Transactions

```python
from sqlalchemy.ext.asyncio import AsyncSession

class UserService:
    def __init__(self, db: AsyncSession):
        self.db = db
    
    async def transfer_credits(self, from_id: int, to_id: int, amount: int):
        async with self.db.begin():  # Transaction context
            from_user = await self.get_user(from_id)
            to_user = await self.get_user(to_id)
            
            if from_user.credits < amount:
                raise ValueError("Insufficient credits")
            
            from_user.credits -= amount
            to_user.credits += amount
            # Auto-commit on successful exit, rollback on exception
```

## OpenAPI Documentation Customization

```python
app = FastAPI(
    title="My API",
    description="API description with **Markdown** support",
    version="1.0.0",
    contact={"name": "API Support", "email": "support@example.com"},
    license_info={"name": "MIT"},
    openapi_tags=[
        {"name": "users", "description": "User operations"},
        {"name": "items", "description": "Item management"},
    ],
)

@router.post(
    "",
    response_model=UserResponse,
    status_code=201,
    summary="Create a new user",
    description="Create a new user with email and password.",
    responses={
        201: {"description": "User created successfully"},
        400: {"description": "Email already registered"},
        422: {"description": "Validation error"},
    },
)
async def create_user(user_in: UserCreate) -> UserResponse:
    """
    Create a new user:
    
    - **email**: unique email address
    - **full_name**: user's full name
    - **password**: secure password (min 8 characters)
    """
    pass
```

## Security Headers

```python
from fastapi.middleware.trustedhost import TrustedHostMiddleware
from starlette.middleware.httpsredirect import HTTPSRedirectMiddleware

if not settings.DEBUG:
    app.add_middleware(HTTPSRedirectMiddleware)
    app.add_middleware(TrustedHostMiddleware, allowed_hosts=settings.ALLOWED_HOSTS)
```
