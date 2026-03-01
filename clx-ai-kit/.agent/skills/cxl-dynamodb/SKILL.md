---
name: cxl-dynamodb
description: AWS DynamoDB patterns for single-table design, data modeling, query optimization, and cost efficiency. Use when designing DynamoDB tables, writing queries, optimizing access patterns, or implementing NoSQL data models.
---

# DynamoDB Patterns

Quick reference for DynamoDB best practices focusing on single-table design, cost optimization, and production patterns.

## When to Activate

- Designing DynamoDB table schemas
- Implementing access patterns for NoSQL
- Writing efficient queries with boto3/SDK
- Optimizing partition key design
- Setting up Global/Local Secondary Indexes
- Troubleshooting hot partitions or throttling

## Core Concepts

### Single-Table Design Philosophy

DynamoDB is optimized for **known access patterns**. Design your table around queries, not entities.

```
┌─────────────────────────────────────────────────────────┐
│ PK (Partition Key)    │ SK (Sort Key)      │ Data...   │
├───────────────────────┼────────────────────┼───────────┤
│ USER#123              │ PROFILE            │ name, ... │
│ USER#123              │ ORDER#2024-01-15   │ total,... │
│ USER#123              │ ORDER#2024-02-20   │ total,... │
│ ORDER#456             │ METADATA           │ status,...│
│ ORDER#456             │ ITEM#1             │ product...│
│ ORDER#456             │ ITEM#2             │ product...│
└───────────────────────┴────────────────────┴───────────┘
```

**Key Insight**: Prefix-based keys (`USER#`, `ORDER#`) enable multiple entity types in one table.

## Quick Reference

### Key Design Patterns

| Access Pattern | PK | SK | Notes |
|---------------|----|----|-------|
| Get user profile | `USER#{id}` | `PROFILE` | Direct lookup |
| Get user's orders | `USER#{id}` | `begins_with(ORDER#)` | Query by prefix |
| Get order details | `ORDER#{id}` | `begins_with` | All order items |
| Get by date range | `USER#{id}` | `ORDER#{date}` | SK for time-series |
| Many-to-many | `GROUP#{id}` | `MEMBER#{user_id}` | Both directions via GSI |

### Capacity Mode Decision

| Scenario | Mode | Why |
|----------|------|-----|
| Unknown traffic | On-Demand | No throttling, pay per request |
| Predictable load | Provisioned | 5x cheaper at steady state |
| Spiky traffic | Provisioned + Auto Scaling | Balance cost and burst |
| Dev/Test | On-Demand | Free tier eligible, no waste |

### Index Cheat Sheet

| Index Type | When to Use | Limits |
|------------|-------------|--------|
| **LSI** (Local) | Same PK, different sort | 5 per table, must create at table creation |
| **GSI** (Global) | Different PK entirely | 20 per table, eventual consistency only |

```python
# GSI for inverted access pattern
# Table: PK=USER#123, SK=ORDER#456
# GSI: PK=ORDER#456, SK=USER#123 (flip for "get all users for order")
```

## Data Modeling Patterns

### 1. One-to-Many (Hierarchical)

```python
# Parent entity
{"pk": "USER#123", "sk": "PROFILE", "name": "John", "email": "..."}

# Child entities (orders)
{"pk": "USER#123", "sk": "ORDER#2024-01-15#abc", "total": 99.99}
{"pk": "USER#123", "sk": "ORDER#2024-02-20#def", "total": 149.99}

# Query: Get user with all orders
response = table.query(
    KeyConditionExpression=Key('pk').eq('USER#123')
)
```

### 2. Many-to-Many (Adjacency List)

```python
# User belongs to groups (forward lookup)
{"pk": "USER#123", "sk": "GROUP#eng-team", "role": "member"}
{"pk": "USER#123", "sk": "GROUP#devops", "role": "admin"}

# Group has members (inverted via GSI on sk)
# GSI: pk=sk, sk=pk
{"pk": "GROUP#eng-team", "sk": "USER#123", "role": "member"}
{"pk": "GROUP#eng-team", "sk": "USER#456", "role": "owner"}
```

### 3. Time-Series with TTL

```python
# Auto-delete old data
{
    "pk": "SENSOR#temp-01",
    "sk": "2024-01-15T10:30:00Z",
    "value": 23.5,
    "expires_at": 1705312200  # Unix timestamp for TTL
}
```

