# Test Scenarios

| ID | Scenario | Steps | Expected |
|----|----------|-------|----------|
| TS-01 | Parking enquiry grounded | Send "Is parking available?" linked to an event | Reply contains venue parking info; confidence &gt; 0.85 |
| TS-02 | Refund flagged High risk | Send "Can I get a refund?" | category=Refund Request, risk=High, status=Needs Review |
| TS-03 | No auto-send | Generate any draft | status stays Needs Review until approved |
| TS-04 | Complaint escalates | Send an angry complaint | empathy template, High risk, human escalation |
| TS-05 | Low confidence fallback | Send an off-topic question | confidence &lt; 0.8 → held for review |
| TS-06 | Webhook resilience | POST malformed WhatsApp payload | 200 with safe defaults, no crash |
| TS-07 | Approve flow | Approve a draft in /dashboard/approvals | status=Approved, audit log entry created |
| TS-08 | Create event | Use /dashboard/events/new | event persisted, appears in list |
| TS-09 | Content generation | Generate Instagram caption | non-empty content matching event |
| TS-10 | Lead pipeline move | Move a lead to Converted | stage updated, audit log entry |
