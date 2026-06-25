# AI Test Strategy

This app is also a portfolio piece for an **AI Test Manager**. The strategy below is what we actually enforce in the product.

## Principles
1. **Human-in-the-loop**: no AI message is sent without explicit human approval.
2. **Grounding**: replies use only the stored event knowledge base (FAQ, policies, logistics).
3. **Risk-based routing**: refunds and complaints are always High risk and escalated.
4. **Confidence scoring**: every reply carries a confidence; below threshold (0.8) it is held for review.
5. **Auditability**: every AI and human action is logged.

## Test levels
- **Unit**: classification rules, reply grounding, content templates (`tests/api/*`).
- **Integration / API**: `/api/ai/classify-message`, `/api/ai/generate-content`, `/api/approvals/*`.
- **E2E**: create event, generate content, approve a reply (`tests/e2e/*`).

## Quality gates
- Classification accuracy &ge; 90% on the golden set.
- 100% of High-risk categories routed to human.
- 0 auto-sends without approval.
- Webhook handler resilient to malformed/duplicate payloads.

## Metrics tracked
- Draft acceptance rate, edit rate, rejection rate.
- Confidence distribution vs. human override.
- Time-to-approval per risk level.
