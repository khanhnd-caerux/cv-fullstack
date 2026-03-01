---
name: cxl-aws-architecture
description: Guide for designing AWS architectures with focus on pricing optimization, maximum security, and real-world best practices.
---

# AWS Architecture & Design Skill

This skill provides a comprehensive guide for designing AWS architectures. It prioritizes the "Frugal Architect" mindset, zero-trust security as a default, and proven production patterns.

## 1. Core Philosophy

*   **Cost as a Non-Functional Requirement**: Architecture decisions must always weigh the cost impact. "Pay for what you use" should be "Pay only for value".
*   **Security at Layer 0**: Security is not an addon. It's built into the networking, identity, and data layers from day one.
*   **Immutable Infrastructure**: All infrastructure must be defined as code (Terraform/OpenTofu) and treated as disposable.
*   **Managed Services First**: Prefer managed services (S3, DynamoDB, Lambda) over self-managed ones (EC2) to reduce operational overhead.

## 2. Pricing Optimization Patterns

### Compute
*   **Spot Instances**: Use Spot instances for stateless, fault-tolerant workloads (EKS nodes, ECS tasks, Batch jobs). Target a 60-90% saving.
*   **Graviton**: Default to ARM-based Graviton processors for RDS, ElastiCache, and EC2. Better performance/price ratio.
*   **Lambda Optimization**:
    *   Right-size memory (CPU scales with memory).
    *   Use **Lambda Power Tuning** to find the sweet spot.
    *   Switch to ARM64 architecture.

### Storage
*   **S3 Intelligent-Tiering**: Default bucket policy for data with unknown access patterns. Automates moving data to cheaper tiers.
*   **EBS Volumes**: Use `gp3` instead of `gp2`. `gp3` is cheaper and allows independent provisioning of IOPS and throughput. Delete unattached volumes.

### Data Transfer (The Silent Killer)
*   **VPC Endpoints (PrivateLink)**: keep traffic within AWS network for services like S3 and DynamoDB to avoid NAT Gateway processing charges.
*   **CloudFront**: Cache content at the edge to reduce load on origins (ALB/S3) and reduce data transfer out costs (DTO).
*   **Single-AZ for non-critical**: For dev/test, keep workloads in a single Availability Zone to avoid cross-AZ data transfer fees.

### Monitoring
*   **Cost Anomaly Detection**: specific CloudWatch alarms for predicted spend.
*   **AWS Budgets**: Set strict budgets with email alerts at 50%, 80%, and 100%.

## 3. Maximum Security Architecture

### Identity & Access (IAM)
*   **No IAM Users**: Use **IAM Identity Center (SSO)** for human access.
*   **Least Privilege**:
    *   Stop using `AdministratorAccess`.
    *   Use `Access Analyzer` to generate policies based on CloudTrail activity.
*   **Service Roles**: Every compute resource (EC2, Lambda) must have its own dedicated role. No sharing roles.

### Network Security
*   **Private by Default**: Place backend resources (RDS, EC2) in private subnets. Only Load Balancers/NAT Gateways in public subnets.
*   **Security Groups**: Allow rules only. Reference other Security Groups (SG-to-SG) instead of CIDR blocks where possible.
*   **NACLs**: Use Network ACLs as a stateless second layer of defense for subnet boundaries.

### Data Protection
*   **Encryption at Rest**: Enable KMS encryption for everything (EBS, RDS, S3, DynamoDB). Use Customer Managed Keys (CMK) for sensitive data to control key rotation and deletion.
*   **Encryption in Transit**: TLS 1.2+ everywhere. ACM handles certs for ALB/CloudFront.

### Threat Detection
*   **GuardDuty**: Enable in all regions.
*   **WAF**: Put Web Application Firewall on CloudFront/ALB. Use managed rules (Common, IP reputation).
*   **Security Hub**: Central dashboard for compliance (CIS Benchmark).

## 4. Real-World Reference Architectures

### A. Modern Web Application (Containerized)
*   **Frontend**: CloudFront CDN -> S3 Bucket (Static assets).
*   **Compute**: Application Load Balancer (Public) -> ECS Fargate / EKS (Private Subnet).
*   **Data**: Aurora PostgreSQL (Serverless v2 or Provisioned) (Private Subnet).
*   **Caching**: ElastiCache for Redis (Private Subnet).

### B. Serverless Microservices API
*   **Entry**: API Gateway (HTTP API is cheaper than REST API).
*   **Compute**: AWS Lambda (Node.js/Python/Go).
*   **Data**: DynamoDB (On-Demand capacity initially).
*   **Async**: EventBridge for decoupling services, SQS for buffering.

### C. Static Website / SPA
*   **Hosting**: S3 Bucket (Block Public Access enabled).
*   **Delivery**: CloudFront (Origin Access Control - OAC).
*   **Security**: WAF (Rate limiting, IP block).

## 5. Infrastructure as Code (Terraform) Best Practices

*   **Remote State**: S3 for state storage + DynamoDB for locking. Enable versioning on the bucket.
*   **Directory Structure**:
    ```
    terraform/
    ├── modules/        # Reusable components
    ├── envs/
    │   ├── dev/
    │   └── prod/       # Isolate state by environment
    ```
*   **Tagging**: Enforce a `CostCenter` and `Environment` tag on all resources for cost allocation reports.

## 6. Pre-Flight Checklist

Before handing over architecture:

- [ ] **Cost**: Is `gp3` used? Is S3 Intelligent-Tiering on? Are NAT Gateways minimized?
- [ ] **Security**: Are public S3 buckets blocked? Is MFA enabled on Root? Is CloudTrail on?
- [ ] **Resilience**: Is it Multi-AZ? Is backup (AWS Backup) configured?
- [ ] **Observability**: Are CloudWatch Logs retention policies set (don't keep logs forever)?
