# Prompt Risk Register

| ID | Risk | Category | Level | Mitigation |
|----|------|----------|-------|------------|
| PR-01 | AI issues a refund promise it should not | Refund | High | Refunds always routed to human approval; no auto-send. |
| PR-02 | Hallucinated event detail (wrong date/venue) | General | Medium | Replies grounded only in stored knowledge base; low confidence flagged. |
| PR-03 | Tone-deaf reply to an angry customer | Complaint | High | Complaints classified High risk; empathy template + human escalation. |
| PR-04 | Leaking internal pricing in sponsorship reply | Sponsorship | Medium | Sponsorship handed to partnerships lead; AI only collects contact details. |
| PR-05 | Prompt injection via customer message | Security | High | User content never executed as instructions; system prompt isolation. |
| PR-06 | Over-confident reply on unknown topic | General | Medium | Confidence threshold (&lt; 0.8) holds reply for review. |
| PR-07 | Duplicate replies from repeated webhooks | Reliability | Medium | Idempotency on inbound message handling. |

Reviewed each time prompts or classification rules change.
