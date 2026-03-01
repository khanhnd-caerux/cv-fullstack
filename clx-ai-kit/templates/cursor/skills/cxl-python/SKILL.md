---
name: cxl-python
description: Python coding standards, best practices, patterns, and conventions. Use when writing Python code, creating Python scripts, implementing Python APIs, working with Python libraries, or reviewing Python code.
---

# Python Coding Standards & Best Practices

Comprehensive Python development guidelines covering code quality, type hints, error handling, testing, and project structure.

## Code Quality Principles

### 1. PEP 8 Compliance
- Follow PEP 8 style guide
- Use 4 spaces for indentation (never tabs)
- Maximum line length: 88-100 characters (Black default: 88)
- Use descriptive names: `user_email` not `ue`, `process_payment` not `pp`

### 2. Readability First
- Code is read more than written
- Clear variable and function names
- Self-documenting code preferred over comments
- Consistent formatting with Black or similar

### 3. Pythonic Patterns
- Prefer list comprehensions over loops when readable
- Use context managers (`with` statements)
- Leverage built-in functions and standard library
- Follow "There should be one obvious way to do it"

## Type Hints (PEP 484)

### Function Signatures

```python
# ✅ GOOD: Type hints for parameters and return
from typing import List, Dict, Optional, Union

def process_emails(
    emails: List[Dict[str, str]],
    max_count: int = 100
) -> Dict[str, int]:
    """Process a list of emails and return statistics."""
    return {"processed": len(emails), "failed": 0}

# ✅ GOOD: Optional and Union types
def get_user(user_id: Optional[int] = None) -> Optional[Dict[str, str]]:
    if user_id is None:
        return None
    return {"id": user_id, "name": "User"}

# ✅ GOOD: Generic types for collections
from typing import TypeVar, Generic

T = TypeVar('T')

class Queue(Generic[T]):
    def push(self, item: T) -> None:
        pass
    
    def pop(self) -> T:
        pass

# ❌ BAD: No type hints
def process_emails(emails, max_count=100):
    return {"processed": len(emails)}
```

### Modern Type Hints (Python 3.9+)

```python
# ✅ GOOD: Use built-in types (Python 3.9+)
def process_data(items: list[str], config: dict[str, int]) -> tuple[bool, str]:
    pass

# For Python < 3.9, use typing module
from typing import List, Dict, Tuple
def process_data(items: List[str], config: Dict[str, int]) -> Tuple[bool, str]:
    pass
```

## Variable Naming

```python
# ✅ GOOD: Descriptive, snake_case
user_email = "user@example.com"
is_authenticated = True
total_revenue = 1000.50
email_list = []

# ❌ BAD: Unclear names
ue = "user@example.com"
flag = True
x = 1000.50
lst = []
```

## Function Naming

```python
# ✅ GOOD: Verb-noun pattern, descriptive
def fetch_user_data(user_id: int) -> Dict[str, str]:
    """Fetch user data from database."""
    pass

def calculate_total_price(items: List[Dict]) -> float:
    """Calculate total price for items."""
    pass

def is_valid_email(email: str) -> bool:
    """Check if email format is valid."""
    pass

# ❌ BAD: Unclear or noun-only
def user(id: int):
    pass

def total(items):
    pass

def email(e):
    pass
```

## Error Handling

### Exception Handling Best Practices

```python
# ✅ GOOD: Specific exceptions, clear messages
import logging

logger = logging.getLogger(__name__)

def process_payment(amount: float, user_id: int) -> bool:
    try:
        if amount <= 0:
            raise ValueError(f"Invalid amount: {amount}. Must be positive.")
        
        # Process payment
        result = payment_gateway.charge(amount, user_id)
        return result.success
        
    except PaymentGatewayError as e:
        logger.error(f"Payment gateway error for user {user_id}: {e}")
        raise PaymentError(f"Failed to process payment: {e}") from e
        
    except ValueError as e:
        logger.warning(f"Invalid input: {e}")
        raise
        
    except Exception as e:
        logger.exception(f"Unexpected error processing payment: {e}")
        raise PaymentError("Unexpected payment error") from e

# ❌ BAD: Bare except, swallowing errors
def process_payment(amount, user_id):
    try:
        payment_gateway.charge(amount, user_id)
        return True
    except:
        return False  # Hides the actual error
```

