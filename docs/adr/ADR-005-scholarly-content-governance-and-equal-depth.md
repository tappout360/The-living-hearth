# ADR-005: Scholarly Content Review Workflow & Equal Depth Matrix

## Status
**Accepted**

## Context
When introducing educational pathways across diverse world religions, platforms frequently fall into three failure modes:
1. Privileging the majority tradition of the engineering team with deeper content while reducing others to brief summaries.
2. Presenting monolithic or stereotypical portrayals that erase internal diversity (e.g., ignoring differences between Sunni, Shia, and Sufi; or between Orthodox, Conservative, and Reform Judaism).
3. Publishing unvetted or biased text without scholarly source citations.

## Decision
1. **Four-Stage Review Lifecycle:**
   - Every learning module transitions through an explicit editorial workflow:
     `draft` &rarr; `in_review` &rarr; `scholarly_reviewed` &rarr; `published`.
   - Only modules with `published` status are rendered as complete in the user interface.
2. **Equal Depth & Coverage Framework:**
   - All supported traditions must provide equivalent structural depth:
     - Foundational Principles & Sacred Texts
     - Historical Context & Key Milestones
     - Internal Diversity & Major Branches
     - Daily Practice & Contemplative Traditions
     - Common Misconceptions & Scholarly Nuances
3. **Mandatory Canonical & Scholarly Citations:**
   - Every module must list verified academic, canonical, or historical citations.
   - Community correction proposals require academic citations (e.g., chapter/page or canonical scripture reference) before triage review.
4. **Coverage Audit Matrix:**
   - Automated checks verify that no single tradition exceeds a 1.5x content volume ratio relative to other foundational pathways.

## Consequences
- **Positive:** Guarantees equal dignity, scholarly accuracy, and respect for internal tradition diversity.
- **Trade-off:** Content expansion is deliberately slower; rapid unvetted publishing is prohibited.
