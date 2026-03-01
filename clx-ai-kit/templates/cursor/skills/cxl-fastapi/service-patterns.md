# FastAPI Service & Repository Patterns

## Repository Pattern

Separates data access logic from business logic.

```python
# app/db/repositories/base.py
from typing import Generic, TypeVar
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.base import Base

ModelType = TypeVar("ModelType", bound=Base)

class BaseRepository(Generic[ModelType]):
    """Base repository with common CRUD operations."""
    
    def __init__(self, session: AsyncSession, model: type[ModelType]):
        self.session = session
        self.model = model
    
    async def get_by_id(self, id: int) -> ModelType | None:
        result = await self.session.execute(
            select(self.model).where(self.model.id == id)
        )
        return result.scalar_one_or_none()
    
    async def list_all(
        self, offset: int = 0, limit: int = 20
    ) -> tuple[list[ModelType], int]:
        # Count
        count_result = await self.session.execute(
            select(func.count()).select_from(self.model)
        )
        total = count_result.scalar_one()
        
        # Results
        result = await self.session.execute(
            select(self.model).offset(offset).limit(limit).order_by(self.model.id)
        )
        items = list(result.scalars().all())
        
        return items, total
    
    async def create(self, obj: ModelType) -> ModelType:
        self.session.add(obj)
        await self.session.commit()
        await self.session.refresh(obj)
        return obj
    
    async def update(self, obj: ModelType) -> ModelType:
        await self.session.commit()
        await self.session.refresh(obj)
        return obj
    
    async def delete(self, obj: ModelType) -> None:
        await self.session.delete(obj)
        await self.session.commit()
```

```python
# app/db/repositories/user_repo.py
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.base import BaseRepository
from app.models.user import User

class UserRepository(BaseRepository[User]):
    """User-specific repository."""
    
    def __init__(self, session: AsyncSession):
        super().__init__(session, User)
    
    async def get_by_email(self, email: str) -> User | None:
        result = await self.session.execute(
            select(User).where(User.email == email)
        )
        return result.scalar_one_or_none()
    
    async def get_active_users(self) -> list[User]:
        result = await self.session.execute(
            select(User).where(User.is_active == True)
        )
        return list(result.scalars().all())
    
    async def search_by_name(self, query: str) -> list[User]:
        result = await self.session.execute(
            select(User).where(User.full_name.ilike(f"%{query}%"))
        )
        return list(result.scalars().all())
```

## Service Layer

Business logic and orchestration.

```python
# app/services/user_service.py
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password
from app.db.repositories.user_repo import UserRepository
from app.models.user import User
from app.schemas.common import PaginatedResponse
from app.schemas.user import UserCreate, UserResponse, UserUpdate

class UserService:
    """User business logic."""
    
    def __init__(self, db: AsyncSession):
        self.db = db
        self.repo = UserRepository(db)
    
    async def get_user(self, user_id: int) -> User | None:
        return await self.repo.get_by_id(user_id)
    
    async def get_user_by_email(self, email: str) -> User | None:
        return await self.repo.get_by_email(email)
    
    async def list_users(
        self, page: int = 1, page_size: int = 20
    ) -> PaginatedResponse[UserResponse]:
        offset = (page - 1) * page_size
        users, total = await self.repo.list_all(offset=offset, limit=page_size)
        
        return PaginatedResponse(
            items=[UserResponse.model_validate(u) for u in users],
            total=total,
            page=page,
            page_size=page_size,
            pages=(total + page_size - 1) // page_size,
        )
    
    async def create_user(self, user_data: UserCreate) -> User:
        user = User(
            email=user_data.email,
            full_name=user_data.full_name,
            hashed_password=hash_password(user_data.password),
        )
        return await self.repo.create(user)
    
    async def update_user(self, user_id: int, user_data: UserUpdate) -> User | None:
        user = await self.repo.get_by_id(user_id)
        if not user:
            return None
        
        update_dict = user_data.model_dump(exclude_unset=True)
        
        if "password" in update_dict:
            update_dict["hashed_password"] = hash_password(update_dict.pop("password"))
        
        for field, value in update_dict.items():
            setattr(user, field, value)
        
        return await self.repo.update(user)
    
    async def delete_user(self, user_id: int) -> bool:
        user = await self.repo.get_by_id(user_id)
        if not user:
            return False
        await self.repo.delete(user)
        return True
```

## Unit of Work Pattern

For complex transactions spanning multiple repositories.

```python
# app/db/unit_of_work.py
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.repositories.user_repo import UserRepository
from app.db.repositories.item_repo import ItemRepository

class UnitOfWork:
    """Coordinates operations across multiple repositories."""
    
    def __init__(self, session: AsyncSession):
        self.session = session
        self.users = UserRepository(session)
        self.items = ItemRepository(session)
    
    async def commit(self):
        await self.session.commit()
    
    async def rollback(self):
        await self.session.rollback()
    
    async def __aenter__(self):
        return self
    
    async def __aexit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            await self.rollback()
        await self.session.close()

# Usage
async def transfer_item(db: AsyncSession, item_id: int, from_user: int, to_user: int):
    async with UnitOfWork(db) as uow:
        item = await uow.items.get_by_id(item_id)
        
        if item.owner_id != from_user:
            raise ValueError("Not owner")
        
        item.owner_id = to_user
        await uow.commit()
```