### Custom Exceptions

```python
# ✅ GOOD: Domain-specific exceptions
class PaymentError(Exception):
    """Base exception for payment-related errors."""
    pass

class InsufficientFundsError(PaymentError):
    """Raised when account has insufficient funds."""
    pass

class PaymentGatewayError(PaymentError):
    """Raised when payment gateway fails."""
    pass

# Usage
if balance < amount:
    raise InsufficientFundsError(f"Balance {balance} < amount {amount}")
```

## Context Managers

```python
# ✅ GOOD: Use context managers for resources
with open('data.json', 'r') as f:
    data = json.load(f)

# ✅ GOOD: Custom context managers
from contextlib import contextmanager

@contextmanager
def database_transaction(db):
    """Context manager for database transactions."""
    try:
        db.begin()
        yield db
        db.commit()
    except Exception:
        db.rollback()
        raise

# Usage
with database_transaction(db) as transaction:
    transaction.execute("INSERT INTO users ...")
```

## List Comprehensions & Generator Expressions

```python
# ✅ GOOD: List comprehension when readable
emails = [user.email for user in users if user.is_active]

# ✅ GOOD: Generator expression for large datasets
total = sum(item.price for item in items if item.is_available)

# ✅ GOOD: Dictionary comprehension
user_map = {user.id: user.name for user in users}

# ❌ BAD: Unnecessary loop
emails = []
for user in users:
    if user.is_active:
        emails.append(user.email)
```

## Async/Await Patterns

```python
# ✅ GOOD: Async functions with proper typing
import asyncio
from typing import List

async def fetch_user_data(user_id: int) -> Dict[str, str]:
    """Fetch user data asynchronously."""
    async with aiohttp.ClientSession() as session:
        async with session.get(f'/api/users/{user_id}') as response:
            return await response.json()

# ✅ GOOD: Parallel execution
async def fetch_multiple_users(user_ids: List[int]) -> List[Dict]:
    tasks = [fetch_user_data(uid) for uid in user_ids]
    return await asyncio.gather(*tasks)

# ✅ GOOD: Error handling in async
async def safe_fetch(url: str) -> Optional[Dict]:
    try:
        async with aiohttp.ClientSession() as session:
            async with session.get(url) as response:
                response.raise_for_status()
                return await response.json()
    except aiohttp.ClientError as e:
        logger.error(f"Request failed: {e}")
        return None
```

## Project Structure

### Standard Layout

```
project/
├── src/                    # Source code
│   ├── __init__.py
│   ├── main.py            # Entry point
│   ├── api/               # API routes
│   │   ├── __init__.py
│   │   └── routes.py
│   ├── models/            # Data models
│   │   ├── __init__.py
│   │   └── user.py
│   ├── services/          # Business logic
│   │   ├── __init__.py
│   │   └── email_service.py
│   └── utils/             # Utilities
│       ├── __init__.py
│       └── validators.py
├── tests/                  # Tests
│   ├── __init__.py
│   ├── test_api.py
│   └── test_services.py
├── scripts/                # Utility scripts
│   └── setup_db.py
├── requirements.txt        # Dependencies
├── requirements-dev.txt    # Dev dependencies
├── pyproject.toml          # Project config (PEP 518)
├── .python-version         # Python version (if using pyenv)
└── README.md
```

### Module Organization

```python
# ✅ GOOD: Clear module structure
# src/services/email_service.py

"""Email service for sending and processing emails."""

from typing import List, Optional
import logging

logger = logging.getLogger(__name__)

class EmailService:
    """Service for handling email operations."""
    
    def __init__(self, smtp_server: str):
        self.smtp_server = smtp_server
    
    def send_email(self, to: str, subject: str, body: str) -> bool:
        """Send an email."""
        # Implementation
        pass

# ✅ GOOD: __init__.py exports
# src/services/__init__.py
from .email_service import EmailService

__all__ = ['EmailService']
```

## Testing Standards

### Test Structure (AAA Pattern)

