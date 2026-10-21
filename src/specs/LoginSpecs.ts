import { expect } from "@wdio/globals";
import LoginPage from "../pages/LoginPage";
import ProductPage from "../pages/ProductPage";
import { invalidLogins, PASSWORD, users } from "../data/users";

describe("Login Tests", () => {
  // Login tests start from a fresh login page, so loginAsStandardUser() is not used here
  beforeEach(async () => {
    await browser.reloadSession();
    await LoginPage.open();
    await LoginPage.loginButton.waitForDisplayed();
  });

  // ---------- Step 1: Login with all users ----------

  // TC-L01 to TC-L04: one login test per user in users.ts
  for (const user of users) {
    it(`${user.id}: login with ${user.username}`, async () => {
      await LoginPage.login(user.username, PASSWORD);

      if (user.canLogin) {
        await expect(ProductPage.pageTitle).toBeDisplayed();
      } else {
        await expect(LoginPage.errorMessage).toHaveText(user.expectedError!);
      }
    });
  }

  // ---------- Additional Coverage----------

  // TC-L05 to TC-L09: one test per invalid login case in users.ts
  for (const data of invalidLogins) {
    it(`${data.id}: shows error for ${data.case}`, async () => {
      await LoginPage.login(data.username, data.password);
      await expect(LoginPage.errorMessage).toHaveText(data.expectedError);
    });
  }
});