## Service with Dependency Injection

```python
# app/services/email_service.py
from abc import ABC, abstractmethod

class EmailServiceProtocol(ABC):
    @abstractmethod
    async def send(self, to: str, subject: str, body: str) -> bool:
        pass

class SMTPEmailService(EmailServiceProtocol):
    def __init__(self, smtp_host: str, smtp_port: int):
        self.smtp_host = smtp_host
        self.smtp_port = smtp_port
    
    async def send(self, to: str, subject: str, body: str) -> bool:
        # SMTP implementation
        return True

class MockEmailService(EmailServiceProtocol):
    """For testing."""
    
    def __init__(self):
        self.sent_emails: list[dict] = []
    
    async def send(self, to: str, subject: str, body: str) -> bool:
        self.sent_emails.append({"to": to, "subject": subject, "body": body})
        return True
```

```python
# app/dependencies.py
from functools import lru_cache
from app.config import settings
from app.services.email_service import EmailServiceProtocol, SMTPEmailService, MockEmailService

@lru_cache
def get_email_service() -> EmailServiceProtocol:
    if settings.DEBUG:
        return MockEmailService()
    return SMTPEmailService(settings.SMTP_HOST, settings.SMTP_PORT)
```

## Domain Events Pattern

```python
# app/events.py
from dataclasses import dataclass
from datetime import datetime
from typing import Callable, Any
from collections import defaultdict

@dataclass
class UserCreatedEvent:
    user_id: int
    email: str
    timestamp: datetime

@dataclass
class UserDeletedEvent:
    user_id: int
    timestamp: datetime

class EventBus:
    """Simple in-process event bus."""
    
    def __init__(self):
        self._handlers: dict[type, list[Callable]] = defaultdict(list)
    
    def subscribe(self, event_type: type, handler: Callable):
        self._handlers[event_type].append(handler)
    
    async def publish(self, event: Any):
        for handler in self._handlers[type(event)]:
            await handler(event)

event_bus = EventBus()

# Register handlers
async def send_welcome_email(event: UserCreatedEvent):
    # Send email logic
    pass

async def cleanup_user_data(event: UserDeletedEvent):
    # Cleanup logic
    pass

event_bus.subscribe(UserCreatedEvent, send_welcome_email)
event_bus.subscribe(UserDeletedEvent, cleanup_user_data)

# Usage in service
class UserService:
    async def create_user(self, user_data: UserCreate) -> User:
        user = await self.repo.create(...)
        await event_bus.publish(UserCreatedEvent(
            user_id=user.id,
            email=user.email,
            timestamp=datetime.utcnow(),
        ))
        return user
```

## Caching Service

```python
# app/services/cache_service.py
from typing import TypeVar, Callable, Any
from functools import wraps
import json
from redis import asyncio as aioredis

T = TypeVar("T")

class CacheService:
    def __init__(self, redis_url: str):
        self.redis = aioredis.from_url(redis_url)
    
    async def get(self, key: str) -> str | None:
        return await self.redis.get(key)
    
    async def set(self, key: str, value: str, expire: int = 300):
        await self.redis.set(key, value, ex=expire)
    
    async def delete(self, key: str):
        await self.redis.delete(key)
    
    async def close(self):
        await self.redis.close()

def cached(key_prefix: str, expire: int = 300):
    """Decorator for caching service method results."""
    
    def decorator(func: Callable) -> Callable:
        @wraps(func)
        async def wrapper(self, *args, **kwargs):
            cache_key = f"{key_prefix}:{':'.join(str(a) for a in args)}"
            
            # Try cache first
            if hasattr(self, "cache") and self.cache:
                cached_value = await self.cache.get(cache_key)
                if cached_value:
                    return json.loads(cached_value)
            
            # Execute function
            result = await func(self, *args, **kwargs)
            
            # Store in cache
            if hasattr(self, "cache") and self.cache:
                await self.cache.set(cache_key, json.dumps(result), expire)
            
            return result
        return wrapper
    return decorator
```

## Service Composition

```python
# app/services/order_service.py
class OrderService:
    """Orchestrates multiple services for order operations."""
    
    def __init__(
        self,
        db: AsyncSession,
        email_service: EmailServiceProtocol,
        payment_service: PaymentServiceProtocol,
    ):
        self.db = db
        self.user_repo = UserRepository(db)
        self.order_repo = OrderRepository(db)
        self.email_service = email_service
        self.payment_service = payment_service
    
    async def create_order(self, user_id: int, items: list[OrderItem]) -> Order:
        user = await self.user_repo.get_by_id(user_id)
        if not user:
            raise NotFoundError("User", user_id)
        
        # Calculate total
        total = sum(item.price * item.quantity for item in items)
        
        # Process payment
        payment_result = await self.payment_service.charge(user_id, total)
        if not payment_result.success:
            raise PaymentError(payment_result.error)
        
        # Create order
        order = Order(user_id=user_id, total=total, items=items)
        order = await self.order_repo.create(order)
        
        # Send confirmation
        await self.email_service.send(
            to=user.email,
            subject="Order Confirmation",
            body=f"Your order #{order.id} has been placed.",
        )
        
        return order
```