```python
import pytest
from unittest.mock import Mock, patch

# ✅ GOOD: Arrange-Act-Assert pattern
def test_calculate_total_price():
    # Arrange
    items = [
        {"name": "Item 1", "price": 10.0},
        {"name": "Item 2", "price": 20.0}
    ]
    
    # Act
    total = calculate_total_price(items)
    
    # Assert
    assert total == 30.0

# ✅ GOOD: Descriptive test names
def test_returns_empty_list_when_no_users_match_query():
    pass

def test_raises_value_error_when_amount_is_negative():
    pass

def test_falls_back_to_cache_when_database_unavailable():
    pass
```

### Fixtures and Mocks

```python
import pytest
from unittest.mock import Mock, patch

@pytest.fixture
def sample_user():
    """Fixture providing a sample user."""
    return {
        "id": 1,
        "email": "test@example.com",
        "name": "Test User"
    }

def test_fetch_user_with_mock(sample_user):
    """Test with mocked external dependency."""
    with patch('services.user_service.fetch_from_db') as mock_fetch:
        mock_fetch.return_value = sample_user
        
        result = get_user(1)
        
        assert result == sample_user
        mock_fetch.assert_called_once_with(1)
```

### Async Testing

```python
import pytest

@pytest.mark.asyncio
async def test_fetch_user_data():
    """Test async function."""
    with patch('aiohttp.ClientSession') as mock_session:
        mock_response = Mock()
        mock_response.json = Mock(return_value={"id": 1, "name": "User"})
        mock_session.return_value.__aenter__.return_value.get.return_value.__aenter__.return_value = mock_response
        
        result = await fetch_user_data(1)
        
        assert result["id"] == 1
```

## Code Smell Detection

### 1. Long Functions

```python
# ❌ BAD: Function > 50 lines
def process_email():
    # 100 lines of code
    pass

# ✅ GOOD: Split into smaller functions
def process_email(email_data: Dict) -> Dict:
    validated = validate_email(email_data)
    parsed = parse_email_content(validated)
    return store_email(parsed)
```

### 2. Deep Nesting

```python
# ❌ BAD: 5+ levels of nesting
if user:
    if user.is_admin:
        if email:
            if email.is_valid:
                if has_permission:
                    process_email()

# ✅ GOOD: Early returns
if not user:
    return
if not user.is_admin:
    return
if not email or not email.is_valid:
    return
if not has_permission:
    return

process_email()
```

### 3. Magic Numbers

```python
# ❌ BAD: Unexplained numbers
if retry_count > 3:
    raise MaxRetriesExceeded()
time.sleep(500)

# ✅ GOOD: Named constants
MAX_RETRIES = 3
RETRY_DELAY_SECONDS = 500

if retry_count > MAX_RETRIES:
    raise MaxRetriesExceeded()
time.sleep(RETRY_DELAY_SECONDS)
```

## Common Patterns

### Dataclasses (Python 3.7+)

```python
from dataclasses import dataclass, field
from typing import List
from datetime import datetime

# ✅ GOOD: Use dataclasses for data containers
@dataclass
class Email:
    """Email data model."""
    id: int
    sender: str
    recipient: str
    subject: str
    body: str
    received_at: datetime = field(default_factory=datetime.utcnow)
    attachments: List[str] = field(default_factory=list)
    
    def is_recent(self) -> bool:
        """Check if email was received in last 24 hours."""
        delta = datetime.utcnow() - self.received_at
        return delta.total_seconds() < 86400
```

### Enums

```python
from enum import Enum, auto

# ✅ GOOD: Use enums for constants
class EmailStatus(Enum):
    """Email processing status."""
    PENDING = auto()
    PROCESSING = auto()
    COMPLETED = auto()
    FAILED = auto()

# Usage
if email.status == EmailStatus.PENDING:
    process_email(email)
```

### Path Handling

```python
from pathlib import Path

# ✅ GOOD: Use pathlib instead of os.path
data_dir = Path(__file__).parent / "data"
config_file = data_dir / "config.json"

if config_file.exists():
    with config_file.open() as f:
        config = json.load(f)

# ❌ BAD: os.path string manipulation
import os
data_dir = os.path.join(os.path.dirname(__file__), "data")
config_file = os.path.join(data_dir, "config.json")
```

## Documentation

### Docstrings (PEP 257)

