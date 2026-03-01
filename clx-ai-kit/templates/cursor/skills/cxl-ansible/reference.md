# Ansible Reference Guide

Detailed reference material for Ansible patterns, best practices, and advanced topics.

## Role Patterns

### Role Variable Design

**defaults/main.yml** - User-configurable defaults:
```yaml
---
# User can override these
nginx_port: 80
nginx_worker_processes: auto
nginx_user: www-data
nginx_install_method: package  # package or source
```

**vars/main.yml** - Internal role variables:
```yaml
---
# Internal variables, not meant for override
nginx_config_path: /etc/nginx/nginx.conf
nginx_sites_enabled: /etc/nginx/sites-enabled
nginx_package_name: "{{ 'nginx' if ansible_os_family == 'Debian' else 'nginx' }}"
```

**Best Practices:**
- ✅ Expose configuration options in `defaults/`
- ✅ Keep internal logic in `vars/`
- ✅ Document all `defaults/` variables in README
- ✅ Use descriptive variable names with role prefix

### Task Organization

**✅ Good - Organized tasks:**
```yaml
---
# tasks/main.yml
- name: Include installation tasks
  include_tasks: install.yml
  tags: [install]

- name: Include configuration tasks
  include_tasks: configure.yml
  tags: [configure]

- name: Include service tasks
  include_tasks: service.yml
  tags: [service]
```

**✅ Good - Conditional includes:**
```yaml
---
- name: Install from package
  include_tasks: install_package.yml
  when: nginx_install_method == "package"

- name: Install from source
  include_tasks: install_source.yml
  when: nginx_install_method == "source"
```

**Best Practices:**
- ✅ Split large task files into logical includes
- ✅ Use `include_tasks` for conditional logic
- ✅ Use `import_tasks` for static includes (better performance)
- ✅ Group related tasks together

### Template Patterns

**✅ Good - Well-structured template:**
```jinja2
{# nginx.conf.j2 #}
user {{ nginx_user }};
worker_processes {{ nginx_worker_processes }};

events {
    worker_connections {{ nginx_worker_connections | default(1024) }};
}

http {
    {% if nginx_gzip_enabled | default(true) %}
    gzip on;
    gzip_types text/plain text/css application/json;
    {% endif %}

    {% for server in nginx_servers %}
    server {
        listen {{ server.port | default(80) }};
        server_name {{ server.name }};
        root {{ server.root }};
    }
    {% endfor %}
}
```

**Best Practices:**
- ✅ Use Jinja2 filters for defaults (`| default()`)
- ✅ Use conditionals (`{% if %}`) for optional features
- ✅ Use loops (`{% for %}`) for repeated blocks
- ✅ Document template variables in role README
- ✅ Test templates with various variable combinations

### Handler Patterns

**Multiple handlers for same service:**
```yaml
---
handlers:
  - name: restart nginx
    service:
      name: nginx
      state: restarted
  
  - name: reload nginx
    service:
      name: nginx
      state: reloaded
  
  - name: nginx handlers
    listen: nginx_changed
    service:
      name: nginx
      state: "{{ nginx_action | default('reloaded') }}"
```

**Using listen:**
```yaml
tasks:
  - name: Update config
    template:
      src: config.j2
      dest: /etc/app/config
    notify: nginx_changed  # Triggers all handlers listening to this

handlers:
  - name: reload nginx
    listen: nginx_changed
    service:
      name: nginx
      state: reloaded
  
  - name: update monitoring
    listen: nginx_changed
    uri:
      url: "http://monitoring/update"
```

## Inventory Management

### Static Inventory Best Practices

**Environment separation:**
```
inventories/
├── dev/
│   ├── hosts.yml
│   └── group_vars/
│       ├── all.yml
│       └── webservers.yml
├── staging/
│   └── ...
└── prod/
    └── ...
```

**hosts.yml structure:**
```yaml
---
all:
  children:
    webservers:
      hosts:
        web1:
          ansible_host: 10.0.1.10
          ansible_user: admin
        web2:
          ansible_host: 10.0.1.11
          ansible_user: admin
      vars:
        nginx_port: 80
    
    databases:
      hosts:
        db1:
          ansible_host: 10.0.2.10
          ansible_user: admin
      vars:
        postgres_version: 14
    
    # Group of groups
    production:
      children:
        webservers:
        databases:
      vars:
        environment: production
```

### Dynamic Inventory

