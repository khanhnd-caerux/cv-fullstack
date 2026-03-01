---
name: cxl-fastapi
description: FastAPI development patterns, best practices, and conventions. Use when building REST APIs with FastAPI, implementing authentication, creating Pydantic models, handling dependency injection, integrating databases, or writing API tests.
---

# FastAPI Development Standards & Best Practices

## Project Structure

```
app/
├── main.py              # FastAPI app instance
├── config.py            # Pydantic settings
├── dependencies.py      # Shared dependencies
├── api/
│   ├── deps.py          # API dependencies (auth, db)
│   └── v1/
│       ├── router.py    # Router aggregator
│       └── endpoints/   # Route handlers
├── core/
│   ├── security.py      # Auth utilities
│   └── exceptions.py    # Custom exceptions
├── models/              # SQLAlchemy models
├── schemas/             # Pydantic schemas
├── services/            # Business logic
└── db/
    ├── session.py       # Database session
    └── repositories/    # Data access layer
```

## Application Setup

```python
# app/main.py
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.v1.router import api_router
from app.config import settings

@asynccontextmanager
async def lifespan(app: FastAPI):
    yield  # Startup/shutdown logic here

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api_router, prefix="/api/v1")
```

```python
# app/config.py
from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", case_sensitive=True)
    
    PROJECT_NAME: str = "FastAPI App"
    VERSION: str = "1.0.0"
    DEBUG: bool = False
    SECRET_KEY: str
    DATABASE_URL: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    ALLOWED_ORIGINS: list[str] = ["http://localhost:3000"]

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()
```

## Pydantic Schemas

```python
# app/schemas/user.py
from datetime import datetime
from pydantic import BaseModel, EmailStr, Field, ConfigDict

# Separate schemas for different operations
class UserBase(BaseModel):
    email: EmailStr
    full_name: str = Field(..., min_length=1, max_length=100)

class UserCreate(UserBase):
    password: str = Field(..., min_length=8)

class UserUpdate(BaseModel):
    email: EmailStr | None = None
    full_name: str | None = Field(None, min_length=1, max_length=100)
    password: str | None = Field(None, min_length=8)

class UserResponse(UserBase):
    model_config = ConfigDict(from_attributes=True)
    id: int
    is_active: bool
    created_at: datetime
```

### Field Validation

```python
from pydantic import field_validator, model_validator

class ItemCreate(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    price: float = Field(..., gt=0)
    quantity: int = Field(default=0, ge=0)
    
    @field_validator("name")
    @classmethod
    def validate_name(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Name cannot be empty")
        return v.strip()
    
    @model_validator(mode="after")
    def check_inventory(self) -> "ItemCreate":
        if self.price > 1000 and self.quantity > 100:
            raise ValueError("High-value items: quantity <= 100")
        return self
```

## API Endpoints

```python
# app/api/v1/endpoints/users.py
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_user, get_db
from app.schemas.user import UserCreate, UserResponse, UserUpdate
from app.services.user_service import UserService

router = APIRouter()

@router.get("", response_model=list[UserResponse])
async def list_users(
    db: AsyncSession = Depends(get_db),
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
) -> list[UserResponse]:
    service = UserService(db)
    return await service.list_users(page=page, page_size=page_size)

@router.get("/{user_id}", response_model=UserResponse)
async def get_user(user_id: int, db: AsyncSession = Depends(get_db)) -> UserResponse:
    service = UserService(db)
    user = await service.get_user(user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

@router.post("", response_model=UserResponse, status_code=201)
async def create_user(
    user_in: UserCreate, db: AsyncSession = Depends(get_db)
) -> UserResponse:
    service = UserService(db)
    if await service.get_user_by_email(user_in.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return await service.create_user(user_in)

@router.patch("/{user_id}", response_model=UserResponse)
async def update_user(
    user_id: int,
    user_in: UserUpdate,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user),
) -> UserResponse:
    if current_user.id != user_id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    service = UserService(db)
    return await service.update_user(user_id, user_in)

@router.delete("/{user_id}", status_code=204)
async def delete_user(
    user_id: int,
    db: AsyncSession = Depends(get_db),
    current_user = Depends(get_current_user),
) -> None:
    if current_user.id != user_id and not current_user.is_admin:
        raise HTTPException(status_code=403, detail="Not authorized")
    await UserService(db).delete_user(user_id)
```

## Dependency Injection

