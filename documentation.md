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

- **Overview**:
  - Covers general user interactions with the form.
  - Tests UI behaviors like field validation, empty field errors, submit button state, and password visibility toggle.
- **Expectations**:
  - Valid input is required by all fields before submission
  - Submit button only activates when all fields are valid.
  - Ensure mismatch in email and confirm-email fields triggers an error.
  - Password visibility toggle (👁️ / 🔒) works as expected.
- **Results**:
  - ✅ Error messages triggered appropriately for empty fields.
  - ✅ Toggle behavior accurately switches password visibility and icon state.
  - ✅ Submit button can only be used if all fields pass the JS validation.
  - ✅ Error message appears when email and confirmation email do not match.
- **Testing logic and Observations**:

The script covers general behavior tests. The first test verifies that the form can only be submitted if the Email and Email Confirm fields contain the same input value. I used three different confirm email scenarios, and one of them failed the test. The form incorrectly accepted the inputs as equal when one of the email fields contained a trailing space. I believe this is due to the use of the trim() function in the JavaScript validation. I tested the same scenario during the API tests and confirmed that the submission was blocked, which means the error can be disregarded.

At page load, the Confirm button is in an "enabled" state, despite empty fields. The second test verifies that the form does not accept submissions in this state. No issues were observed.

The purpose of the third test is to verify that the Confirm button remains disabled until all fields pass the validation checks.

The final test confirmed that the password toggle button reveals and hides the password correctly, with no issues detected.

---

### 🔹 3.2 `email-fields-input-validation.spec.ts`

- **Input Acceptance Criteria**:
  - Must be a valid email format
  - Maximum length: 25 characters
- **Expectations**:
  - Tests on valid email formats should pass if message for succesful form submission is displayed
  - For invalid submissions, the test is passed if JS validation error is triggered in the email field or by the submit button
- **Results**:
  - ✅ All valid emails have been accepted
  - ❌ The form accepts several maliciously crafted email addresses that resemble SQL injection payloads
- **Testing logic and Observations**:

This script validates the email input handling of the registration form. It tests a wide range of valid and invalid email formats to ensure the frontend's JavaScript validation and server-side logic behave as expected. The script fills both the "Email" and "Confirm Email" fields with test inputs, uses a valid password, and attempts to submit the form. For valid inputs, it verifies successful registration, while for invalid inputs, it checks that the form either disables the submission button or displays appropriate error messages.

It appears that the definition of a valid email address could vary depending on the email provider. During my initial tests, I noticed that the form accepts submissions with email addresses that include special characters (e.g., ! # $ % & ' \* / ? ^ \_ { | } ~ -). Such characters are not allowed by many providers, including SiteGround. At first, I included them as invalid submissions. However, these signs are allowed to be included in the local part, according to RFC5322, which is why I decided to consider invalid only email addresses that include such characters in the domain part.

According to the results of the tests, the form accepts the following email accounts as valid inputs:

<pre><code>```text user'%20OR%201=1--@dn.com 
u'%09OR%091=1--@domain.co 
us'/**/OR/**/1=1--@ex.co 
a'OR'1'='1@x.io 
SHOW/**/TABLES--@x.a ```</code></pre>

These inputs contain SQL injection patterns embedded within the email string. If not properly sanitized on the backend, such inputs could exploit database queries—potentially exposing, modifying or deleting sensitive data.

It also allows submissions with email accounts that include leading or trailing spaces. This issue appears to be covered by the trim() used in the JS validation, but additional checks will be performed during the API tests.

---

### 🔹 3.3 `password-field-validation.spec.ts`

- **Input Acceptance Criteria**:
  - Length must be between 6-20 characters
  - Must contain at least one capital letter
  - Must contain at least one digit
- **Expectations**:
  - Tests on valid passwords should pass if successful message is displayed following the form submission
  - Tests on invalid passwords should pass if validation error is triggered after input or after form submission
- **Objectives**:
  - Ensure weak, long passwords or unusual characters are not accepted
- **Results**:
  - ✅ All valid passwords passed the test
  - ❌ The form accepts empty spaces in the password field, which allows the usage of weak passwords. Some unusal characters can be used too
- **Testing logic and Observations**:

Similarly to the email input tests, I added valid and invalid password examples to different arrays. Then I used two "for" loops to go through all password examples and check their validity. It is not explicitly specified in the requirements that the password must contain lower case letters, so the script accepts such passwords as valid (example: ONLYUPPER123).

The following tests have failed:

- the password field allows the submission of HTML code
- it allows the usage of empty spaces, which could potentially be used to execute MySQL queries.
- It also allows submitting extremely weak passwords such as " B1" (4 empty spaces followed by capital letter and a digit)
- It allows submissions of emojis

Even though it allows the submission of unusual characters, the characters limit could not be exceeded.

---

### 🔹 3.4 `api-submission.spec.ts`

- **Acceptance Criteria**:
  - Accepts only POST requests
  - Content-type: application/json
  - Request body must include "email", "confirmEmail" and "password" fields
- **Overview**: Simulates a full form submission with valid credentials and checks for a successful backend response message. The primary goal is to test server-side validation for submissions that fail the JS validation.
- **Objectives**:
  - Ensure backend registration response is triggered correctly.
  - Confirm user HTTP 200 response code is returned to all valid submissions and 400 for invalid ones
- **Results**:
  - ✅ Passed with `Registration successful!` message visible post-submit.
  - Validated that no errors occurred on successful flow.
- **Testing logic and Observations**:

My plan here was to ensure that api.php accepts valid requests only (POST, json format, request body elements). I also wanted to test if emails and passwords that fail during the frontend JS validation can not be submitted with api calls.

At first, I ran two simple tests to verify that submissions with correct format and registration details will receive 200 response. The second test verifies that an error will lead to 400.

Next, I decided to test all email accounts that have been blocked by the form's JS validation script. I temporarily added console.log() right after the assertation where the JS validation blocks invalid emails to help me generate a list of such accounts. Then I added them to an array in api-submission.spec.ts and used for loop to perform the validation tests. Submissions using all of these invalid accounts have been blocked, inlcuding the ones with leading/trailing slashes I described in the email-fields-input-validation.spec.ts part.

I used similar approach with the passwords - all passwords blocked by the JS validation have been tested via api calls. No errors detected. A for loop goes through an array of invalid passwords and tests each one of them with valid email and confirm email. The test is only successful if api.php returns 400.

Finally, I performed tests to verify the form would not accept requests:

- The only supported request method is POST: submissions with GET, PUT and DELETE failed with 405 error.
- It does not accept request with incomplete JSON (returns 400)
- It does not accept requests if Cntent-type is not JSON

## 🏁 Conclusion

The automated test suite successfully verifies the registration form’s core functionalities across frontend and backend layers. Frontend validations effectively prevent most invalid inputs and guide user interactions, while API tests confirm robust backend enforcement of critical rules.

However, some gaps remain: email fields accept potentially malicious SQL injection-like inputs and password fields allow weak or unconventional entries such as spaces and emojis. These vulnerabilities should be addressed to strengthen security.

In addition, there are instances of PHP code displayed as text in the HTML souce code, such as:

<pre><code>``` data-auto-gen="email-field-<?php echo rand(1000, 9999); ?>">
 ```</code></pre>

It looks like a function to dynamically regenerate the id on each refresh. This usually happens if you try to run PHP code in .HTML files.

Future work should focus on enhancing input sanitization.
