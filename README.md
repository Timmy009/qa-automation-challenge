# QA Automation Challenge

This project is a full-stack application designed to demonstrate comprehensive QA automation testing across different layers: UI, API, Performance, and Security.

## Project Structure



## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm
- Docker (for security tests)
- MongoDB (running locally or accessible via connection string)

### Installation

1.  **Clone the repository:**
    \`\`\`bash
    git clone <repository-url>
    cd qa-automation-challenge
    \`\`\`
2.  **Install root dependencies:**
    \`\`\`bash
    npm install
    \`\`\`
    This will automatically install dependencies for `app/backend`, `app/frontend`, `tests/api`, and `tests/ui` via the `postinstall` script.

### Environment Variables

Create a `.env` file in `app/backend` with the following:

\`\`\`
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
\`\`\`

For the frontend, ensure `NEXT_PUBLIC_BACKEND_API_URL` is set in your environment (e.g., `.env.local` in `app/frontend` or directly in your deployment environment):

\`\`\`
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:5000/api
\`\`\`

### Running the Applications

1.  **Start the Backend API:**
    \`\`\`bash
    npm run start:backend
    \`\`\`
    The API will run on `http://localhost:5000`.

2.  **Start the Frontend Application:**
    \`\`\`bash
    npm run start:frontend
    \`\`\`
    The frontend will run on `http://localhost:3000`.

## Running Tests

-   **API Tests:**
    \`\`\`bash
    npm run test:api
    \`\`\`
-   **UI Tests (Cypress):**
    \`\`\`bash
    npm run test:ui
    \`\`\`
    (Ensure both backend and frontend are running for UI tests)
-   **Performance Tests (K6):**
    \`\`\`bash
    npm run test:performance
    \`\`\`
    (Ensure backend is running)
-   **Security Tests (OWASP ZAP):**
    \`\`\`bash
    npm run test:security
    \`\`\`
    (Ensure backend is running and Docker is installed)

## CI/CD with GitHub Actions

This project includes GitHub Actions workflows for automated testing:

-   `.github/workflows/ui-tests.yml`: Runs Cypress UI tests on push.
-   `.github/workflows/api-tests.yml`: Runs Jest API tests on push.
-   `.github/workflows/coverage-report.yml`: Generates a test coverage report.

## Documentation

-   `docs/ASSUMPTIONS.md`: Key assumptions made during development and testing.
-   `docs/DEFECTS.md`: Log of identified defects.
-   `docs/TEST-PLAN.md`: High-level test strategy.
-   `docs/TEST-CASES.md`: Detailed test cases.

## License

This project is licensed under the MIT License. See the `LICENSE.md` file for details.