```python
# app/api/deps.py
from collections.abc import AsyncGenerator
from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from app.config import settings
from app.db.session import async_session_maker

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/v1/auth/login")

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_maker() as session:
        try:
            yield session
        finally:
            await session.close()

async def get_current_user(
    db: AsyncSession = Depends(get_db),
    token: str = Depends(oauth2_scheme),
):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception
    
    from app.services.user_service import UserService
    user = await UserService(db).get_user(int(user_id))
    if not user or not user.is_active:
        raise credentials_exception
    return user
```

### Reusable Dependencies

```python
from fastapi import Query

class PaginationParams:
    def __init__(
        self,
        page: int = Query(1, ge=1),
        page_size: int = Query(20, ge=1, le=100),
    ):
        self.page = page
        self.page_size = page_size
        self.offset = (page - 1) * page_size

# Usage
@router.get("/items")
async def list_items(pagination: PaginationParams = Depends()):
    return await get_items(offset=pagination.offset, limit=pagination.page_size)
```

## Error Handling

```python
# app/core/exceptions.py
from fastapi import HTTPException, status

class NotFoundError(HTTPException):
    def __init__(self, resource: str, identifier: str | int):
        super().__init__(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"{resource} with id '{identifier}' not found",
        )

class ConflictError(HTTPException):
    def __init__(self, detail: str):
        super().__init__(status_code=status.HTTP_409_CONFLICT, detail=detail)

# Global handler in main.py
@app.exception_handler(Exception)
async def generic_exception_handler(request, exc):
    return JSONResponse(status_code=500, content={"detail": "Internal server error"})
```

## Database Integration

```python
# app/db/session.py
from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from app.config import settings

engine = create_async_engine(settings.DATABASE_URL, pool_pre_ping=True)
async_session_maker = async_sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)
```

```python
# app/models/user.py
from datetime import datetime
from sqlalchemy import Boolean, DateTime, String, func
from sqlalchemy.orm import DeclarativeBase, Mapped, mapped_column

class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = "users"
    
    id: Mapped[int] = mapped_column(primary_key=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    full_name: Mapped[str] = mapped_column(String(100))
    hashed_password: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    is_admin: Mapped[bool] = mapped_column(Boolean, default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
```

## Authentication

```python
# app/core/security.py
from datetime import datetime, timedelta, timezone
from jose import jwt
from passlib.context import CryptContext
from app.config import settings

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def create_access_token(subject: str | int, expires_delta: timedelta | None = None) -> str:
    expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES))
    return jwt.encode({"sub": str(subject), "exp": expire}, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
```

```python
# app/api/v1/endpoints/auth.py
@router.post("/login", response_model=Token)
async def login(
    db: AsyncSession = Depends(get_db),
    form_data: OAuth2PasswordRequestForm = Depends(),
) -> Token:
    user = await UserService(db).get_user_by_email(form_data.username)
    if not user or not verify_password(form_data.password, user.hashed_password):
        raise HTTPException(status_code=401, detail="Incorrect email or password")
    if not user.is_active:
        raise HTTPException(status_code=403, detail="Inactive user")
    return Token(access_token=create_access_token(user.id), token_type="bearer")
```

## Testing

```python
# tests/conftest.py
import pytest
from httpx import ASGITransport, AsyncClient
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker
from app.main import app
from app.api.deps import get_db
from app.models.user import Base

test_engine = create_async_engine("sqlite+aiosqlite:///:memory:")
test_session_maker = async_sessionmaker(test_engine, class_=AsyncSession, expire_on_commit=False)

@pytest.fixture
async def db_session():
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    async with test_session_maker() as session:
        yield session
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)

@pytest.fixture
async def client(db_session):
    async def override_get_db():
        yield db_session
    app.dependency_overrides[get_db] = override_get_db
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac
    app.dependency_overrides.clear()
```

```python
# tests/test_api/test_users.py
@pytest.mark.asyncio
async def test_create_user(client: AsyncClient):
    response = await client.post("/api/v1/users", json={
        "email": "new@example.com",
        "full_name": "New User",
        "password": "securepass123",
    })
    assert response.status_code == 201
    assert response.json()["email"] == "new@example.com"
    assert "password" not in response.json()

@pytest.mark.asyncio
async def test_get_user_not_found(client: AsyncClient):
    response = await client.get("/api/v1/users/99999")
    assert response.status_code == 404
```

## Quick Reference

| Pattern | Use When |
|---------|----------|
| Separate schemas (Create/Update/Response) | Different fields for operations |
| Repository pattern | Complex data access |
| Service layer | Business logic separation |
| Background tasks | Non-blocking operations |
| Dependency injection | Reusable components |

## Additional Resources

- For advanced patterns (caching, streaming, rate limiting), see [advanced-patterns.md](advanced-patterns.md)
- For repository and service layer patterns, see [service-patterns.md](service-patterns.md)
