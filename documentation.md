## ✅ Testing Strategy & Approach

This test suite is organized into four categories:

### 1. General Registration Form Behavior

**Test File**: `tests/registration-form-general-tests.spec.ts`

- Checks that an error is shown when Email and Confirm Email fields contain different values
- Ensures submitting with empty fields shows proper validation messages.
- Ensures the submit button remains disabled until all three fields are valid:
- Simulates toggling visibility of the password input

### 2. Email Fields Input Validation

**Test File**: `tests/email-fields-input-validation.spec.ts`

This test focuses on validating user input in the **email** and **confirm email** fields during registration.

- ✅ Valid email patterns including:

  - Lowercase/uppercase usage
  - Special characters (e.g., `+`, `.`, `-`,)
  - Subdomains and various TLDs
  - Edge-length boundaries

- ❌ Invalid formats including:
  - Malformed or incomplete addresses
  - Forbidden characters
  - Control characters and whitespace
  - Localization & Unicode edge cases
  - Common security exploits (SQL injection, XSS, path traversal)

### 3. Password Field Input Validation

**Test File**: `tests/password-field-validation.spec.ts`

This section of the QA suite verifies password input behavior on the registration form. It ensures the password field accepts only passwords that meet the defined security criteria, including:

- Minimum/maximum length
- Required character types (uppercase, lowercase, digits, special chars)
- Rejection of weak or incomplete passwords

### 4. API Submission & Response Handling

**Test File**: `tests/api-submission.spec.ts`

Directly tests the /api.php endpoint. Sends raw POST requests simulating form submission.

Validates:

- Correct request returns HTTP 200 with success.
- Invalid formats return HTTP 400 with "Validation failed" message.
- includes tests for email accounts and passwords that pass the JS frontend validation.
