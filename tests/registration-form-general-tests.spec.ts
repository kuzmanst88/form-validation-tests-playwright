import { test, expect } from "@playwright/test";

test.describe("User Registration Form", () => {
  // define variables
  let emailField,
    confirmEmailField,
    emailError,
    confirmEmailError,
    submitButton,
    passwordField,
    passwordError;

  // 3 different inputs for the confirm email field to test if
  const confirmEmailInputs = [
    "different@example.com", // completely different account
    "uSEr@example.com", // the same email using uppercase letters
    " user@example.com ", // the same email using trailing slash
    "uSEr@example.com%20", // the same email using uppercase letters
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto("https://abc13514.sg-host.com/");

    // assign values to all variables
    emailField = page.locator('[data-cy="email-input"]');
    confirmEmailField = page.locator('input[name="confirmEmail"]');
    emailError = page.locator("#emailError");
    confirmEmailError = page.locator("#confirmEmailError");
    submitButton = page.getByRole("button", {
      name: "Complete Registration",
    });
    passwordField = page.locator('[data-automation="password-field"]');
    passwordError = page.locator("#passwordError");
  });

  for (const input of confirmEmailInputs) {
    test(`Should show validation error for non-matching confirmation email ${input}`, async ({
      page,
    }) => {
      // use different valid emails to trigger error
      await emailField.fill("user@example.com");
      await confirmEmailField.fill(input);

      // Expect error message to appear
      await expect(confirmEmailError).toContainText("Emails do not match");
      await expect(submitButton).toBeDisabled();
    });
  }

  test("should check error handling if you submit empty input", async ({
    page,
  }) => {
    // Click the  "Confirm" button
    await submitButton.click();

    // Expect error message to be visible and test JS error handling
    await expect(emailError).toContainText(/Email is required/i);

    // Expect error message to be visible and test JS error handling
    await expect(confirmEmailError).toContainText(/Please confirm your email/i);

    // Expect error message to be visible and test JS error handling
    await expect(passwordError).toContainText(/Password is required/i);
  });

  test("Submit button should not be enabled before valid input is added to all fields", async ({
    page,
  }) => {
    // Initial state: btn should be enabled before any interaction
    await expect(submitButton).toBeEnabled();

    // Type a single character in one field to trigger validation
    await emailField.fill("a");
    await expect(submitButton).toBeDisabled();

    // Enter valid email only
    await emailField.fill("test@example.com");
    await expect(submitButton).toBeDisabled();

    // Add matching confirm email (now 2 fields are valid)
    await confirmEmailField.fill("test@example.com");
    await expect(submitButton).toBeDisabled();

    // Add valid password (all 3 fields valid) and expect button to be enabled
    await passwordField.fill("StrongPass123!");
    await expect(submitButton).toBeEnabled();
  });

  test("should toggle password visibility by clicking the eye/lock icon", async ({
    page,
  }) => {
    // Locate and click the "eye" icon to show password
    const togglePasswordBtn = page.locator(".toggle-password-btn");
    // verify that the type is initially set to password
    await expect(passwordField).toHaveAttribute("type", "password");

    // click on the password visibility icon
    await togglePasswordBtn.click();

    // check if the type has changed to text and the icon to lock
    await expect(passwordField).toHaveAttribute("type", "text");
    await expect(togglePasswordBtn).toHaveText("🔒");
    await page.waitForTimeout(500); //only use to slow down the process in UI for better visibility, will remove this later

    //click on the icon once again and check if the type and icon will reset to default
    await togglePasswordBtn.click();
    await expect(passwordField).toHaveAttribute("type", "password");
    await expect(togglePasswordBtn).toHaveText("👁️");
  });
});
