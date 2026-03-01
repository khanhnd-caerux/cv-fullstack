---
name: cxl-ansible
description: Use when working with Ansible - creating playbooks, roles, managing inventories, writing tasks, handling variables and secrets, testing with Molecule, setting up CI/CD pipelines, reviewing configurations, or making configuration management architecture decisions
---

# Ansible Skill

Comprehensive Ansible guidance covering playbooks, roles, inventory management, testing, security, and production patterns. Based on Ansible best practices and enterprise experience.

## When to Use This Skill

**Activate this skill when:**
- Creating new Ansible playbooks or roles
- Managing inventory files (static or dynamic)
- Structuring multi-environment deployments
- Implementing CI/CD for configuration management
- Working with Ansible Vault for secrets
- Testing Ansible code with Molecule
- Reviewing or refactoring existing Ansible projects
- Choosing between playbook patterns or role structures
- Handling variables, templates, and facts

**Don't use this skill for:**
- Basic Ansible syntax questions (link to docs instead)
- Module-specific API reference (link to module docs)
- Cloud platform questions unrelated to Ansible

## Core Principles

### 1. Code Structure Philosophy

**Role Hierarchy:**

| Type | When to Use | Scope |
|------|-------------|-------|
| **Task** | Single logical operation | Install package, configure service |
| **Role** | Collection of related tasks | Web server setup, database configuration |
| **Playbook** | Orchestration of roles | Complete application deployment |
| **Collection** | Reusable content across projects | Custom modules, plugins, roles |

**Hierarchy:** Task → Role → Playbook → Collection

**Directory Structure:**

```
ansible/
├── inventories/          # Environment-specific inventories
│   ├── dev/
│   │   ├── hosts.yml
│   │   └── group_vars/
│   ├── staging/
│   └── prod/
├── roles/               # Reusable roles
│   ├── common/
│   ├── webserver/
│   └── database/
├── playbooks/           # Top-level playbooks
│   ├── site.yml
│   ├── deploy.yml
│   └── provision.yml
├── collections/         # Custom collections (optional)
├── ansible.cfg          # Ansible configuration
└── requirements.yml     # Role/collection dependencies
```

**Key principles:**
- Separate **inventories** (dev, staging, prod) from **roles** (reusable components)
- Keep roles small and focused (single responsibility)
- Use **group_vars** and **host_vars** for environment-specific configuration
- Organize by feature/domain, not by type

### 2. Naming Conventions

**Roles:**
```yaml
# Good: Descriptive, lowercase with hyphens
roles/
├── nginx-webserver/
├── postgresql-database/
└── docker-container/

# Avoid: Generic names
roles/
├── server/
├── db/
└── app/
```

**Tasks:**
```yaml
# Good: Clear action verbs
- name: Install nginx package
- name: Configure nginx service
- name: Start and enable nginx

# Avoid: Vague names
- name: Setup nginx
- name: Do stuff
```

**Variables:**
```yaml
# Good: Prefix with context when needed
nginx_port: 80
nginx_worker_processes: 4
database_host: "db.example.com"

# Avoid: Generic names
port: 80
workers: 4
host: "db.example.com"
```

**Files:**
- `main.yml` - Primary tasks (in roles/tasks/)
- `defaults/main.yml` - Default variable values
- `vars/main.yml` - Role-specific variables
- `handlers/main.yml` - Handlers
- `templates/` - Jinja2 templates
- `files/` - Static files to copy
- `meta/main.yml` - Role metadata and dependencies

### 3. Playbook Structure

**Standard Playbook Layout:**
```yaml
---
- name: Deploy application
  hosts: webservers
  become: yes
  vars:
    app_version: "1.0.0"
  pre_tasks: [...]
  roles:
    - role: common
    - role: webserver
  tasks: [...]
  post_tasks: [...]
  handlers: [...]
```

**Best Practices:**
- Use `become: yes` at play level, not task level
- Group related tasks into roles
- Use tags for selective execution
- Include pre_tasks and post_tasks for setup/cleanup
- Define handlers for service restarts

**For complete playbook examples, see:** [Reference Guide](reference.md)

## Role Development

### Standard Role Structure

```
my-role/
├── README.md           # Role documentation
├── defaults/
│   └── main.yml        # Default variables (lowest priority)
├── vars/
│   └── main.yml        # Role variables (higher priority)
├── tasks/
│   └── main.yml        # Main tasks
├── handlers/
│   └── main.yml        # Handlers
├── templates/
│   └── config.j2       # Jinja2 templates
├── files/
│   └── static.conf     # Static files
├── meta/
│   └── main.yml        # Dependencies, metadata
└── tests/
    ├── inventory
    └── test.yml        # Test playbook
```

### Role Best Practices

