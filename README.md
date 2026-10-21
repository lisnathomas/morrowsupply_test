# Morrow Supply – Automation Tests

This project has the automated UI tests I wrote for the Morrow Supply web shop (https://qa-task--oyettijon.replit.app). It uses WebdriverIO with TypeScript and follows the Page Object Model.

I covered login, the products page (count, filter, sort), the cart, pricing, checkout, and a few mobile tests. The bugs I found are written up in [BUGS.md](BUGS.md).

## Tools used

- WebdriverIO v9
- TypeScript
- Mocha
- Allure for the HTML report
- Chrome (desktop, and mobile emulation for iPhone 16)

## Setup

You need Node.js 18 or newer and Chrome. Java is only needed if you want to open the Allure report.

After cloning the repo, install the packages from the project folder:

```bash
npm install
```

## Running the tests

Run all desktop tests:

```bash
npm run wdio
```

Run the mobile tests:

```bash
npm run wdio:mobile
```

Run just one file:

```bash
npm run wdio -- --spec src/specs/CartSpecs.ts
```

Open the Allure report after a run:

```bash
npm run report
```

I also added a slow mode, so the run can be followed on screen. It pauses for 1 second before each step and 3 seconds after each test:

```powershell
$env:SLOW="1"; npm run wdio
```

To turn it off: `Remove-Item Env:SLOW`

## Folder structure

```
src/
  pages/              one class per page with its locators and actions
  specs/              the tests, one file per feature
    mobile/           mobile tests
  data/               test data (users, products, cart, checkout)
  utils/              shared code
    helpers.ts        login step and total calculation
    currency.ts       turns money text like "$44.99" into a number
wdio.conf.ts          desktop config
wdio.mobile.conf.ts   mobile config, built on top of the desktop one
README.md             setup and test cases
BUGS.md               bug tickets
```

`Header.ts` is separate from the other pages because the cart button and badge show on every page.

## How I built it

**Page objects.** Each page has its own class, and the tests only call methods from these classes. If a locator changes, I only need to fix it in one place.

**Locators.** I used "data-test" attributes wherever the site has them, since they are meant for testing and don't change when the styling changes. The login fields use their id. The "items to explore" text has no data-test or id, so that is the only locator that uses visible text. For the cart rows I used "starts with" on the data-test value, because each row has the product number at the end.

**Test data.** Users, expected counts, sort options, shipping details, the tax rate and the expected messages are all in the src/data folder, not inside the tests. Login, filter, sort and checkout error tests loop over this data, so a new case only needs one new line. The checkout field names are typed, so a typo is caught in the editor before the test runs.

**Shared code.** Logging in and calculating subtotal, tax and total are in helpers.ts. Turning money text like "$44.99" into a number is in currency.ts, so it's done the same way on every page instead of being repeated.

**Independent tests.** Each test starts a fresh browser session and logs in again, so the tests don't depend on each other and can run in parallel.

**Waits.** I didn't use fixed waits. WebdriverIO waits for elements on its own, and the expect checks keep retrying until they pass or time out. The only pauses are in slow mode, which is off by default.

**Navigation.** The site logs you out when you refresh or open a URL directly ([Bug #6](BUGS.md)), so the tests always move between pages by clicking.

**Mobile.** The mobile config reuses everything from the desktop config and only switches Chrome to iPhone 16 emulation (393 × 852). The mobile tests use the same page objects.

**Reports.** Results show in the terminal, and Allure creates an HTML report. When a test fails, a screenshot is taken and added to the report.

## Current results

There are 32 desktop tests and 4 mobile tests. 3 of the desktop tests fail, and that is expected. They check how the site should work, and they fail because of real bugs. When the bugs are fixed, these tests should pass without any code change. Below are the test cases executed for this assignment.

| ID                                | What is tested                                                                    | Result                              |
| --------------------------------- | --------------------------------------------------------------------------------- | ----------------------------------- |
| **1. Navigate and Login**         |                                                                                   |                                     |
| TC-L01                            | `fern_signal` can log in and sees the products page                               | Pass                                |
| TC-L02                            | `quiet_lock` can't log in and sees the "locked out" error                         | Pass                                |
| TC-L03                            | `lens_warp` can log in                                                            | Pass                                |
| TC-L04                            | `count_echo` can log in                                                           | Pass                                |
| _Additional_                      |                                                                                   |                                     |
| TC-L05                            | Wrong username shows the "do not match" error                                     | Pass                                |
| TC-L06                            | Wrong password shows the "do not match" error                                     | Pass                                |
| TC-L07                            | Both fields empty shows "Username is required"                                    | Pass                                |
| TC-L08                            | Empty username shows "Username is required"                                       | Pass                                |
| TC-L09                            | Empty password shows the error "Username is required"                             | Pass (wording is [Bug #4](BUGS.md)) |
| **2. Products Page**              |                                                                                   |                                     |
| TC-P01                            | Total count is 12 (count text and number of cards)                                | Pass                                |
| TC-P02                            | Filter Apparel shows 5 items                                                      | Pass                                |
| TC-P03                            | Filter Accessories shows 4 items                                                  | Pass                                |
| TC-P04                            | Filter Gear shows 2 items                                                         | Pass                                |
| TC-P05                            | Filter Books shows 1 item                                                         | Pass                                |
| TC-P06                            | Filter All categories shows 12 items                                              | Pass                                |
| TC-P07                            | Sort Name: A to Z shows names in A–Z order                                        | Pass                                |
| TC-P08                            | Sort Name: Z to A shows names in Z–A order                                        | Pass                                |
| TC-P09                            | Sort Price: Low to High shows the cheapest first                                  | Pass                                |
| TC-P10                            | Sort Price: High to Low shows the most expensive first                            | Fail ([Bug #2](BUGS.md))            |
| **3. Initial Cart State**         |                                                                                   |                                     |
| TC-C01                            | Cart is empty with no badge, and Continue Shopping goes back to products          | Pass                                |
| **4. Add To Cart**                |                                                                                   |                                     |
| TC-C02                            | First and last products added, badge shows 2, subtotal is correct                 | Pass                                |
| _Additional_                      |                                                                                   |                                     |
| TC-C06                            | Every product can be added to the cart                                            | Fail ([Bug #1](BUGS.md))            |
| **5. Increase/Decrease Quantity** |                                                                                   |                                     |
| TC-C03                            | + changes the quantity to 2 and the badge to 2                                    | Pass                                |
| TC-C04                            | + then − brings the quantity and badge back to 1                                  | Pass                                |
| _Additional_                      |                                                                                   |                                     |
| TC-C05                            | − at quantity 1 removes the item                                                  | Pass                                |
| **6. Validate Pricing Logic**     |                                                                                   |                                     |
| TC-PR01                           | Subtotal, 8% tax and total match the calculation (two items, one with quantity 2) | Pass                                |
| _Additional_                      |                                                                                   |                                     |
| TC-PR02                           | Totals recalculate after + then −                                                 | Pass                                |
| TC-PR03                           | Totals are correct for a single item                                              | Pass                                |
| **7. Proceed to Checkout**        |                                                                                   |                                     |
| TC-CO01                           | Full checkout: order summary, totals, confirmation, and empty cart after          | Pass                                |
| _Additional_                      |                                                                                   |                                     |
| TC-CO02                           | Empty First Name shows "First Name is required"                                   | Fail ([Bug #3](BUGS.md))            |
| TC-CO03                           | Empty Last Name shows "Last Name is required"                                     | Pass                                |
| TC-CO04                           | Empty Postal Code shows "Postal Code is required"                                 | Pass                                |
| **8. Mobile responsive**          |                                                                                   |                                     |
| TC-M01                            | Phone-width screen, and login works                                               | Pass                                |
| TC-M02                            | Filter Apparel shows 5 items on mobile                                            | Pass                                |
| TC-M03                            | Add to cart works on mobile                                                       | Pass                                |
| TC-M04                            | Full checkout works on mobile                                                     | Pass                                |

## Test Cases

**Pre-requisites for all tests (except Login and Mobile):**

1. Open https://qa-task--oyettijon.replit.app
2. Log in with username `fern_signal` and password `test_sauce`
3. The products page is displayed

### 1. Login

The password for every valid user is `test_sauce`.

Spec file: `src/specs/LoginSpecs.ts`

Every login error starts with "Epic sadface below —". The tests check the message as it shows today, and I raised the wording as [Bug #5](BUGS.md).

#### Required

**TC-L01: Verify the standard user (fern_signal) can log in and see the products page**

Steps:

1. Enter `fern_signal` and `test_sauce`
2. Click **Login**

Expected: The products page opens with the heading "The supply shelf".

---

**TC-L02: Verify the locked user (quiet_lock) cannot log in and sees the locked-out error**

Steps:

1. Enter `quiet_lock` and `test_sauce`
2. Click **Login**

Expected: The user stays on the login page and sees "Epic sadface below — Sorry, this user has been locked out."

---

**TC-L03: Verify the user lens_warp can log in and see the products page**

Steps:

1. Enter `lens_warp` and `test_sauce`
2. Click **Login**

Expected: The products page opens.

Note: Login works, but this user sees the wrong product images ([Bug #8](BUGS.md)).

---

**TC-L04: Verify the user count_echo can log in and see the products page**

Steps:

1. Enter `count_echo` and `test_sauce`
2. Click **Login**

Expected: The products page opens.

Note: Login works, but this user sees a cart badge of 1 with an empty cart ([Bug #9](BUGS.md)).

---

#### Additional

**TC-L05: Verify an error is shown when logging in with a wrong username**

Steps:

1. Enter `wrong_user` and `test_sauce`
2. Click **Login**

Expected: "Epic sadface below — Username and password do not match any user in this service"

---

**TC-L06: Verify an error is shown when logging in with a wrong password**

Steps:

1. Enter `fern_signal` and `wrong_pass`
2. Click **Login**

Expected: "Epic sadface below — Username and password do not match any user in this service"

---

**TC-L07: Verify an error is shown when both username and password are empty**

Steps:

1. Leave both fields empty
2. Click **Login**

Expected: "Epic sadface below — Username is required"

---

**TC-L08: Verify an error is shown when the username is empty**

Steps:

1. Leave username empty, enter `test_sauce`
2. Click **Login**

Expected: "Epic sadface below — Username is required"

---

**TC-L09: Verify the user cannot log in when the password is empty**

Steps:

1. Enter `fern_signal`, leave password empty
2. Click **Login**

Expected: The user can't log in and sees "Epic sadface below — Username is required".

Note: This checks the message the site shows today. It should talk about the password, not the username, so I raised it as [Bug #4](BUGS.md).

---

### 2. Products

Spec file: `src/specs/ProductSpecs.ts`

#### Required

**TC-P01: Verify the products page shows the correct total number of items**

Steps:

1. Check the count text above the list
2. Count the product cards

Expected: The text says "12 items to explore" and there are 12 cards.

---

**TC-P02 to TC-P06: Verify each category filter shows the correct number of items**

Steps:

1. Pick a category in the dropdown
2. Check the count text and the number of cards

Expected:

| Test   | Category       | Items |
| ------ | -------------- | ----- |
| TC-P02 | Apparel        | 5     |
| TC-P03 | Accessories    | 4     |
| TC-P04 | Gear           | 2     |
| TC-P05 | Books          | 1     |
| TC-P06 | All categories | 12    |

---

**TC-P07 to TC-P10: Verify each sort option shows the products in the correct order**

Steps:

1. Pick a sort option in the dropdown
2. Read the names or prices from top to bottom

Expected:

| Test   | Option             | Order                |
| ------ | ------------------ | -------------------- |
| TC-P07 | Name: A to Z       | names A to Z         |
| TC-P08 | Name: Z to A       | names Z to A         |
| TC-P09 | Price: Low to High | cheapest first       |
| TC-P10 | Price: High to Low | most expensive first |

Result: TC-P10 fails. The list is cheapest first, the same as Low to High ([Bug #2](BUGS.md)).

---

### 3. Cart

**Pre-requisite:** The cart is empty.

Spec file: `src/specs/CartSpecs.ts`

#### Required

**TC-C01: Verify the cart is empty at the start and Continue Shopping returns to the products page**

Steps:

1. Click **Cart**
2. Click **Continue Shopping**

Expected: The cart says "Your cart is empty" and there is no badge on the cart icon. Continue Shopping goes back to the products page.

---

**TC-C02: Verify products from the top and bottom of the list are added to the cart with the correct subtotal**

Steps:

1. Note the names and prices of the first and last products
2. Add both to the cart
3. Click **Cart**

Expected: The badge shows 2, both products are in the cart, and the subtotal is the two prices added together.

---

**TC-C03: Verify the + button increases the item quantity and the cart count**

Steps:

1. Add the first product and open the cart
2. Click **+**

Expected: The quantity goes from 1 to 2 and the badge shows 2.

---

**TC-C04: Verify the − button decreases the item quantity and the cart count**

Steps:

1. Add the first product and open the cart
2. Click **+**, then **−**

Expected: The quantity goes back to 1 and the badge shows 1.

---

#### Additional

**TC-C05: Verify the − button removes the item when its quantity is 1**

Steps:

1. Add the first product and open the cart
2. Click **−**

Expected: The item is removed and the cart says "Your cart is empty".

---

**TC-C06: Verify every product can be added to the cart**

Steps:

1. Note all product names
2. Click **Add to Cart** on every product
3. Click **Cart**

Expected: All products are in the cart.

Result: Fails. Bolt T-Shirt is never added ([Bug #1](BUGS.md)).

---

### 4. Pricing

**Pre-requisite:** The cart is empty.

Spec file: `src/specs/PricingSpecs.ts`

How I work out the expected values:

- Subtotal = price × quantity for each item, added together
- Tax = 8% of the subtotal, rounded to 2 decimals
- Total = subtotal + tax

#### Required

**TC-PR01: Verify the cart total equals the subtotal plus 8% tax**

Steps:

1. On the products page, click **Add to Cart** on the first product in the list
2. Click **Add to Cart** on the last product in the list
3. Click **Cart**
4. Click **+** on the first item, so its quantity becomes 2
5. For each item, multiply the unit price by the quantity, and add the results together to get the expected subtotal
6. Work out the expected tax: subtotal × 8%, rounded to 2 decimals
7. Work out the expected total: subtotal + tax

Expected:

- The cart badge shows 3 (2 of the first item + 1 of the last item)
- The subtotal on the page matches the expected subtotal
- The tax on the page matches the expected tax
- The total on the page matches the expected total

---

#### Additional

**TC-PR02: Verify the cart totals are recalculated after the quantity is decreased**

Steps:

1. On the products page, click **Add to Cart** on the first product in the list
2. Click **Cart**
3. Click **+** on the item, so its quantity becomes 2
4. Click **−** on the item, so its quantity goes back to 1
5. Work out the expected subtotal: unit price × 1
6. Work out the expected tax: subtotal × 8%, rounded to 2 decimals
7. Work out the expected total: subtotal + tax

Expected:

- The quantity shows 1
- The subtotal on the page equals the unit price (the amount for 2 items is no longer shown)
- The tax on the page matches the expected tax
- The total on the page matches the expected total

---

**TC-PR03: Verify the cart totals are correct for a single item**

Steps:

1. On the products page, click **Add to Cart** on the first product in the list
2. Click **Cart**
3. Check that the quantity of the item is 1
4. Work out the expected subtotal: the unit price of the item
5. Work out the expected tax: subtotal × 8%, rounded to 2 decimals
6. Work out the expected total: subtotal + tax

Expected:

- The subtotal on the page equals the unit price of the item
- The tax on the page matches the expected tax
- The total on the page matches the expected total

---

### 5. Checkout

**Pre-requisites:**

1. Click **Add to Cart** on the first and last products in the list
2. Click **Cart**, then **Proceed to Checkout**
3. The Checkout page is displayed

Spec file: `src/specs/CheckoutSpecs.ts`

Shipping details used: `Jack`, `Rode`, `V7V 1A1`

#### Required

**TC-CO01: Verify a user can complete checkout and see the order confirmation**

Steps:

1. Fill in first name, last name and postal code
2. Click **Continue**
3. Check the Order Summary
4. Click **Finish**
5. Click **Continue Shopping**

Expected:

- The Order Summary shows both items and "Jack Rode — V7V 1A1"
- The subtotal, tax and total are correct
- After Finish, the page shows "Order Placed!" and "Thank you for your purchase. Your order has been successfully submitted."
- After Continue Shopping, the products page opens and the cart badge is gone

---

#### Additional

**TC-CO02: Verify an error is shown on the Checkout page when First Name is left empty**

Steps:

1. On the Checkout page, leave **First Name** empty
2. Enter `Rode` as Last Name
3. Enter `V7V 1A1` as Postal Code
4. Click **Continue**

Expected: "First Name is required" is shown under First Name, and the user stays on the Checkout page.

Result: Fails. It shows "Last Name is required" under First Name, and the field turns green ([Bug #3](BUGS.md)).

---

**TC-CO03: Verify an error is shown on the Checkout page when Last Name is left empty**

Steps:

1. On the Checkout page, enter `Jack` as First Name
2. Leave **Last Name** empty
3. Enter `V7V 1A1` as Postal Code
4. Click **Continue**

Expected: "Last Name is required" is shown under Last Name, and the user stays on the Checkout page.

---

**TC-CO04: Verify an error is shown on the Checkout page when Postal Code is left empty**

Steps:

1. On the Checkout page, enter `Jack` as First Name
2. Enter `Rode` as Last Name
3. Leave **Postal Code** empty
4. Click **Continue**

Expected: "Postal Code is required" is shown under Postal Code, and the user stays on the Checkout page.

---

### 6. Mobile

These run in Chrome mobile emulation as an iPhone 16 (393 × 852). They use the same page objects as the desktop tests. Only the config is different.

**Pre-requisites:**

1. Chrome is in mobile emulation mode (iPhone 16)
2. Each test starts on the login page: https://qa-task--oyettijon.replit.app

- Config: `wdio.mobile.conf.ts`
- Spec file: `src/specs/mobile/MobileSpecs.ts`
- Run with: `npm run wdio:mobile`

#### Required

**TC-M01: Verify a user can log in on a mobile screen**

Steps:

1. Open the login page on the mobile screen
2. Check the screen width is phone size
3. Enter username `fern_signal` and password `test_sauce`
4. Click **Login**

Expected:

- The screen width is under 500px (phone size)
- The login page is shown correctly on the small screen
- After clicking Login, the products page opens with the heading "The supply shelf"

---

**TC-M02: Verify the category filter shows the correct number of items on mobile**

Steps:

1. Enter username `fern_signal` and password `test_sauce`
2. Click **Login**
3. On the products page, open the category dropdown
4. Select **Apparel**

Expected:

- The products page opens on the mobile screen
- After selecting Apparel, 5 product cards are shown

---

**TC-M03: Verify a product can be added to the cart on mobile**

Steps:

1. Enter username `fern_signal` and password `test_sauce`
2. Click **Login**
3. On the products page, note the name of the first product in the list
4. Click **Add to Cart** on the first product
5. Click **Cart**

Expected:

- After adding the product, the cart badge shows 1
- The cart page lists the same product noted in step 3

---

**TC-M04: Verify a user can complete checkout on mobile**

Steps:

1. Enter username `fern_signal` and password `test_sauce`
2. Click **Login**
3. Click **Add to Cart** on the first product in the list
4. Click **Cart**
5. Click **Proceed to Checkout**
6. Enter `Jack` as First Name, `Rode` as Last Name and `V7V 1A1` as Postal Code
7. Click **Continue**
8. Click **Finish**

Expected:

- After step 5, the Checkout page is shown
- After step 7, the Order Summary page is shown
- After step 8, the page shows "Order Placed!"

## Notes

I used Claude (AI assistant) to help with learning WebdriverIO and TypeScript and wording the documentation. I explored the site, found the bugs, decided what to test, and wrote and ran the tests myself.