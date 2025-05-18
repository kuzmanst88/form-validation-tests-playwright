import { test, expect } from "@playwright/test";

test.describe("Email Fields Validation", () => {
  // Define all variables
  let emailField, confirmEmailField, passwordField, submitButton, emailError;

  const validInputs = [
    "user@test.com", // Valid: lowercase only
    "UseR@tEsT.cOm", // Valid: lower/upper letters
    "USER@TEST.COm", // Valid: upper letters ONLY
    "us34r@number.com", // Valid: numbers in local-part
    "user-test@domain.com", // Valid:hyphen in local-part
    "user.name@domain.com", // Valid: dot in local-part
    "name.surname@domain.co.uk", // Valid: multiple dots in local-part + different TLD
    "user+tag@domain.com", // Valid: plus sign in local-part
    "tes_@domain.com", // lValid: ocal part ends with underscore
    "us.er@domain.info", // Valid: dot in local part + .info TLD
    "john_doe@domain.net", // Valid: underscore in local-part
    "us+mail/dpt=ship@mail.com", // Valid: +, / and = in local part
    "foo_bar@do-main.com", // Valid: underscore and hyphen
    "user@company.corporate", // Valid: custom domain TLD
    "tes#t@domain.com", // Valid: hash "#" in local part
    "tes$t@domain.com", // valid: dollar sign "$" in local part
    "tes%t@domain.com", // Valid: percent "%" in local part
    "tes&t@domain.com", // Valid: ampersand "&" in local part
    "tes*t@domain.com", // Valid: asterisk "*" in local part
    "tes/t@domain.com", // Valid: slash "/" in local part
    "tes^t@domain.com", // Valid: caret "^" in local part
    "tes|t@domain.com", // Valid: vertical bar "|" in local part
    "tes~t@domain.com", // Valid: tilde "~"  in local part
    "tes!t@domain.com", // Valid: exclamation mark "!" in local part
    "tes`@domain.com", // Valid: backtick "`" in local part
    //Domain formats
    "user@123a.com", // Valid: numbers in domain part
    "user@domain-example.com", // Valid: hyphen in domain
    "test@sub.domain.com", // Valid: subdomain
    "test@sub.sub.domain.com", // Valid: second level subdomain
    "user@domain.travel", // Valid: .travel TLD
    "user@xn--d1acpjx.xn--p1ai", // Valid: Punycode for Cyrillic domain
    //test MAX_EMAIL_LENGTH
    "25characters25@domain.com", //Valid: 25 characters
    "a@b.c", // Valid: minimal valid email
  ];

  const invalidInputs = [
    //invalid formats
    "Joe Smith <email@example.com>", //Invalid:
    "plainaddress", // Invalid: text only
    "Abc.example.com", //Invalid: missing @
    "domain.com", // Invalid: domain only
    "test@@domain.com", // Invalid: double @@
    "user@user@domain.com", // Invalid:@ in local part
    "@no-local-part.com", // Invalid: missing local part
    "test@test", //Invalid: missing TLD and dot
    "test@domain.", // Invalid: missing tld
    "test@.", // Invalid: missing domain and tld
    "test@.com", // Invalid: missing domain
    "no-domain@", // Invalid: missing domain part
    //invalid domain
    "test@https://domain.com", // Invalid: domain with protocol
    "test@domain..com", // Invalid: 2 dots in domain part
    "test@domain,com", // Invalid: comma in domain part
    "test@domain.com.", // Invalid: trailing dot

    "user@domain.123", // Invalid: numbers in tld
    "user@-domain.com", // Invalid: domain starting with hyphen
    "test@domain-.com", // Invalid: domain ending with hyphen
    "user@domai_n.com", // Invalid: underscode in domain part
    "user@domai+n.com", // Invalid: underscode in domain part
    "test@do#main.com", // Invalid: hash "#" in domain part
    "test@do$main.com", // Invalid: dollar sign "$" in domain part
    "test@do%main.com", // Invalid: percent "%" in domain part
    "test@do&main.com", // Invalid: ampersand "&" in domain part
    "test@do*main.com", // Invalid: asterisk "*" in domain part
    "test@do/main.com", // Invalid: slash "/" in domain part
    "test@do^main.com", // Invalid: caret "^" in domain part
    "test@do|main.com", // Invalid: vertical bar "|" in domain part
    "test@do~main.com", // Invalid: tilde "~"  in domain part
    "test@do!main.com", // Invalid: exclamation mark "!" in domain part
    "tes@do`main.com", // Invalid: backtick "`" in domain part
    "test@127.0.0.1", //  Invalid: IP address
    "test@localhost", //  Invalid: localhost
    //white spaces
    "test@ domain.com", // Invalid: space in domain
    "test @domain.com", // Invalid: space in local
    " test@domain.com", // Invalid: leading space
    "test@domain.com ", // Invalid: trailing space
    " ", // Invalid:  space only
    //invalid characters
    "test..test@domain.com", // Invalid: 2 consecutive dots
    ".test@domain.com", // Invalid: 2 leading dot
    "test.@domain.com", // Invalid: dot before @
    "test@[127.0.0.1].com",
    "tes±sg@domain", // Invalid: plus-minus "±"
    "tes❤️t@domain.com", // Invalid: emoji "❤️"
    "tes:t@domain.com", // Invalid: colon ":"
    "tes§t@domain.com", // Inavlid section sign "§"
    "tes;@domain.com", // Invalid: semicolon ";"
    "tes<@domain.com", // Invalid: less-than "<"
    "tes>@domain.com", // Invalid: greater-than ">"
    "tes,@domain.com", // Invalid: comma ","
    "tes@[domain.com", // Invalid: square bracket "["
    "tes]@domain.com", // Invalid: square bracket "]"
    "tes\\@domain.com", // Invalid: backslash "\\"
    'tes"@domain.com', // Invalid: double quote "\""
    "tes<example@domain.com", // Invalid: less-than "<"
    "tes(abc@domain.com", // Invalid: parenthesis "("
    "tes)abc@domain.com", // Invalid: parenthesis ")"
    "tes’abc@domain.com", // Invalid: apostrophe "’" Typewriter
    //country-specific
    "あいうえお@domain.com", // Invalid: Japan
    "عنوان البريد الإلكتروني@domain.com", // Invalid: Arabic
    "כתובת אימייל@domain.com", // Invalid: Hebrew
    "señorita@example.com", // Invalid: Spanish;
    "über@test.com", // Invalid: German
    "têst@tãst.com", // Invalid: Portuguese
    "tåst@test.com", // Invalid: scandinavian
    "twst@tłst.com", // Invalid: Polish in domain
    "кирилица@домейн.ком", // Invalid: Cyrillic
    //Control Characters
    "te\u0000st@domain.com", // Invalid: NULL (U+0000)
    "test@domain\n.com", // Invalid: new line in domain
    "test@domain.com\n", // Invalid: new line trailing
    "\ttest@domain.com", // Invalid: tabulation
    "ｔｅｓｔ＠ｅｘａｍｐｌｅ．ｃｏm", // Invalid: full-width Unicode
    //test MAX_EMAIL_LENGTH
    "26characters-26@domain.com", //Invalid: 26 characters (too long)
    //Security checks
    "<script>u@n.co", // Invalid: <script>
    "a\u003Cscript\u003Eu@n.co", //Invalid: Unicode <script>
    "&lt;script&gt;u@n.co", //Invalid: HTML <script>
    "user'%20OR%201=1--@dn.com", // Invalid:  MySQL injection threat
    "u'%09OR%091=1--@domain.co", // Invalid:  MySQL injection threat
    "us'/**/OR/**/1=1--@ex.co", // Invalid:  MySQL injection threat
    "a'OR'1'='1@x.io", // Invalid:  MySQL injection threat
    "SHOW/**/TABLES--@x.a", // Invalid: several MySQL injection threat
    "../../../etc/passwd@d.c", // Invalid: Directory traversal
    "..\\windows\\system32@x.com", // Invalid: Windows path traversal
    "user@example.com'--", // Invalid: Comment Injection
    "user@example.com/*", // Invalid:Comment Injection
    'user@example.com"', //Invalid: Broken Quotes
  ];

  test.beforeEach(async ({ page }) => {
    await page.goto("https://abc13514.sg-host.com/");

    // give values to variables
    emailField = page.locator('[data-cy="email-input"]');
    confirmEmailField = page.locator('input[name="confirmEmail"]');
    passwordField = page.locator('[data-automation="password-field"]');
    submitButton = page.getByRole("button", {
      name: "Complete Registration",
    });
    emailError = page.locator("#emailError");
  });

  /* For loop testing VALID INPUTS */

  for (const input of validInputs) {
    test(`should accept valid input "${input}"`, async ({ page }) => {
      //Fill the valid accounts to both email fields
      await emailField.fill(input);
      await confirmEmailField.fill(input);

      // use valid password
      await passwordField.fill("StrongPass123!");
      const isBtnDisabled = await submitButton.isDisabled();

      if (isBtnDisabled) {
        // Expect validation error on email, test is over as btn can not be submitted
        await expect(emailError).toHaveText(
          /(Email is required|Please enter a valid email address|Confirm your email address)/
        );

        throw new Error("JS validation error detected");
      } else {
        // JS validation passed — try to submit, expect rejection
        // Click the btn and wait for status message
        await submitButton.click();
        const statusMessage = page.locator("#submission-status");

        // wait until the status message is different than "processing"
        await expect
          .poll(
            async () =>
              (await statusMessage.textContent())?.trim().toLowerCase(),
            {
              timeout: 3000,
              message: "Waiting for final submission status",
            }
          )
          .not.toBe("processing...");
        // check final status
        const finalStatusText = (await statusMessage.textContent())
          ?.trim()
          .toLowerCase();

        //  Pass if registration is successful
        expect(finalStatusText).toMatch(/Registration successful/i);
      }
    });
  }

  /* For loop testing  INVALID INPUTS */

  for (const input of invalidInputs) {
    test(`should reject invalid input "${input}"`, async ({ page }) => {
      // Use invalid accounts in both email fields
      await emailField.fill(input);
      await confirmEmailField.fill(input);

      // Use correct password
      await passwordField.fill("StrongPass123!");

      //check if btn is disabled
      const isDisabled = await submitButton.isDisabled();

      if (isDisabled) {
        // Expect validation error on email, test is over as btn can not be submitted
        await expect(emailError).toHaveText(
          /(Email is required|Please enter a valid email address|Email must not exceed 25 characters)/
        );
        // console.log(`Email correctly rejected: "${input}"`); // will use this temporarily to identify emails rejected by the JS validation
      } else {
        // JS validation allowed it — try to submit, expect rejection
        // Click the btn and wait for status message
        await submitButton.click();
        const statusMessage = page.locator("#submission-status");

        // wait until the status message is different than "processing"
        await expect
          .poll(
            async () =>
              (await statusMessage.textContent())?.trim().toLowerCase(),
            {
              timeout: 3000,
              message: "Waiting for final submission status",
            }
          )
          .not.toBe("processing...");

        // check final status
        const finalStatusText = (await statusMessage.textContent())
          ?.trim()
          .toLowerCase();

        //  Pass if registration failed
        expect(finalStatusText).toMatch(/validation failed|error|invalid/i);
      }
    });
  }
});