**Variables:**
- ✅ Use `defaults/main.yml` for user-configurable variables
- ✅ Use `vars/main.yml` for internal role variables
- ✅ Always include variable descriptions in comments
- ✅ Provide sensible defaults
- ✅ Use `set_fact` sparingly (prefer vars)

**Tasks:**
- ✅ Use `name:` for every task (required for readability)
- ✅ Use `when:` for conditional execution
- ✅ Use `register:` to capture output
- ✅ Use `changed_when:` and `failed_when:` for custom logic
- ✅ Keep tasks idempotent (can run multiple times safely)

**Templates:**
- ✅ Use `.j2` extension for Jinja2 templates
- ✅ Document template variables in role README
- ✅ Use `template` module, not `copy` + `replace`
- ✅ Test templates with different variable values

**For detailed role patterns, see:** [Role Patterns Guide](reference.md#role-patterns)

## Inventory Management

### Static Inventory

**YAML Format (Recommended):**
```yaml
all:
  children:
    webservers:
      hosts:
        web1:
          ansible_host: 192.168.1.10
        web2:
          ansible_host: 192.168.1.11
      vars:
        nginx_port: 80
```

### Dynamic Inventory

**AWS EC2 Example:**
```yaml
plugin: aws_ec2
regions: [us-east-1]
filters:
  instance-state-name: running
keyed_groups:
  - key: tags.Environment
    prefix: env
```

**Best Practices:**
- ✅ Use YAML format for readability
- ✅ Separate inventories by environment (dev, staging, prod)
- ✅ Use `group_vars/` and `host_vars/` for configuration
- ✅ Use dynamic inventory for cloud environments
- ✅ Cache dynamic inventory results

**For detailed inventory patterns (INI format, GCP, etc.), see:** [Inventory Management](reference.md#inventory-management)

## Variable Management

### Variable Precedence (Lowest to Highest)

1. `defaults/main.yml` (in role)
2. Inventory group_vars
3. Inventory host_vars
4. Playbook `vars:`
5. Playbook `vars_files:`
6. Role `vars/main.yml`
7. `set_fact`
8. Command line `-e`

### Variable Organization

**Structure:**
- `group_vars/all.yml` - Applies to all hosts
- `group_vars/webservers.yml` - Group-specific vars
- `host_vars/web1.yml` - Host-specific overrides

**Best Practices:**
- ✅ Use `group_vars/` for group-specific configuration
- ✅ Use `host_vars/` for host-specific overrides
- ✅ Keep sensitive data in Vault (see Security section)
- ✅ Document variables in role README
- ✅ Use `defaults/main.yml` in roles for user customization

## Security & Secrets Management

### Ansible Vault

**Basic usage:**
```bash
ansible-vault encrypt group_vars/prod/secrets.yml
ansible-vault encrypt_string 'secret_password' --name 'db_password'
ansible-playbook site.yml --ask-vault-pass
```

**Best Practices:**
- ✅ Encrypt all secrets (passwords, API keys, certificates)
- ✅ Use separate vault files per environment
- ✅ Store vault password securely (password manager, CI/CD secrets)
- ✅ Never commit unencrypted secrets
- ✅ Use `ansible-vault view` to inspect encrypted files

**For detailed security guidance (vault patterns, SSH keys, privilege escalation), see:** [Security Patterns](reference.md#security-patterns)

## Testing Strategy

### Testing Pyramid for Ansible

```
        /\
       /  \          Integration Tests (Expensive)
      /____\         - Full environment deployment
     /      \        - Production-like setup
    /________\
   /          \      Unit Tests (Moderate)
  /____________\     - Molecule with Docker/Vagrant
 /              \    - Role testing in isolation
/________________\   Syntax Check (Cheap)
                     - ansible-lint
                     - ansible-playbook --syntax-check
```

### Molecule Testing

**Quick start:**
```bash
molecule init role my-role --driver-name docker
molecule test  # Run all tests
```

**Best Practices:**
- ✅ Test roles with Molecule before integration
- ✅ Use multiple platforms (Ubuntu, CentOS, etc.)
- ✅ Test with different variable combinations
- ✅ Use `ansible-lint` for code quality
- ✅ Run `ansible-playbook --check` for dry-run

**For detailed testing guides and molecule.yml examples, see:** [Testing Guide](reference.md#testing-strategies)

## Common Patterns

### Idempotency

**✅ Good - Idempotent:**
```yaml
- name: Ensure nginx is installed
  package:
    name: nginx
    state: present

- name: Ensure nginx is running
  service:
    name: nginx
    state: started
    enabled: yes
```

**❌ Bad - Not idempotent:**
```yaml
- name: Install nginx
  command: apt-get install -y nginx  # Will fail if already installed
```

### Error Handling

**Basic error handling:**
```yaml
- name: Try risky operation
  command: /usr/bin/risky-script
  ignore_errors: yes
  register: result

- name: Check if operation succeeded
  fail:
    msg: "Operation failed"
  when: result.rc != 0
```

**Advanced error handling:**
```yaml
- name: Attempt database migration
  command: /usr/bin/migrate-db
  register: migration_result
  failed_when: 
    - migration_result.rc != 0
    - "'already migrated' not in migration_result.stdout"
  changed_when: migration_result.rc == 0
```

### Loops and Conditionals

**Loops:**
```yaml
- name: Install multiple packages
  package:
    name: "{{ item }}"
    state: present
  loop:
    - nginx
    - postgresql
    - redis

- name: Create users
  user:
    name: "{{ item.name }}"
    uid: "{{ item.uid }}"
  loop:
    - { name: alice, uid: 1001 }
    - { name: bob, uid: 1002 }
```

**Conditionals:**
```yaml
- name: Install package (Debian)
  apt:
    name: nginx
  when: ansible_os_family == "Debian"

- name: Install package (RedHat)
  yum:
    name: nginx
  when: ansible_os_family == "RedHat"

- name: Configure feature
  template:
    src: feature.j2
    dest: /etc/app/config
  when: 
    - feature_enabled | default(false)
    - ansible_distribution_version | version_compare('20.04', '>=')
```

### Handlers

**Define handlers:**
```yaml
handlers:
  - name: restart nginx
    service:
      name: nginx
      state: restarted
  
  - name: reload nginx
    service:
      name: nginx
      state: reloaded
```

**Trigger handlers:**
```yaml
tasks:
  - name: Update nginx config
    template:
      src: nginx.conf.j2
      dest: /etc/nginx/nginx.conf
    notify: restart nginx
  
  - name: Update nginx site config
    template:
      src: site.conf.j2
      dest: /etc/nginx/sites-enabled/default
    notify: reload nginx  # Reload instead of restart
```

**Best Practices:**
- ✅ Use handlers for service restarts/reloads
- ✅ Handlers run once at end of play, even if notified multiple times
- ✅ Use `listen:` for multiple handlers triggered by same event
- ✅ Prefer `reloaded` over `restarted` when possible

## CI/CD Integration

### Recommended Workflow Stages

1. **Lint** - Code quality check (`ansible-lint`)
2. **Syntax** - Validate playbook syntax (`ansible-playbook --syntax-check`)
3. **Test** - Run Molecule tests
4. **Dry-run** - Check mode (`ansible-playbook --check`)
5. **Deploy** - Execute playbook (with approvals for production)

**For complete CI/CD templates (GitHub Actions, GitLab CI), see:** [CI/CD Patterns](reference.md#cicd-integration)

## Code Quality

### ansible-lint

**Installation:**
```bash
pip install ansible-lint
```

**Usage:**
```bash
ansible-lint playbooks/site.yml
ansible-lint roles/my-role/
```

**Configuration (.ansible-lint):**
```yaml
---
skip_list:
  - yaml[line-length]  # Allow longer lines if needed
  - name[casing]       # Allow lowercase names
exclude_paths:
  - .cache/
  - molecule/
```

**Best Practices:**
- ✅ Run `ansible-lint` before committing
- ✅ Fix critical issues (syntax errors, security)
- ✅ Configure skip_list for project-specific exceptions
- ✅ Use in CI/CD pipeline

## Version Management

### Requirements File

**requirements.yml:**
```yaml
---
# Roles from Ansible Galaxy
roles:
  - name: geerlingguy.nginx
    version: 3.1.0
  - name: geerlingguy.postgresql
    version: 2.2.0

# Collections
collections:
  - name: community.docker
    version: 3.0.0
  - name: amazon.aws
    version: 5.0.0
```

**Install:**
```bash
ansible-galaxy install -r requirements.yml
ansible-galaxy collection install -r requirements.yml
```

**Best Practices:**
- ✅ Pin versions for production
- ✅ Use semantic versioning
- ✅ Update dependencies regularly
- ✅ Test updates in dev/staging first

## Modern Ansible Features

### Collections & FQCN

**Using collections:**
```yaml
- name: Create S3 bucket
  amazon.aws.s3_bucket:
    name: my-bucket
    state: present
```

**Best Practices:**
- ✅ Use collections instead of deprecated modules
- ✅ Prefer `community.*` collections for common tasks
- ✅ Use FQCN (`ansible.builtin.package`) for clarity
- ✅ Short names acceptable for `ansible.builtin.*` modules
- ✅ Always use FQCN for collection modules

## Detailed Guides

This skill uses **progressive disclosure** - essential information is in this main file, detailed guides are available when needed:

📚 **Reference File:**
- **[Reference Guide](reference.md)** - Deep dive into role patterns, inventory management, security, testing, CI/CD, and troubleshooting

**How to use:** When you need detailed information on a topic, reference the appropriate section. Agent will load it on demand to provide comprehensive guidance.
