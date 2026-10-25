import { expect, test } from "@playwright/test";

test("profile → saved role → fit → reviewed draft with explicit AI consent", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  let version = 0;
  const state: any = { profile: null, applications: [], activity: [] };
  const calls: string[] = [];
  await page.route("**/api/job-search", async (route) => {
    if (route.request().method() === "POST") {
      const body = route.request().postDataJSON();
      calls.push(body.action);
      expect(body.version).toBe(version);
      if (body.action === "profile") state.profile = body.profile;
      if (body.action === "create")
        state.applications.unshift({
          ...body.job,
          id: "11111111-1111-4111-8111-111111111111",
          status: "Saved",
          version: 1,
          evaluation: null,
          draft: null,
          interview: null,
          reviewed: false,
        });
      const job = state.applications[0];
      if (body.action === "evaluate") {
        expect(body.consent).toBe(true);
        job.evaluation = {
          eligibility: { verdict: "unverified", evidence: "Confirm rights" },
          language: { verdict: "pass", evidence: "English" },
          logistics: { verdict: "pass", evidence: "Auckland" },
          technical: { score: 80, evidence: "Java" },
          experience: { score: 80, evidence: "QA" },
          culture: { score: null, evidence: "Unknown" },
          career: { score: 90, evidence: "Goals" },
          confidence: 60,
          risk: "medium",
          strengths: ["Testing"],
          gaps: ["Culture unknown"],
          questions: ["Work rights?"],
          recommendation: "Clarify gaps",
        };
        job.version++;
      }
      if (body.action === "draft") {
        job.draft = {
          cv: "Evidence-based tailored CV",
          coverLetter: "Evidence-based cover letter",
          review: "Checked chronology",
          warnings: ["Confirm work rights"],
        };
        job.version++;
      }
      if (body.action === "review") {
        job.draft = { ...job.draft, ...body.draft };
        job.reviewed = true;
        job.version++;
      }
      if (body.action === "update") {
        Object.assign(job, {
          status: body.status,
          notes: body.notes,
          followUp: body.followUp,
        });
        job.version++;
      }
      state.activity.push({
        at: new Date().toISOString(),
        action: body.action,
      });
      version++;
    }
    await route.fulfill({ json: { state, version, aiConfigured: true } });
  });
  await page.goto("/");
  await expect(
    page.getByRole("heading", { name: "Job Search", exact: true }),
  ).toBeVisible();
  await page.getByRole("button", { name: "My profile", exact: true }).click();
  await page
    .getByLabel("Current CV and verified achievements")
    .fill(
      "Senior quality engineer with experience leading Java API testing, test strategy, automation and stakeholder management.",
    );
  await page.getByRole("button", { name: "Save profile", exact: true }).click();
  await expect(page.getByText("Saved.", { exact: true })).toBeVisible();
  await page.getByRole("button", { name: "Add role", exact: true }).click();
  await expect(page.getByRole("link", { name: "Search SEEK" })).toHaveAttribute(
    "href",
    /seek.co.nz/,
  );
  await page.getByLabel("Company", { exact: true }).fill("Example NZ");
  await page.getByLabel("Role title", { exact: true }).fill("QA Lead");
  await page
    .getByLabel("Full job advert")
    .fill(
      "We need an experienced QA Lead in Auckland to lead Java API testing, automation and mentoring across delivery teams.",
    );
  await page.getByRole("button", { name: "Save role", exact: true }).click();
  await expect(
    page.getByRole("button", { name: "Evaluate fit", exact: true }),
  ).toBeDisabled();
  await page.getByLabel("Send my saved CV").check();
  await page.getByRole("button", { name: "Evaluate fit", exact: true }).click();
  await expect(
    page.getByRole("heading", { name: /Fit assessment/ }),
  ).toContainText("score unavailable");
  await page
    .getByRole("button", { name: "Draft + AI review", exact: true })
    .click();
  await page
    .getByLabel("Tailored CV: edit before confirming")
    .fill("My edited and verified CV");
  await page
    .getByRole("button", { name: "I checked the claims. Save reviewed draft." })
    .click();
  await expect(page.getByText("Saved version reviewed by you.")).toBeVisible();
  await page.getByLabel("Application status").selectOption("Applied");
  await page.getByRole("button", { name: "Save tracking" }).click();
  await expect(
    page.getByRole("button", { name: /QA Lead Example NZ Applied/ }),
  ).toBeVisible();
  expect(state.applications[0].draft.cv).toBe("My edited and verified CV");
  expect(calls).toEqual([
    "profile",
    "create",
    "evaluate",
    "draft",
    "review",
    "update",
  ]);
  expect(errors).toEqual([]);
  await page.screenshot({
    path: "test_reports/job-search-desktop.png",
    fullPage: true,
  });
  await page.setViewportSize({ width: 390, height: 844 });
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test_reports/job-search-mobile-workflow.png",
    fullPage: true,
  });
});

test("mobile layout and server error remain usable without false success", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.route("**/api/job-search", (route) =>
    route.fulfill({
      status: 503,
      json: {
        error:
          "Job Search storage is unavailable. The deployment needs the Job Search database setup.",
      },
    }),
  );
  await page.goto("/");
  await expect(page.getByRole("alert")).toContainText("storage is unavailable");
  await expect(
    page.getByRole("button", { name: "Add role", exact: true }),
  ).toBeDisabled();
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= window.innerWidth,
    ),
  ).toBe(true);
  await page.screenshot({
    path: "test_reports/job-search-mobile.png",
    fullPage: true,
  });
});
