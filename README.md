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

This test suite focuses on validating user input in the **email** and **confirm email** fields during registration.

### 🔄 Coverage Includes:

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

### 🧠 Testing Logic:

- Each test enters the same email in both email fields.
- A strong valid password is always used (`StrongPass123!`) to isolate email-related validation.
- If the **submit button** is disabled, the frontend (JavaScript) validation has rejected the email — this is asserted immediately.
- If submission is allowed, a DOM status message is evaluated to assert whether the backend accepted or rejected the submission.

---

## 🔎 Observations During Testing

- **Client-side validation** appears incomplete — some malformed emails bypassed frontend checks and reached the backend.
- The **status message** (`#submission-status`) sometimes returned ambiguous results; improving backend feedback could enhance UX.
- Certain **dangerous input patterns** (e.g., script tags, SQL-like queries) were not consistently filtered — stronger backend sanitization is recommended.

## 🔐 Password Field Validation

This section of the QA suite verifies password input behavior on the registration form.

### 🧪 Test File

```
tests/password-field-validation.spec.ts
```

### 🎯 Objectives

Ensure the password field accepts only passwords that meet the defined security criteria, including:

- Minimum/maximum length
- Required character types (uppercase, lowercase, digits, special chars)
- Rejection of weak or incomplete passwords

---

### 🧠 Testing Logic

- Uses valid emails in both email fields to isolate password validation.
- On valid passwords:
  - Ensures the submit button is enabled.
  - Submits the form and checks for final success message.
- On invalid passwords:
  - Asserts that the submit button remains disabled, preventing submission.
