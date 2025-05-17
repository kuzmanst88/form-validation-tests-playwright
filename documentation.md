# 📄 Test Documentation – Registration Form QA Automation

## 📘 1. Project Overview

This document provides detailed insights into the automated test suite developed for validating the registration form functionality at [https://abc13514.sg-host.com](https://abc13514.sg-host.com). The suite ensures front-end and API validations for the **email**, **confirm email** and **password**, using the Playwright framework.

---

## 🧪 2. Summary of the Test Files

| Test File                                 | Description                                      |
| ----------------------------------------- | ------------------------------------------------ |
| `registration-form-general-tests.spec.ts` | Covers general form behaviors and UI validations |
| `email-fields-input-validation.spec.ts`   | Validates email and confirm email field inputs   |
| `password-field-validation.spec.ts`       | Checks password validation rules                 |
| `api-submission.spec.ts`                  | Tests the final form submission and API response |

---

To ensure clarity and maintainability across all test files, a consistent approach was applied when defining selectors and variables for interacting with DOM elements:

<pre> 
emailInput = page.locator('[data-cy="email-input"]'); 
confirmEmailInput = page.locator('input[name="confirmEmail"]');
passwordInput = page.locator('[data-automation="password-field"]'); 
submitButton = page.locator("#submitBtn"); 
statusMessage = page.locator("#submission-status"); 
</pre>

---

## 🧠 3. Test Descriptions

### 🔹 3.1 `registration-form-general-tests.spec.ts`

- **Testing Logic**:
  - Covers general user interactions with the form.
  - Tests UI behaviors like field validation, empty field errors, submit button state, and password visibility toggle.
- **Objectives**:
  - Ensure fields are required before submission.
  - Submit button only activates when all fields are valid.
  - Password visibility toggle (👁️ / 🔒) works as expected.
- **Results & Observations**:
  - ✅ Error messages triggered appropriately for empty fields.
  - ✅ Toggle behavior accurately switches password visibility and icon state.
  - ✅ Submit button can only be used if all fields pass the JS validation.
  - ✅ Error message appears when email and confirmation email do not match.

---

### 🔹 3.2 `email-fields-input-validation.spec.ts`

- **Input Acceptance Criteria**:
  - Must be a valid email format
  - Maximum length: 25 characters
- **Testing Logic**:
  - Runs positive and negative test cases on the email fields.
  - Tests valid email formats and known invalid patterns (e.g., missing "@" or domain).
- **Objectives**:
  - Prevent invalid email formats.
  - Ensure mismatch in email and confirm-email fields triggers an error.
- **Results & Observations**:
  - ✅ All valid emails accepted, invalid ones correctly rejected.

---

### 🔹 3.3 `password-field-validation.spec.ts`

- **Input Acceptance Criteria**:
  - Length must be between 6-20 characters
  - Must contain at least one capital letter
  - Must contain at least one digit
- **Testing Logic**:
  - Runs validation on password strength rules including required characters, length, and complexity.
  - Separates valid and invalid cases.
- **Objectives**:
  - Enforce password policies: minimum 6 characters, at least 1 uppercase, 1 lowercase, and 1 digit.
  - Ensure weak passwords disable submission.
- **Results & Observations**:
  - ✅ Valid passwords allowed submission.
  - ❌ Invalid passwords (e.g., only lowercase or too short) kept the submit button disabled.
  - No backend request was sent for invalid cases.

---

### 🔹 3.4 `api-submission.spec.ts`

- **Acceptance Criteria**:

- **Testing Logic**: Simulates a full form submission with valid credentials and checks for a successful backend response message.
- **Objectives**:
  - Ensure backend registration response is triggered correctly.
  - Confirm user sees a success message upon submission.
- **Results & Observations**:
  - ✅ Passed with `Registration successful!` message visible post-submit.
  - Validated that no errors occurred on successful flow.

---

## 📚 4. Notes & Best Practices

- Tests are **isolated**, repeatable, and run reliably in both headless and headed modes.
- Uses Playwright’s **polling and timeout features** to handle dynamic UI states.
- Clear use of `beforeEach` to minimize duplication and ensure consistent setup.

---

## 📎 5. References

- [Playwright Documentation](https://playwright.dev/)
- [Project README](./README.md)
