---
description: MANDATORY - Always check and review all relevant rules and skills before processing any task
---
# Mandatory Pre-Processing: Rules & Skills Review

**CRITICAL**: This rule has priority 0 and MUST be executed FIRST before any task processing. The AI agent MUST check and review all relevant rules and skills before implementing any solution.

## Mandatory Pre-Processing Steps

### Step 1: Review Available Rules

**BEFORE** starting any task, list and review all rules in `.claude/rules/`:

For each rule file:
- Read the rule file to understand its requirements
- Identify which rules apply to the current task
- Note any mandatory patterns or constraints

### Step 2: Review Available Skills

**BEFORE** implementing any solution, list and review all skills in `.claude/skills/`:

For each skill directory:
- Read the `SKILL.md` file to understand what the skill covers
- Determine if the skill is relevant to the current task
- Review any additional files in the skill directory

### Step 3: Identify Relevant Rules & Skills

Evaluate which rules and skills are relevant based on:

- **Task type**: What is the user asking for?
- **Technology stack**: What technologies are involved?
- **Domain**: What domain does the task fall into?
- **File patterns**: Which files will be modified or created?
- **Rule descriptions**: What does each rule's description indicate?
- **Skill descriptions**: What does each skill's description indicate?

### Step 4: Mandatory Brainstorming for Creative/Constructive Work

**CRITICAL**: For ANY creative or constructive work, you MUST use the brainstorming skill FIRST:

**Before** implementing any of the following:
- Features (new functionality)
- Components (UI or code components)
- Architecture (system design, infrastructure)
- Behavior changes (modifications to existing functionality)
- Functionality (any new capabilities)

**MANDATORY PROCESS:**
1. Read `.claude/skills/cxl-brainstorming/SKILL.md` completely
2. Follow the brainstorming skill process step-by-step
3. Complete the Understanding Lock (Step 4 of brainstorming)
4. Get explicit confirmation before proceeding to design
5. Complete design exploration and validation
6. Document the final design and Decision Log
7. **ONLY THEN** proceed to implementation

**You are NOT allowed** to implement, code, or modify behavior while brainstorming is active.

### Step 5: Read All Relevant Rules & Skills

**BEFORE** implementing any solution:

1. Read ALL relevant rule files completely
2. Read ALL relevant `SKILL.md` files completely
3. Review any additional files in relevant skill directories
4. Understand the patterns, best practices, and guidelines provided
5. Note any conflicts or complementary guidance between rules/skills

## Rules Location

- **Rules**: `.claude/rules/` - Contains rule files (`.md` format)
- **Skills**: `.claude/skills/` - Contains skill directories with `SKILL.md` files

## Mandatory Rules

- **ALWAYS** List `.claude/rules/` directory before starting any task
- **ALWAYS** List `.claude/skills/` directory before starting any task
- **ALWAYS** use brainstorming skill for creative/constructive work (features, components, architecture, behavior changes, functionality)
- **ALWAYS** complete brainstorming Understanding Lock before proceeding to design
- **ALWAYS** read relevant rule files BEFORE implementing solutions
- **ALWAYS** read relevant skill files BEFORE implementing solutions
- **NEVER** skip rule/skill review even if you think you know the answer
- **NEVER** skip brainstorming for creative/constructive work
- **NEVER** implement while brainstorming is active
- **NEVER** assume knowledge without checking rules/skills
- **ALWAYS** follow patterns and best practices from relevant rules/skills
- **ALWAYS** check if multiple rules/skills apply to the same task
- If unsure which rules/skills apply, review ALL to be thorough
- **ALWAYS** respect rule priorities (lower number = higher priority)

## Example Workflow

```markdown
1. User asks: "Create a FastAPI endpoint for user authentication"

2. Agent MUST (in order):
   a. List .claude/rules/ directory
   b. Read relevant rules (e.g., cxl-security.md, cxl-coding-style.md)
   c. List .claude/skills/ directory
   d. **MANDATORY**: Read cxl-brainstorming/SKILL.md (this is creative/constructive work)
   e. **MANDATORY**: Follow brainstorming process:
      - Understand current context
      - Ask questions one at a time
      - Clarify non-functional requirements
      - Complete Understanding Lock and get confirmation
      - Explore design approaches
      - Present design incrementally
      - Maintain Decision Log
   f. **ONLY AFTER** brainstorming is complete:
      - Identify relevant skills: cxl-fastapi/, cxl-security-review/, cxl-postgres-patterns/
      - Read cxl-fastapi/SKILL.md completely
      - Read cxl-security-review/SKILL.md completely
      - Read cxl-postgres-patterns/SKILL.md completely
      - Review any additional files in these skill directories
      - Understand patterns and constraints from rules/skills
   g. THEN implement following patterns from these rules/skills

3. Agent MUST NOT:
   - Start implementing without reading rules/skills
   - Skip brainstorming for creative/constructive work
   - Implement while brainstorming is active
   - Assume knowledge without checking rules/skills
   - Skip review for "simple" tasks
   - Read rules/skills after starting implementation
```

## Verification Checklist

Before processing any task, verify:

- [ ] Listed all rules in `.claude/rules/` directory
- [ ] Read all relevant rule files completely
- [ ] Listed all skills in `.claude/skills/` directory
- [ ] **For creative/constructive work**: Read cxl-brainstorming/SKILL.md completely
- [ ] **For creative/constructive work**: Completed Understanding Lock with user confirmation
- [ ] **For creative/constructive work**: Explored design approaches and validated design
- [ ] **For creative/constructive work**: Documented design and Decision Log
- [ ] Reviewed skill descriptions to identify relevant ones
- [ ] Read all relevant `SKILL.md` files completely
- [ ] Reviewed any additional files in relevant skill directories
- [ ] Understood patterns and best practices from rules/skills
- [ ] Noted any conflicts or complementary guidance
- [ ] Ready to apply rule/skill guidance to the task
- [ ] All mandatory patterns from rules will be followed

## Rule Priority

This rule has priority 0, meaning it must be executed FIRST before any other processing. No task should proceed without completing the rules and skills review checklist above.

## Enforcement

Failure to follow this rule will result in:
- Incomplete or incorrect implementations
- Missing security considerations
- Non-compliance with project standards
- Suboptimal solutions

**Remember**: Rules and skills exist to ensure quality, security, and consistency. They are not optional.