```python
# ✅ GOOD: Google-style docstrings
def process_email(email_data: Dict[str, str]) -> Dict[str, Any]:
    """
    Process incoming email and store metadata.
    
    Args:
        email_data: Dictionary containing email fields:
            - sender: Email sender address
            - recipient: Email recipient address
            - subject: Email subject line
            - body: Email body content
    
    Returns:
        Dictionary with processing results:
            - success: Boolean indicating success
            - message_id: Unique message identifier
            - stored_at: Timestamp of storage
    
    Raises:
        ValueError: If required fields are missing
        StorageError: If storage operation fails
    
    Example:
        >>> email_data = {
        ...     "sender": "user@example.com",
        ...     "recipient": "admin@example.com",
        ...     "subject": "Test",
        ...     "body": "Hello"
        ... }
        >>> result = process_email(email_data)
        >>> result["success"]
        True
    """
    pass
```

### Type Annotations in Docstrings (Alternative)

```python
# ✅ GOOD: Type hints preferred, but docstrings can supplement
def process_email(email_data: Dict[str, str]) -> Dict[str, Any]:
    """
    Process incoming email and store metadata.
    
    See type hints for parameter and return types.
    """
    pass
```

## Performance Best Practices

### Generator Functions

```python
# ✅ GOOD: Use generators for large datasets
def read_large_file(filepath: Path) -> Generator[str, None, None]:
    """Read file line by line without loading entire file."""
    with filepath.open() as f:
        for line in f:
            yield line.strip()

# Usage
for line in read_large_file(Path("large_file.txt")):
    process_line(line)
```

### Caching

```python
from functools import lru_cache

# ✅ GOOD: Cache expensive computations
@lru_cache(maxsize=128)
def expensive_computation(n: int) -> int:
    """Compute expensive operation with caching."""
    # Expensive operation
    return result

# ✅ GOOD: Custom cache with TTL
from functools import wraps
from time import time

def cache_with_ttl(ttl_seconds: int):
    """Decorator for caching with time-to-live."""
    cache = {}
    
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            key = str(args) + str(kwargs)
            if key in cache:
                result, timestamp = cache[key]
                if time() - timestamp < ttl_seconds:
                    return result
            
            result = func(*args, **kwargs)
            cache[key] = (result, time())
            return result
        return wrapper
    return decorator
```

## Dependency Management

### requirements.txt

```txt
# ✅ GOOD: Pin versions for production
requests==2.31.0
boto3==1.28.0
pydantic==2.4.0

# ✅ GOOD: Use ranges for flexibility in dev
pytest>=7.4.0,<8.0.0
black>=23.0.0,<24.0.0
```

### pyproject.toml (Modern)

```toml
[project]
name = "my-project"
version = "1.0.0"
requires-python = ">=3.9"
dependencies = [
    "requests>=2.31.0",
    "boto3>=1.28.0",
]

[project.optional-dependencies]
dev = [
    "pytest>=7.4.0",
    "black>=23.0.0",
    "mypy>=1.5.0",
]

[tool.black]
line-length = 88
target-version = ['py39']

[tool.mypy]
python_version = "3.9"
warn_return_any = true
warn_unused_configs = true
```

## Security Best Practices

```python
# ✅ GOOD: Use secrets module for sensitive data
import secrets

def generate_api_key() -> str:
    """Generate cryptographically secure API key."""
    return secrets.token_urlsafe(32)

# ✅ GOOD: Validate and sanitize input
import re
from typing import Optional

def validate_email(email: str) -> bool:
    """Validate email format."""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

# ✅ GOOD: Use parameterized queries (SQL)
import psycopg2

def get_user(user_id: int) -> Optional[Dict]:
    """Get user by ID using parameterized query."""
    with psycopg2.connect(DATABASE_URL) as conn:
        with conn.cursor() as cur:
            cur.execute("SELECT * FROM users WHERE id = %s", (user_id,))
            return cur.fetchone()
```

## Code Quality Tools

### Recommended Tools

```bash
# Formatting
black src/ tests/

# Linting
ruff check src/ tests/
# or
flake8 src/ tests/

# Type checking
mypy src/

# Testing
pytest tests/ --cov=src --cov-report=html
```

**Remember**: Write clear, maintainable Python code. Follow PEP 8, use type hints, handle errors properly, and write tests. Pythonic code is readable code.
