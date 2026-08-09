function cleanLines(input = '') {
  return input.split(/\r?\n/).map((line) => line.trim()).filter(Boolean)
}

function topRequirements(input) {
  const lines = cleanLines(input)
  return (lines.length ? lines : ['Provided feature or change']).slice(0, 8)
}

export function fallbackResult(tool, input) {
  const reqs = topRequirements(input)
  const title = `# ${tool.title}\n\n> Local rules-based result. Configure OPENAI_API_KEY for deeper document analysis.\n\n`

  if (tool.slug === 'requirement-to-test-cases') {
    const rows = reqs.flatMap((r, i) => [
      `## TC-${String(i * 3 + 1).padStart(3, '0')} — Happy path\n- **Requirement:** ${r}\n- **Priority:** High\n- **Type:** Functional / Positive\n- **Precondition:** Required test data and access are available.\n- **Steps:** 1. Navigate to the relevant function. 2. Enter valid data. 3. Submit the action.\n- **Expected:** The requirement is completed successfully and persisted correctly.\n- **Automation:** Candidate after behaviour stabilises.`,
      `## TC-${String(i * 3 + 2).padStart(3, '0')} — Invalid input / negative path\n- **Requirement:** ${r}\n- **Priority:** High\n- **Type:** Negative / Validation\n- **Steps:** Use invalid, missing or disallowed input relevant to this requirement.\n- **Expected:** The action is blocked safely with a clear error and no unintended data change.`,
      `## TC-${String(i * 3 + 3).padStart(3, '0')} — Boundary / exception\n- **Requirement:** ${r}\n- **Priority:** Medium\n- **Type:** Boundary / Exception\n- **Steps:** Exercise minimum, maximum, empty, duplicate or interrupted conditions where applicable.\n- **Expected:** Behaviour follows the defined business rule; undefined limits are raised as questions.`,
    ])
    return title + rows.join('\n\n') + '\n\n# Questions\n- What validation limits, roles, integrations and non-functional targets are explicitly required?\n- Which business rules must never be assumed?'
  }

  if (tool.slug === 'test-plan-generator') {
    return title + `# Objective\nValidate the supplied scope using risk-based coverage and evidence-based sign-off.\n\n# In Scope\n${reqs.map(r => `- ${r}`).join('\n')}\n\n# Out of Scope\n- TBD: not specified in the source.\n\n# Test Approach\n- Functional and negative testing\n- Integration and data validation where dependencies exist\n- Targeted regression around changed and dependent areas\n- Exploratory testing for behaviour not fully captured by scripted cases\n\n# Entry Criteria\n- Testable build available\n- Environment and access ready\n- Requirements sufficiently clear\n- Required test data available\n\n# Exit Criteria\n- Planned critical coverage executed\n- No unresolved release-blocking defects\n- Residual risks explicitly accepted\n- Evidence and sign-off recorded\n\n# Risks / Open Decisions\n- Environment, schedule, non-functional targets, integrations and release dates require confirmation.`
  }

  if (tool.slug === 'requirements-quality-checker') {
    return title + `# Quality Review\n\n**Provisional score:** 65/100\n\nThis local check cannot infer missing business context. Review the following source statements for measurable outcomes and explicit rules:\n\n${reqs.map((r, i) => `## Finding ${i + 1}\n**Source:** ${r}\n- Is the expected outcome objectively testable?\n- Are roles/permissions defined?\n- Are validations and error outcomes defined?\n- Are data/integration dependencies explicit?\n- Are non-functional expectations measurable?`).join('\n\n')}\n\n# Questions for Product Owner\n- What are the acceptance thresholds?\n- What happens on failure, retry or partial completion?\n- Which roles can perform the action?\n- What audit/evidence is required?`
  }

  return title + `# Source-derived focus areas\n${reqs.map((r, i) => `${i + 1}. ${r}`).join('\n')}\n\n# Recommended QA analysis\n- Validate the primary business outcome.\n- Cover negative and exception behaviour.\n- Check permissions, data integrity and integration impacts.\n- Identify boundaries, dependencies and recovery behaviour.\n- Record assumptions rather than silently inventing rules.\n- Prioritise by business impact and likelihood.\n\n# Open questions\n- Which business rules are mandatory?\n- What are the acceptance and release criteria?\n- Which integrations and downstream processes are affected?\n- What evidence is required for sign-off?`
}