**AWS EC2 Plugin:**
```yaml
---
plugin: aws_ec2
regions:
  - us-east-1
  - us-west-2
filters:
  instance-state-name: running
  tag:Environment: production
keyed_groups:
  - key: tags.Environment
    prefix: env
  - key: tags.Role
    prefix: role
  - key: placement.region
    prefix: region
hostnames:
  - tag:Name
compose:
  ansible_host: private_ip_address
```

**GCP Compute Engine:**
```yaml
---
plugin: gcp_compute
projects:
  - my-project
filters:
  - status = RUNNING
keyed_groups:
  - key: labels.environment
    prefix: env
```

**Best Practices:**
- ✅ Cache dynamic inventory (`ansible.cfg`: `enable_plugins = cache`)
- ✅ Use `--refresh-cache` when inventory changes
- ✅ Combine static and dynamic inventories if needed
- ✅ Use `keyed_groups` for automatic grouping

### Inventory Variables

**group_vars/all.yml:**
```yaml
---
# Applies to all hosts
ansible_user: admin
ansible_ssh_private_key_file: ~/.ssh/id_rsa
ansible_python_interpreter: /usr/bin/python3
timezone: UTC
```

**group_vars/webservers.yml:**
```yaml
---
# Web server specific
nginx_port: 80
nginx_worker_processes: 4
app_deploy_path: /var/www/app
```

**host_vars/web1.yml:**
```yaml
---
# Host-specific overrides
nginx_port: 8080  # Override group default
custom_setting: value
```

**Best Practices:**
- ✅ Use `group_vars/` for shared configuration
- ✅ Use `host_vars/` for host-specific overrides
- ✅ Keep sensitive data encrypted (Vault)
- ✅ Document variable hierarchy

## Security Patterns

### Ansible Vault Usage

**Encrypt entire file:**
```bash
ansible-vault encrypt group_vars/prod/secrets.yml
```

**Encrypt single string:**
```bash
ansible-vault encrypt_string 'my_secret_password' --name 'db_password'
```

**Edit encrypted file:**
```bash
ansible-vault edit group_vars/prod/secrets.yml
```

**View encrypted file:**
```bash
ansible-vault view group_vars/prod/secrets.yml
```

**Using vault password file:**
```bash
# Create .vault_pass file (add to .gitignore!)
echo "my-vault-password" > .vault_pass
chmod 600 .vault_pass

# Use in playbook
ansible-playbook site.yml --vault-password-file .vault_pass
```

**Environment variable:**
```bash
export ANSIBLE_VAULT_PASSWORD_FILE=~/.vault_pass
ansible-playbook site.yml
```

### Vault Best Practices

**✅ Good - Separate vault files:**
```
group_vars/
├── all.yml              # Non-sensitive defaults
├── prod/
│   ├── vars.yml         # Non-sensitive prod vars
│   └── secrets.yml       # Encrypted secrets
└── dev/
    └── secrets.yml       # Encrypted dev secrets
```

**✅ Good - Encrypted string in vars:**
```yaml
---
# group_vars/prod/vars.yml
db_host: db.prod.example.com
db_name: myapp

# group_vars/prod/secrets.yml (encrypted)
db_password: !vault |
  $ANSIBLE_VAULT;1.1;AES256
  6638643965396638326438623635306665333561366132646538623364646338
  ...
```

**❌ Bad - Secrets in plain text:**
```yaml
---
# Never do this!
db_password: "super_secret_password"
api_key: "sk_live_1234567890"
```

**Best Practices:**
- ✅ Encrypt all secrets (passwords, API keys, certificates, tokens)
- ✅ Use separate vault files per environment
- ✅ Store vault password securely (never commit)
- ✅ Use CI/CD secrets for vault password in automation
- ✅ Rotate vault passwords regularly
- ✅ Use `ansible-vault rekey` to change password

### SSH Key Management

**Using SSH agent:**
```bash
eval $(ssh-agent)
ssh-add ~/.ssh/id_rsa
ansible-playbook site.yml  # Uses agent automatically
```

**SSH config:**
```yaml
# ~/.ssh/config
Host *.example.com
  User admin
  IdentityFile ~/.ssh/id_rsa
  StrictHostKeyChecking no
```

**ansible.cfg:**
```ini
[defaults]
host_key_checking = False
private_key_file = ~/.ssh/id_rsa
```

### Privilege Escalation

**Using become:**
```yaml
---
- name: Install package
  hosts: all
  become: yes
  become_user: root
  become_method: sudo
  tasks:
    - name: Install nginx
      package:
        name: nginx
```

