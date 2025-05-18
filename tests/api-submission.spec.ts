import { test, expect, request } from "@playwright/test";

test.describe("API Tests for form submission", () => {
  let apiContext;

  // array including all email accounts that have been blocked by the JS frontend validation
  const invalidEmailInputs = [
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
    "test@https://domain.com", // Invalid: domain with protocol
    "test@domain,com", // Invalid: comma in domain part
    "test@ domain.com", // Invalid: space in domain
    "test @domain.com", // Invalid: space in local
    " test@domain.com", // Invalid: leading space
    "test@domain.com ", // Invalid: trailing space
    "26characters-26@domain.com", // Invalid: too long
    "tes±sg@domain", // Invalid: plus-minus "±"
    "عنوانالبريالإلكتروني@domain.com", // Invalid: Arabic
    "כתובת אימייל@domain.com", // Invalid: Hebrew
    "ｔｅｓｔ＠ｅｘａｍｐｌｅ．ｃｏm", // Invalid: full-width Unicode
  ];

  // array including all password inputs that have been blocked by the JS frontend validation
  const invalidPassInputs = [
    "Sh0rt", // Invalid: too short
    "alllower1", // Invalid: no uppercase
    "NoDigits", // Invalid: no digit
    "123456", // Invalid: digits only
    "n0upper", // Invalid: no uppercase
    "onlylower", // Invalid: no uppercase and no digit
    "IUseLongInValidPass21", // Invalid: too long (21 characters)
    "👨🏾‍💻👩🏼‍⚕️👨🏿‍🔧👩🏻‍🍳👨🏼‍🏫👩🏾‍🏫👨🏽‍🚀👩🏽‍🚀👨🏻‍🚒👩🏿‍🚒👨🏾‍✈️👩🏼‍✈️👨🏽‍🎨👩🏻‍🎨👨‍🎤👩‍🎤👨🏽‍🔬👩🏾‍🔬👨🏿‍⚖️👩🏻‍⚖️", // Invalid: 20 emojis (80+ chars)
    "ááááááááááA1", // Invalid: 22 chars
  ];

  // Before all tests, create a shared request context
  test.beforeAll(async ({ playwright }) => {
    try {
      apiContext = await request.newContext();
    } catch (err) {
      console.error("Failed to create API context:", err);
      throw err;
    }
  });

  // cleans up shared context
  test.afterAll(async () => {
    await apiContext.dispose();
  });

  test("Valid submission: returns 200 OK and success message", async () => {
    const response = await apiContext.post(
      "https://abc13514.sg-host.com/api.php",
      {
        //passing valid data to api.php
        data: {
          email: "test@example.com",
          confirmEmail: "test@example.com",
          password: "StrongPassword123!",
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    //expect HTTP 200
    expect(response.status()).toBe(200);
  });

  test("Invalid submission: returns 400 OK", async () => {
    const response = await apiContext.post(
      "https://abc13514.sg-host.com/api.php",
      {
        //passing invalid data to api.php
        data: {
          email: "invalid-email",
          confirmEmail: "invalid-email",
          password: "StrongPassword123!",
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    //expect error
    expect(response.status()).toBe(400);
  });

  // passing invalid email accounts to api.php
  for (const input of invalidEmailInputs) {
    test(`Should reject invalid email: ${input}`, async () => {
      const response = await apiContext.post(
        "https://abc13514.sg-host.com/api.php",
        {
          data: {
            // email address from  invalidEmailInputs
            email: input,
            confirmEmail: input,
            // correct password
            password: "StrongPassword123!",
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // fail if response is 200, pass if 400
      expect(response.status()).toBe(400);
    });
  }

  // passing invalid passwords to api.php
  for (const input of invalidPassInputs) {
    test(`Should reject invalid password: ${input}`, async () => {
      const response = await apiContext.post(
        "https://abc13514.sg-host.com/api.php",
        {
          data: {
            // valid email addresses
            email: "valid@test.com",
            confirmEmail: "valid@test.com",
            // invalid password passed from invalidPassInputs
            password: input,
          },
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      // fail if response is 200, pass if 400
      expect(response.status()).toBe(400);
    });
  }

  test("DELETE request: should return 405 method not allowed", async () => {
    const response = await apiContext.delete(
      "https://abc13514.sg-host.com/api.php"
    );

    //expect HTTP 405
    expect(response.status()).toBe(405);
  });
  test("GET request: should return 405 method not allowed", async () => {
    const response = await apiContext.get(
      "https://abc13514.sg-host.com/api.php"
    );

    //expect HTTP 405
    expect(response.status()).toBe(405);
  });

  test("PUT request: should return 405 method not allowed", async () => {
    const response = await apiContext.put(
      "https://abc13514.sg-host.com/api.php",
      {
        data: {
          email: "test@example.com",
          confirmEmail: "test@example.com",
          password: "StrongPassword123!",
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    //expect HTTP 405
    expect(response.status()).toBe(405);
  });

  test("Invalid submission - should fail with 400 due to incomple JSON", async () => {
    const response = await apiContext.post(
      "https://abc13514.sg-host.com/api.php",
      {
        //passing invalid JSON to api.php
        data: {
          email: "test@example.com",
          confirmEmail: "test@example.com",
          // password: "StrongPassword123!", // missing password field
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    //expect HTTP 400
    expect(response.status()).toBe(400);
  });

  // Test with Content-Type different than JSON
  test("Invalid submission - application/xml, should fail with 400", async () => {
    const response = await apiContext.post(
      "https://abc13514.sg-host.com/api.php",
      {
        headers: {
          "Content-Type": "application/xml", // XML in header
        },
        // XML in body
        data: `
        <user>
          <email>test@example.com</email>
          <confirmEmail>test@example.com</confirmEmail>
          <password>StrongPassword123!</password>
        </user>
      `,
      }
    );

    // Expecting failure status if server validates content-type & body
    expect(response.status()).toBe(400);
  });
});
