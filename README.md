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

```

---

## ✅ Testing Strategy & Approach

This test suite is organized into four categories:

### General Registration Form Behavior

**Test File**: `tests/registration-form-general-tests.spec.ts`

### Email Fields Input Validation

**Test File**: `tests/email-fields-input-validation.spec.ts`

This test focuses on validating user input in the **email** and **confirm email** fields during registration.

- ✅ Valid email patterns including:

  - Lowercase/uppercase usage
  - Special characters (e.g., `+`, `.`, `-`,)
  - Subdomains and various TLDs
  - Edge-length boundaries
  -

- ❌ Invalid formats including:
  - Malformed or incomplete addresses
  - Forbidden characters
  - Control characters and whitespace
  - Localization & Unicode edge cases
  - Common security exploits (SQL injection, XSS, path traversal)

### Password Field Input Validation

**Test File**: `tests/password-field-validation.spec.ts`

This section of the QA suite verifies password input behavior on the registration form.

### 🎯 Objectives

Ensure the password field accepts only passwords that meet the defined security criteria, including:

- Minimum/maximum length
- Required character types (uppercase, lowercase, digits, special chars)
- Rejection of weak or incomplete passwords

### API Submission & Response Handling

**Test File**: `tests/api-submission.spec.ts`

Directly tests the /api.php endpoint.

Sends raw POST requests simulating form submission.

Validates:

✅ Correct request returns HTTP 200 with success.

❌ Invalid formats return HTTP 400 with "Validation failed" message.

Includes control character tests, Unicode checks, injection attack vectors, etc.