**Become per task:**
```yaml
---
- name: Mixed privilege tasks
  hosts: all
  tasks:
    - name: Read user file (no sudo)
      file:
        path: /home/user/file
        state: file
    
    - name: Install package (sudo)
      become: yes
      package:
        name: nginx
```

**Best Practices:**
- ✅ Use `become: yes` at play level when most tasks need it
- ✅ Use `become_user` for specific user (not always root)
- ✅ Use `become_method: sudo` (default) or `su` as needed
- ✅ Limit sudoers file to specific commands when possible

## Testing Strategies

### Molecule Setup

**Initialize role:**
```bash
molecule init role my-role --driver-name docker
```

**molecule/default/molecule.yml:**
```yaml
---
dependency:
  name: galaxy
driver:
  name: docker
platforms:
  - name: ubuntu
    image: ubuntu:22.04
    pre_build_image: true
  - name: centos
    image: quay.io/centos/centos:stream8
    pre_build_image: true
provisioner:
  name: ansible
  config_options:
    defaults:
      fact_caching: jsonfile
verifier:
  name: ansible
  options:
    playbook: tests/test.yml
```

**Test playbook (tests/test.yml):**
```yaml
---
- name: Test role
  hosts: all
  roles:
    - role: my-role
      vars:
        nginx_port: 8080
  
  tasks:
    - name: Verify nginx is installed
      package:
        name: nginx
      register: nginx_pkg
    
    - name: Assert nginx is installed
      assert:
        that:
          - nginx_pkg is succeeded
    
    - name: Verify nginx is running
      uri:
        url: "http://localhost:{{ nginx_port }}"
        status_code: 200
```

**Molecule commands:**
```bash
molecule create      # Create test instances
molecule converge     # Run playbook
molecule idempotence  # Check idempotency
molecule verify       # Run tests
molecule destroy      # Cleanup
molecule test         # Full test cycle
```

### ansible-lint

**Installation:**
```bash
pip install ansible-lint
```

**Configuration (.ansible-lint):**
```yaml
---
skip_list:
  - yaml[line-length]
  - name[casing]
  - name[template]  # Allow template in name
exclude_paths:
  - .cache/
  - molecule/
  - .github/
rules:
  name:
    formats:
      - "{{ inventory_hostname }} something"
```

**Common rules:**
- `yaml[line-length]` - Line too long
- `name[casing]` - Name should start with uppercase
- `risky-shell-pipe` - Use shell module carefully
- `command-instead-of-module` - Use module instead of command
- `no-handler` - Task should use handler

**Best Practices:**
- ✅ Run `ansible-lint` in pre-commit hook
- ✅ Fix critical issues before committing
- ✅ Configure skip_list for project exceptions
- ✅ Use in CI/CD pipeline

### Dry-run Testing

**Check mode:**
```bash
ansible-playbook site.yml --check
```

**Check mode with diff:**
```bash
ansible-playbook site.yml --check --diff
```

**Best Practices:**
- ✅ Always run `--check` before production
- ✅ Use `--diff` to see what would change
- ✅ Some modules don't support check mode (command, shell)
- ✅ Verify idempotency with multiple runs

## CI/CD Integration

### GitHub Actions

**Complete workflow:**
```yaml
name: Ansible CI

on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  lint:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install dependencies
        run: |
          pip install ansible ansible-lint
      
      - name: Run ansible-lint
        run: ansible-lint
  
  syntax:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install Ansible
        run: pip install ansible
      
      - name: Syntax check
        run: |
          ansible-playbook --syntax-check playbooks/site.yml
  
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install Molecule
        run: |
          pip install molecule molecule-plugins[docker]
      
      - name: Run Molecule tests
        run: molecule test
  
  deploy:
    needs: [lint, syntax, test]
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    steps:
      - uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.11'
      
      - name: Install Ansible
        run: pip install ansible
      
      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: us-east-1
      
      - name: Deploy to production
        env:
          ANSIBLE_VAULT_PASSWORD: ${{ secrets.ANSIBLE_VAULT_PASSWORD }}
        run: |
          echo "$ANSIBLE_VAULT_PASSWORD" > .vault_pass
          ansible-playbook playbooks/site.yml \
            -i inventories/prod/hosts.yml \
            --vault-password-file .vault_pass
```

### GitLab CI