## Query Patterns

### Efficient Queries (Always Use)

```python
from boto3.dynamodb.conditions import Key, Attr

# Direct lookup - O(1)
table.get_item(Key={"pk": "USER#123", "sk": "PROFILE"})

# Query by prefix - O(log n)
table.query(
    KeyConditionExpression=Key('pk').eq('USER#123') & Key('sk').begins_with('ORDER#')
)

# Query with date range
table.query(
    KeyConditionExpression=Key('pk').eq('USER#123') 
        & Key('sk').between('ORDER#2024-01', 'ORDER#2024-12')
)

# Query in reverse order (newest first)
table.query(
    KeyConditionExpression=Key('pk').eq('USER#123'),
    ScanIndexForward=False,
    Limit=10
)
```

### Avoid Full Table Scans

```python
# BAD: Scan with filter (reads entire table)
table.scan(FilterExpression=Attr('status').eq('active'))

# GOOD: Create GSI on status, then query
table.query(
    IndexName='status-index',
    KeyConditionExpression=Key('status').eq('active')
)
```

### Pagination Pattern

```python
def paginate_query(table, pk, page_size=25, last_key=None):
    params = {
        'KeyConditionExpression': Key('pk').eq(pk),
        'Limit': page_size
    }
    if last_key:
        params['ExclusiveStartKey'] = last_key
    
    response = table.query(**params)
    return {
        'items': response['Items'],
        'next_key': response.get('LastEvaluatedKey')
    }
```

### Batch Operations

```python
# Batch write (up to 25 items, 16MB)
with table.batch_writer() as batch:
    for item in items:
        batch.put_item(Item=item)

# Batch get (up to 100 items, 16MB)
response = dynamodb.batch_get_item(
    RequestItems={
        'table-name': {
            'Keys': [{'pk': 'USER#1', 'sk': 'PROFILE'}, ...]
        }
    }
)
```

## Write Patterns

### Conditional Writes (Optimistic Locking)

```python
# Only update if item exists and version matches
table.update_item(
    Key={'pk': 'USER#123', 'sk': 'PROFILE'},
    UpdateExpression='SET balance = balance - :amount, version = version + :inc',
    ConditionExpression='attribute_exists(pk) AND version = :expected',
    ExpressionAttributeValues={
        ':amount': 50,
        ':inc': 1,
        ':expected': 5
    }
)
```

### Atomic Counters

```python
# Increment without read
table.update_item(
    Key={'pk': 'STATS#page-views', 'sk': 'COUNTER'},
    UpdateExpression='ADD view_count :inc',
    ExpressionAttributeValues={':inc': 1}
)
```

### Write Sharding for Hot Partitions

```python
import random

# Distribute writes across shards
def write_hot_key(table, base_pk, data):
    shard = random.randint(0, 9)  # 10 shards
    table.put_item(Item={
        'pk': f'{base_pk}#SHARD#{shard}',
        'sk': data['sk'],
        **data
    })

# Read: Scatter-gather across all shards
def read_hot_key(table, base_pk):
    items = []
    for shard in range(10):
        response = table.query(
            KeyConditionExpression=Key('pk').eq(f'{base_pk}#SHARD#{shard}')
        )
        items.extend(response['Items'])
    return items
```

## Cost Optimization

### Pricing Quick Facts

| Operation | On-Demand | Provisioned |
|-----------|-----------|-------------|
| Write (1KB) | $1.25/million | $0.25/million (at capacity) |
| Read (4KB) | $0.25/million | $0.05/million (at capacity) |
| Storage | $0.25/GB/month | $0.25/GB/month |

### Cost Reduction Strategies

1. **Use TTL** - Auto-delete old data (free)
2. **Compress large attributes** - Store gzipped JSON
3. **Sparse indexes** - Only project needed attributes
4. **Eventually consistent reads** - 50% cheaper than strongly consistent
5. **Reserved capacity** - Up to 76% savings for predictable workloads

```python
# Eventually consistent (default, cheaper)
table.query(KeyConditionExpression=Key('pk').eq('USER#123'))

# Strongly consistent (2x cost)
table.query(
    KeyConditionExpression=Key('pk').eq('USER#123'),
    ConsistentRead=True
)
```

### Attribute Projection (Reduce read costs)

