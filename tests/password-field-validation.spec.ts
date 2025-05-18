import { test, expect } from "@playwright/test";

test.describe("Password Validation Tests", () => {
  // define all variables, to be re-used later in each test
  let emailField;
  let confirmEmailField;
  let passwordField;
  let submitButton;
  let statusMessage;
  let finalStatusText;
  let passwordError;

  // Define valid inputs
  const validPass = [
    "Str0ngPaSs1", // Valid pass
    "Val1dPass", // Valid: only one digit
    "Passw0rd0k", // Valid: only one uppercase
    "A1C2C3d4", // Valid:  one lowercase
    "Va1@#$%^&*()_-=+{}[]", // Valid: special characters
    'Va1:;"|\\/?.>,<±§~', //Valid: more special characters
    "Pass12", // Valid: short but valid (6 chars)
    "PaswdTwentyCharsL0ng", // Valid: long but valid (20 chars)
    "ALLUPPER1", // ??Valid?? no lowercase (not explicitly required to include lowercase letter)
  ];

  // define invalid inputs
  const invalidPass = [
    "Sh0rt", // Invalid: too short
    "alllower1", // Invalid: no uppercase
    "NoDigits", // Invalid: no digit
    "123456", // Invalid: digits only
    "n0upper", // Invalid: no uppercase
    "onlylower", // Invalid: no uppercase and no digit
    "    A1", // invalid: 4 spaces, digt and uppercase
    // password length
    "IUseLongInValidPass21", // Invalid: too long (21 characters)
    "Em😀J1", // Invalid: emoji
    "👨🏾‍💻👩🏼‍⚕️👨🏿‍🔧👩🏻‍🍳👨🏼‍🏫👩🏾‍🏫👨🏽‍🚀👩🏽‍🚀👨🏻‍🚒👩🏿‍🚒👨🏾‍✈️👩🏼‍✈️👨🏽‍🎨👩🏻‍🎨👨‍🎤👩‍🎤👨🏽‍🔬👩🏾‍🔬👨🏿‍⚖️👩🏻‍⚖️", // Invalid: 20 emojis (80+ chars)
    "ááááááááááA1", // Invalid: 22 chars
    "ｔｅｓWｔｅｘａｍ1", // Invalid: full-width chars
    //Security tests
    "<script>A1</script>", // HTML code
    "A1' or '1'='1", // SQL injection
    "A1\tB2", // new line
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto("https://abc13514.sg-host.com/");

    // give values to "Email" and "Confirm Email"
    emailField = page.locator('[data-cy="email-input"]');
    confirmEmailField = page.locator('input[name="confirmEmail"]');

    // give value to password field and the btn
    passwordField = page.locator('[data-automation="password-field"]');
    submitButton = page.locator("#submitBtn");

    // Fill email fields
    await emailField.fill("valid-email@domain.com");
    await confirmEmailField.fill("valid-email@domain.com");

    // Give value to the submission status message
    statusMessage = page.locator("#submission-status");
    // value for password error
    passwordError = page.locator("#passwordError");
  });

  /*test valid password inputs */

  for (const input of validPass) {
    test(`Should accept valid password ${input}`, async ({ page }) => {
      // Add valid password to the field and await the button to be enabled
      await passwordField.fill(input);
      await expect(submitButton).toBeEnabled();

      // click the button and wait for the status to change from "processing..." to valid/error state
      await submitButton.click();

      await expect
        .poll(
          async () => (await statusMessage.textContent())?.trim().toLowerCase(),
          {
            timeout: 3000,
            message: "Waiting for final submission status",
          }
        )
        .not.toBe("processing...");
      finalStatusText = (await statusMessage.textContent())
        ?.trim()
        .toLowerCase();

      expect(finalStatusText).toMatch("registration successful!");
    });
  }

  /*test invalid password inputs */

  for (const input of invalidPass) {
    test(`Should reject invalid password "${input}"`, async ({ page }) => {
      await passwordField.fill(input);

      const isBtnDisabled = await submitButton.isDisabled();

      if (isBtnDisabled) {
        await expect(passwordError).toBeVisible();
        await expect(passwordError).toHaveText(
          /(Password is required|Password must be between 6 and 20 characters|Password must contain at least one digit|Password must contain at least one capital letter)/
        );
        console.log(`P: ${input}`);
      } else {
        // Click submit
        await submitButton.click();

        // Wait for final status
        await expect
          .poll(
            async () =>
              (await statusMessage.textContent())?.trim().toLowerCase(),
            {
              timeout: 5000, // slightly longer as 3000 is not always enough
              message: "Waiting for final submission status",
            }
          )
          .not.toBe("processing...");

        finalStatusText = (await statusMessage.textContent())
          ?.trim()
          .toLowerCase();

        // Check for either a validation error message or a non-success result
        expect(finalStatusText.includes("validation failed")).toBeTruthy();
      }
    });
  }
});