```yaml
stages:
  - lint
  - test
  - deploy

variables:
  ANSIBLE_FORCE_COLOR: "1"

lint:
  stage: lint
  image: quay.io/ansible/molecule:latest
  script:
    - pip install ansible-lint
    - ansible-lint

test:
  stage: test
  image: quay.io/ansible/molecule:latest
  script:
    - molecule test

deploy:
  stage: deploy
  image: quay.io/ansible/ansible-runner:latest
  only:
    - main
  script:
    - ansible-playbook playbooks/site.yml -i inventories/prod/hosts.yml
  environment:
    name: production
```

### Best Practices

- ✅ Run lint and syntax checks on every PR
- ✅ Run Molecule tests before merge
- ✅ Use dry-run (`--check`) in CI before deploy
- ✅ Require manual approval for production deploys
- ✅ Store vault password in CI/CD secrets
- ✅ Use separate inventories for CI testing

## Troubleshooting

### Common Issues

**Issue: "Module not found"**
```bash
# Solution: Install collection
ansible-galaxy collection install community.docker

# Or use FQCN
- name: Use FQCN
  community.docker.docker_container:
    name: mycontainer
```

**Issue: "Host key verification failed"**
```bash
# Solution: Add to known_hosts or disable checking
ansible-playbook site.yml --ssh-common-args='-o StrictHostKeyChecking=no'

# Or in ansible.cfg
[defaults]
host_key_checking = False
```

**Issue: "Permission denied"**
```bash
# Solution: Use become
ansible-playbook site.yml --become --ask-become-pass

# Or configure passwordless sudo
```

**Issue: "Python not found"**
```bash
# Solution: Specify Python interpreter
ansible-playbook site.yml -e 'ansible_python_interpreter=/usr/bin/python3'

# Or in inventory
ansible_python_interpreter: /usr/bin/python3
```

**Issue: "Vault password required"**
```bash
# Solution: Provide password
ansible-playbook site.yml --ask-vault-pass

# Or use password file
ansible-playbook site.yml --vault-password-file .vault_pass
```

### Debugging Tips

**Verbose output:**
```bash
ansible-playbook site.yml -v        # Verbose
ansible-playbook site.yml -vv       # More verbose
ansible-playbook site.yml -vvv      # Even more verbose
ansible-playbook site.yml -vvvv     # Connection debugging
```

**Debug specific task:**
```yaml
- name: Debug task
  debug:
    var: result
  when: debug_mode | default(false)
```

**Check facts:**
```bash
ansible all -i inventory -m setup
ansible all -i inventory -m setup -a "filter=ansible_distribution*"
```

**Test connectivity:**
```bash
ansible all -i inventory -m ping
ansible webservers -i inventory -m ping
```

## Performance Optimization

### Parallel Execution

**ansible.cfg:**
```ini
[defaults]
forks = 10  # Run on 10 hosts in parallel
host_key_checking = False
```

**Limit hosts:**
```bash
ansible-playbook site.yml --limit webservers
ansible-playbook site.yml --limit "webservers:!web1"
```

### Fact Caching

**ansible.cfg:**
```ini
[defaults]
fact_caching = jsonfile
fact_caching_connection = /tmp/ansible_facts
fact_caching_timeout = 3600
```

**Best Practices:**
- ✅ Use fact caching for large inventories
- ✅ Set appropriate timeout
- ✅ Clear cache when facts change

### Async Tasks

**Long-running tasks:**
```yaml
- name: Long operation
  command: /usr/bin/long-script
  async: 3600  # Timeout in seconds
  poll: 10     # Check every 10 seconds
  register: result

- name: Wait for completion
  async_status:
    jid: "{{ result.ansible_job_id }}"
  register: job_result
  until: job_result.finished
  retries: 30
```

## Best Practices Summary

### Code Organization
- ✅ Separate inventories by environment
- ✅ Keep roles small and focused
- ✅ Use group_vars and host_vars appropriately
- ✅ Document variables and usage

### Security
- ✅ Encrypt all secrets with Vault
- ✅ Never commit unencrypted secrets
- ✅ Use SSH keys, not passwords
- ✅ Limit privilege escalation

### Testing
- ✅ Test roles with Molecule
- ✅ Run ansible-lint before committing
- ✅ Use check mode before production
- ✅ Verify idempotency

### Performance
- ✅ Use parallel execution (forks)
- ✅ Enable fact caching for large inventories
- ✅ Use async for long-running tasks
- ✅ Limit execution to specific hosts when possible
