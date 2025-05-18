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
// Email field, Email confirm and Password
emailField = page.locator('[data-cy="email-input"]'); 
confirmEmailField = page.locator('input[name="confirmEmail"]');
passwordField = page.locator('[data-automation="password-field"]'); 
// "Confirm" button
submitButton = page.getByRole("button", {name: "Complete Registration",  });
// JS validation errors
emailError = page.locator("#emailError");
confirmEmailError = page.locator("#confirmEmailError");
passwordError = page.locator("#passwordError");
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
  - ✅ All valid emails have been accepted
  - ❌ The form accepts several maliciously crafted email addresses that resemble SQL injection payloads

This script validates the email input handling of the registration form. It tests a wide range of valid and invalid email formats to ensure the frontend's JavaScript validation and server-side logic behave as expected. The script fills both the "Email" and "Confirm Email" fields with test inputs, uses a valid password, and attempts to submit the form. For valid inputs, it verifies successful registration, while for invalid inputs, it checks that the form either disables the submission button or displays appropriate error messages.

It appears that the definition of a valid email address could vary depending on the email provider. During my initial tests, I noticed that the form accepts submissions with email addresses that include special characters (such as ! # $ % & ' \* + / = ? ^ \_ { | } ~ -`). Such characters are not allowed by many providers, including SiteGround. At first, I included them as invalid submissions. However, these signs are allowed to be included in the local part, according to RFC5322, which is why I decided to consider invalid only email addresses that include such characters in the domain part.

According to the results of the tests, the form accepts the following email accounts as valid inputs:

user'%20OR%201=1--@dn.com

u'%09OR%091=1--@domain.co

us'/**/OR/**/1=1--@ex.co

a'OR'1'='1@x.io

SHOW/\*\*/TABLES--@x.a

These inputs contain SQL injection patterns embedded within the email string. If not properly sanitized on the backend, such inputs could exploit database queries—potentially exposing, modifying or deleting sensitive data.

---

### 🔹 3.3 `password-field-validation.spec.ts`

- **Input Acceptance Criteria**:
  - Length must be between 6-20 characters
  - Must contain at least one capital letter
  - Must contain at least one digit
- **Testing Logic**:
  - Runs validation on password strength rules including required characters, length, and complexity.
  - Separates valid and invalid cases into different arrays.
- **Objectives**:
  - Ensure weak, long passwords or unusual characters are not accepted
- **Results & Observations**:
  - ✅ Valid passwords allowed submission.
  - ❌ The form accepts empty spaces in the password field, which allows the usage of weak passwords

I performed tests with all available scenarios and can confirm all valid cases passed successfully. The only case I was unsure about are passwords that only contain digits and upper case letters. It is not explicitly specified that the password must contain lower case letters, so the script accepts such passwords as valid (example: ONLYUPPER123).

The following tests have failed:

- the form allows the submission of HTML code
- it allows the usage of empty spaces, which could potentially be used to execute MySQL queries. It also allows submitting extremely weak passwords such as " B1"

---

### 🔹 3.4 `api-submission.spec.ts`

- **Acceptance Criteria**:
  - Accepts only POST requests
  - Content-type: application/json
  - Request body must include "email", "confirmEmail" and "password" fields
- **Testing Logic**: Simulates a full form submission with valid credentials and checks for a successful backend response message. The primary goal is to test server-side validation for submissions that pass the JS validation.
- **Objectives**:
  - Ensure backend registration response is triggered correctly.
  - Confirm user HTTP 200 response code is returned to all valid submissions and 400 for invalid ones
- **Results & Observations**:
  - ✅ Passed with `Registration successful!` message visible post-submit.
  - Validated that no errors occurred on successful flow.