```python
# Only read needed attributes
table.query(
    KeyConditionExpression=Key('pk').eq('USER#123'),
    ProjectionExpression='#n, email',
    ExpressionAttributeNames={'#n': 'name'}  # 'name' is reserved word
)
```

## Terraform Patterns

### Production-Ready Table

```hcl
resource "aws_dynamodb_table" "main" {
  name         = "${var.project}-${var.env}-data"
  billing_mode = var.env == "prod" ? "PROVISIONED" : "PAY_PER_REQUEST"
  hash_key     = "pk"
  range_key    = "sk"

  # Provisioned capacity (prod only)
  dynamic "read_capacity" {
    for_each = var.env == "prod" ? [1] : []
    content { ... }
  }

  attribute {
    name = "pk"
    type = "S"
  }

  attribute {
    name = "sk"
    type = "S"
  }

  # GSI for inverted access
  attribute {
    name = "gsi1pk"
    type = "S"
  }

  global_secondary_index {
    name            = "gsi1"
    hash_key        = "gsi1pk"
    range_key       = "sk"
    projection_type = "ALL"
  }

  ttl {
    attribute_name = "expires_at"
    enabled        = true
  }

  point_in_time_recovery {
    enabled = var.env == "prod"
  }

  server_side_encryption {
    enabled     = true
    kms_key_arn = var.env == "prod" ? aws_kms_key.dynamodb.arn : null
  }

  tags = var.tags
}
```

### Auto Scaling (Provisioned Mode)

```hcl
resource "aws_appautoscaling_target" "read" {
  max_capacity       = 100
  min_capacity       = 5
  resource_id        = "table/${aws_dynamodb_table.main.name}"
  scalable_dimension = "dynamodb:table:ReadCapacityUnits"
  service_namespace  = "dynamodb"
}

resource "aws_appautoscaling_policy" "read" {
  name               = "DynamoDBReadAutoScaling"
  policy_type        = "TargetTrackingScaling"
  resource_id        = aws_appautoscaling_target.read.resource_id
  scalable_dimension = aws_appautoscaling_target.read.scalable_dimension
  service_namespace  = aws_appautoscaling_target.read.service_namespace

  target_tracking_scaling_policy_configuration {
    predefined_metric_specification {
      predefined_metric_type = "DynamoDBReadCapacityUtilization"
    }
    target_value = 70.0
  }
}
```

## Security Patterns

### IAM Policy (Least Privilege)

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:PutItem",
        "dynamodb:UpdateItem",
        "dynamodb:DeleteItem"
      ],
      "Resource": [
        "arn:aws:dynamodb:*:*:table/myapp-*",
        "arn:aws:dynamodb:*:*:table/myapp-*/index/*"
      ],
      "Condition": {
        "ForAllValues:StringEquals": {
          "dynamodb:LeadingKeys": ["USER#${aws:userid}"]
        }
      }
    }
  ]
}
```

### VPC Endpoint (No Internet Egress)

```hcl
resource "aws_vpc_endpoint" "dynamodb" {
  vpc_id            = aws_vpc.main.id
  service_name      = "com.amazonaws.${var.region}.dynamodb"
  vpc_endpoint_type = "Gateway"
  route_table_ids   = [aws_route_table.private.id]
}
```

## Anti-Patterns to Avoid

| Anti-Pattern | Problem | Solution |
|-------------|---------|----------|
| Scan with filters | Reads entire table | Create GSI, use Query |
| Large items (>400KB) | Throttling, cost | Store in S3, reference key |
| Hot partition | Throttling | Write sharding |
| Over-fetching | Wasted RCU | ProjectionExpression |
| Sequential UUID | Poor distribution | Use KSUID or prefix |
| No TTL | Storage bloat | Enable TTL on ephemeral data |

## Monitoring Checklist

```
- [ ] CloudWatch alarm: ConsumedReadCapacityUnits > 80%
- [ ] CloudWatch alarm: ConsumedWriteCapacityUnits > 80%
- [ ] CloudWatch alarm: ThrottledRequests > 0
- [ ] CloudWatch alarm: SystemErrors > 0
- [ ] Enable Contributor Insights (identify hot keys)
- [ ] Set up X-Ray tracing for latency analysis
```

## Related

- Skill: `aws-architecture` - Overall AWS design patterns
- Skill: `terraform` - Infrastructure as Code patterns
- Skill: `postgres-patterns` - When to use SQL instead
