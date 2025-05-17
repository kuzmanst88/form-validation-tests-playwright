# QA Automation Test Suite – Registration Form

## 📌 Project Description

This repository contains an automated test suite for validating email and password input behavior on the registration form of the following web application:

🔗 [https://abc13514.sg-host.com/](https://abc13514.sg-host.com/)

The primary objective is to ensure proper validation of email formats and passwords using both client-side JavaScript and backend responses. This suite is implemented using [Playwright](https://playwright.dev).

---

## 🛠 Tech Stack

- **Framework**: [Playwright](https://playwright.dev/)
- **Language**: TypeScript, JS
- **Test Runner**: Playwright Test

---

## 🚀 Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/kuzmanst88/qa-email-validation-suite.git
cd qa-email-validation-suite
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Run Tests

```bash
npx playwright test
```

✅ To run tests in headed mode for debugging:

```bash
npx playwright test --headed
```

🔍 To view the HTML test report after running:

```bash
npx playwright show-report
```

---

## 📁 Project Structure

```
.
├── tests/                         # All test specs
│   └── registration-form-general-tests.spec.ts
│   └── email-fields-input-validation.spec.ts
│   └── password-field-validation.spec.ts
│   └── api-submission.spec.ts
├── playwright.config.ts          # Playwright configuration
├── package.json                  # Project metadata and scripts
├── package-lock.json
├── documentation.md              # Project documentation

```

For a comprehensive explanation of each test case, validation strategy, and expected outcomes, please refer to the [test documentation](./documentation.md).
