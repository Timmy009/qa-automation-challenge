# Defect Management Document

This document outlines the process for managing defects identified during the QA Automation Challenge project. It covers defect reporting, lifecycle, severity, priority, and resolution.

## Table of Contents

1.  [Defect Reporting](#defect-reporting)
    *   [Defect Template](#defect-template)
2.  [Defect Lifecycle](#defect-lifecycle)
3.  [Defect Severity and Priority](#defect-severity-and-priority)
    *   [Severity Definitions](#severity-definitions)
    *   [Priority Definitions](#priority-definitions)
    *   [Severity vs. Priority Matrix](#severity-vs-priority-matrix)
4.  [Defect Resolution Process](#defect-resolution-process)
5.  [Defect Metrics (Optional)](#defect-metrics-optional)

---

## 1. Defect Reporting

All defects will be reported using a standardized template to ensure consistency and provide all necessary information for reproduction and resolution.

### Defect Template

| Field | Description | Example |
|---|---|---|
| **Defect ID** | Unique identifier for the defect. | `BUG-001` |
| **Title** | A concise summary of the defect. | `Login button remains enabled with empty fields` |
| **Description** | Detailed explanation of the defect, including what happened and what was expected. | `When navigating to the login page and leaving both username and password fields empty, the "Login" button is still clickable. Expected: The "Login" button should be disabled until both fields contain valid input.` |
| **Steps to Reproduce** | Clear, numbered steps to reproduce the defect. | `1. Navigate to http://localhost:3000/login <br> 2. Leave Username field empty. <br> 3. Leave Password field empty. <br> 4. Observe the state of the "Login" button.` |
| **Expected Result** | What the application should do if the defect were not present. | `The "Login" button should be disabled.` |
| **Actual Result** | What the application actually does, demonstrating the defect. | `The "Login" button is enabled and clickable.` |
| **Severity** | Impact of the defect on the system. (Critical, Major, Moderate, Minor, Cosmetic) | `Major` |
| **Priority** | Urgency of fixing the defect. (High, Medium, Low) | `High` |
| **Environment** | Where the defect was observed (OS, Browser, URL, Backend Version). | `OS: macOS Sonoma 14.4.1 <br> Browser: Chrome 126.0.6478.127 <br> URL: http://localhost:3000/login <br> Backend: v1.0.0` |
| **Screenshots/Logs** | Attach relevant screenshots, console logs, network requests, or error messages. | `[screenshot.png], [console_log.txt]` |
| **Reported By** | Name of the person who reported the defect. | `QA Engineer` |
| **Date Reported** | Date when the defect was reported. | `2025-07-27` |
| **Assigned To** | Developer responsible for fixing the defect. | `John Doe` |
| **Status** | Current state of the defect. (New, Open, In Progress, To Be Tested, Reopened, Closed) | `New` |
| **Resolution** | How the defect was resolved (e.g., Fixed, Won't Fix, Duplicate, Not a Bug). | `Fixed` |
| **Date Resolved** | Date when the defect was resolved. | `2025-07-28` |

---

## 2. Defect Lifecycle

The typical lifecycle of a defect will be as follows:

1.  **New:** Defect is reported for the first time.
2.  **Open:** Defect is reviewed and confirmed by the QA lead/team.
3.  **Assigned:** Defect is assigned to a developer for investigation and fixing.
4.  **In Progress:** Developer is actively working on fixing the defect.
5.  **To Be Tested:** Developer has implemented a fix and the defect is ready for retesting by QA.
6.  **Reopened:** QA retests the defect and finds that it is not fixed or a new issue has arisen. It goes back to "Open" or "In Progress".
7.  **Closed:** QA verifies the fix, and the defect is confirmed as resolved.
8.  **Deferred/On Hold:** Defect is acknowledged but postponed for a future release.
9.  **Rejected/Not a Bug:** Defect is not considered a valid bug (e.g., working as designed, duplicate).

---

## 3. Defect Severity and Priority

### Severity Definitions

*   **Critical:** Blocks core functionality, prevents major features from being used, no workaround. (e.g., Login not working, application crashes).
*   **Major:** Significant impact on functionality, but a workaround exists or affects a non-critical path. (e.g., Item creation fails intermittently, incorrect data displayed).
*   **Moderate:** Minor loss of functionality, easily workaroundable, or affects non-essential features. (e.g., UI misalignment, minor validation error).
*   **Minor:** Cosmetic issues, typos, or very slight deviations from design that do not affect functionality. (e.g., Font size inconsistency, button color mismatch).
*   **Cosmetic:** Aesthetic issues that do not affect functionality or usability. (e.g., Typo in a non-critical label).

### Priority Definitions

*   **High:** Must be fixed immediately, impacts release schedule. (e.g., Critical severity bugs, major security vulnerabilities).
*   **Medium:** Should be fixed in the current release, but not immediately blocking. (e.g., Major severity bugs, important usability issues).
*   **Low:** Can be fixed in a future release, minor impact. (e.g., Moderate, Minor, or Cosmetic severity bugs).

### Severity vs. Priority Matrix

| Severity \ Priority | High | Medium | Low |
|---|---|---|---|
| **Critical** | Fix Immediately | N/A | N/A |
| **Major** | Fix in Current Sprint | Fix in Current Sprint | Defer to Next Sprint |
| **Moderate** | Fix in Current Sprint | Defer to Next Sprint | Defer to Future Release |
| **Minor** | Defer to Next Sprint | Defer to Future Release | Defer to Future Release |
| **Cosmetic** | Defer to Future Release | Defer to Future Release | Defer to Future Release |

---

## 4. Defect Resolution Process

1.  **Report:** QA reports a new defect using the template and sets status to "New".
2.  **Review & Assign:** QA Lead/Project Manager reviews the defect, confirms its validity, sets initial Severity and Priority, and assigns it to a developer. Status changes to "Open" then "Assigned".
3.  **Fix:** Developer investigates the defect, implements a fix, and performs local testing.
4.  **Code Review & Merge:** Developer's code is reviewed and merged into the main branch.
5.  **Build & Deploy:** The updated code is deployed to the staging environment.
6.  **Retest:** QA retests the defect in the staging environment.
    *   If fixed, status changes to "Closed".
    *   If not fixed, status changes to "Reopened" with new details, and it goes back to the developer.
7.  **Regression Testing:** After a fix, relevant regression tests are run to ensure no new bugs were introduced.

---

## 5. Defect Metrics (Optional)

(This section can be used to track and analyze defect data over time, helping to identify trends and areas for improvement.)

*   **Defect Density:** Number of defects per unit of code (e.g., per KLOC).
*   **Defect Trend:** Number of defects reported over time.
*   **Defect Resolution Time:** Average time taken to resolve defects.
*   **Defect Distribution:** Breakdown of defects by module, severity, or priority.
*   **Reopen Rate:** Percentage of defects that are reopened after being marked as fixed.
