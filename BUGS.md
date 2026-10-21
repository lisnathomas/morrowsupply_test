# Bug Report – Morrow Supply

**Application:** https://qa-task--oyettijon.replit.app

**Environment:** Chrome 155, Windows 11, desktop

**Password for all users:** `test_sauce`

**Tested by:** Lisna Thomas

This report has three sections:

1. **Bugs found through automation.** Bugs found while writing and running the automated tests.
2. **Bugs found through exploratory testing.** These were found by testing the site manually and are raised here for the team.
3. **Observation.** Something that may be intended and needs confirmation from the team.

## Summary

| #   | Title                                                          | Priority | Found by                             |
| --- | -------------------------------------------------------------- | -------- | ------------------------------------ |
| 1   | Add to Cart does nothing for Bolt T-Shirt                      | High     | Automation – TC-C06 fails            |
| 2   | "Price: High to Low" sorts from low to high                    | High     | Automation – TC-P10 fails            |
| 3   | Empty First Name shows "Last Name is required" and turns green | Medium   | Automation – TC-CO02 fails           |
| 4   | Empty password shows "Username is required"                    | Low      | Automation – seen in TC-L09          |
| 5   | Login errors start with "Epic sadface below —"                 | Low      | Automation – seen in TC-L02, L05–L09 |
| 6   | Refreshing the page logs the user out and empties the cart     | High     | Exploratory testing                  |
| 7   | "System overload" error blocks the + button on the cart page   | High     | Exploratory testing                  |
| 8   | lens_warp sees the wrong product images                        | High     | Exploratory testing                  |
| 9   | count_echo sees a cart badge of 1 with an empty cart           | Medium   | Exploratory testing                  |
| 10  | Cart badge still shows items after the order is placed         | Medium   | Exploratory testing                  |
| 11  | Postal Code accepts any value                                  | Low      | Exploratory testing                  |

---

# Section 1: Bugs found through automation

## 1A. Tests that fail because of a bug

These tests check the correct behaviour, so they fail until the bug is fixed. When the bug is fixed, the test passes with no code change.

---

## Bug #1: Add to Cart does nothing for Bolt T-Shirt

**Priority:** High
**Reproducible:** Every time
**Automated test:** `TC-C06: every product can be added to the cart` (CartSpecs.ts)

**Description:**
Clicking **Add to Cart** on **Bolt T-Shirt** does nothing. The product is not added to the cart, the cart badge does not change, and no error message is shown. Add to Cart works for every other product.

**Steps to reproduce:**

1. Open https://qa-task--oyettijon.replit.app
2. Enter username `fern_signal` and password `test_sauce`, then click **Login**
3. On the products page, find **Bolt T-Shirt** ($15.99)
4. Leave the quantity at 1 and click **Add to Cart**
5. Look at the cart icon in the top bar
6. Click **Cart**

**Expected result:** Bolt T-Shirt is added to the cart, the cart badge shows 1, and the cart page lists Bolt T-Shirt.

**Actual result:** Nothing happens when the button is clicked. The cart badge does not appear, and the cart page shows "Your cart is empty".

**Impact:** Customers cannot buy this product at all.

---

## Bug #2: "Price: High to Low" sorts from low to high

**Priority:** High
**Reproducible:** Every time
**Automated test:** `TC-P10: sort by Price: High to Low` (ProductSpecs.ts)

**Description:**
Selecting **Price: High to Low** in the sort dropdown shows the products in the opposite order, cheapest first.

**Steps to reproduce:**

1. Open https://qa-task--oyettijon.replit.app
2. Enter username `fern_signal` and password `test_sauce`, then click **Login**
3. On the products page, click the sort dropdown
4. Select **Price: High to Low**
5. Read the prices from top to bottom

**Expected result:** Items should display from price high to low.

**Actual result:** Items are listed from price low to high, the same as "Price: Low to High".

**Note:** The test failure output shows the expected and actual price lists side by side.

---

## Bug #3: Empty First Name shows "Last Name is required" and turns green

**Priority:** Medium
**Reproducible:** Every time
**Automated test:** `TC-CO02: shows an error when firstName is empty` (CheckoutSpecs.ts)

**Description:**
On the checkout form, leaving First Name empty shows the wrong error message under it, and the field is highlighted green (as if it were valid) instead of red.

**Steps to reproduce:**

1. Open https://qa-task--oyettijon.replit.app
2. Enter username `fern_signal` and password `test_sauce`, then click **Login**
3. Click **Add to Cart** on any product
4. Click **Cart**, then click **Proceed to Checkout**
5. Leave **First Name** empty
6. Enter `Rode` as Last Name
7. Enter `V7V 1A1` as Postal Code
8. Click **Continue**

**Expected result:** First Name is highlighted red with the message "First Name is required".

**Actual result:** The message under First Name says **"Last Name is required"**, and the First Name field is highlighted **green**.

**Impact:** The user is told to fix the wrong field and may not understand why they can't continue.

---

## 1B. Bugs seen in automated tests (the tests pass)

These login tests check the message the site shows today, so they pass. They confirm that the user cannot log in and that an error is shown. The wording of the messages is wrong, so it is raised here. Once the wording is fixed, the expected text in `src/data/users.ts` should be updated.

---

## Bug #4: Empty password shows "Username is required"

**Priority:** Low
**Reproducible:** Every time
**Seen in automated test:** `TC-L09: shows error for empty password` (LoginSpecs.ts)

**Description:**
Logging in with a username but no password shows a message about the username instead of the password.

**Steps to reproduce:**

1. Open https://qa-task--oyettijon.replit.app
2. Enter `fern_signal` as the username
3. Leave the password field empty
4. Click **Login**
5. Read the error message shown on the login page

**Expected result:** A clear message about the missing password, e.g. "Password is required".

**Actual result:** "Epic sadface below — Username is required", even though the username was entered.

**Impact:** The user is told the username is missing, so they may not realise the password is what's missing.

---

## Bug #5: Login errors start with "Epic sadface below —"

**Priority:** Low
**Reproducible:** Every time
**Seen in automated tests:** `TC-L02`, `TC-L05` to `TC-L09` (LoginSpecs.ts)

**Description:**
Every login error message starts with the text "Epic sadface below —", which looks like leftover placeholder text.

**Steps to reproduce:**

1. Open https://qa-task--oyettijon.replit.app
2. Enter username `quiet_lock` and password `test_sauce`
3. Click **Login**
4. Read the error message shown on the login page

**Expected result:** A clear message, e.g. "Sorry, this user has been locked out."

**Actual result:** "Epic sadface below — Sorry, this user has been locked out."

**Note:** "below" actually doesn't make sense here, since nothing is below the message. The same prefix appears on every login error message (wrong username, wrong password, empty fields).

---

# Section 2: Bugs found through exploratory testing

These bugs were found by testing the site manually and are raised here for the team to review.

---

## Bug #6: Refreshing the page logs the user out and empties the cart

**Priority:** High
**Reproducible:** Every time

**Description:**
The login session is not kept when the page is reloaded. Refreshing the browser, or typing a page address directly (for example `/cart`), sends the user back to the login page. After logging in again, everything they added to the cart is gone.

**Steps to reproduce:**

1. Open https://qa-task--oyettijon.replit.app
2. Enter username `fern_signal` and password `test_sauce`, then click **Login**
3. Click **Add to Cart** on any product (the cart badge shows 1)
4. Press **F5** to refresh the page
5. Note which page is shown after the refresh
6. Log in again with `fern_signal` and `test_sauce`
7. Click **Cart**

**Expected result:** After the refresh, the user is still logged in and the cart still has the item.

**Actual result:** After the refresh, the login page is shown. After logging in again, the cart is empty ("Your cart is empty").

**Also happens when:** pasting a page URL such as `https://qa-task--oyettijon.replit.app/cart` into the address bar while logged in.

**Impact:** Users lose their cart if they refresh by accident or open a bookmarked page. Because of this, the automated tests move between pages only by clicking, never by URL or refresh.

---

## Bug #7: "System overload" error blocks the + button on the cart page

**Priority:** High
**Reproducible:** Every time

**Description:**
On the cart page, clicking the **+** button a few times shows a "System overload" error, and after that the quantity can no longer be increased. Lowering the quantity with **−** does not fix it: **+** stays blocked. This only happens with the **+** button on the cart page. On the products page, the quantity can be increased as many times as needed before adding to the cart.

**Steps to reproduce:**

1. Open https://qa-task--oyettijon.replit.app
2. Enter username `fern_signal` and password `test_sauce`, then click **Login**
3. Click **Add to Cart** on **Branch Point Decals**
4. Click **Cart**
5. Click **+** on the item several times (around 10), watching the quantity after each click
6. When the error banner appears, click **−** to lower the quantity
7. Click **+** again

**Expected result:** Each click on **+** increases the quantity by 1, with no limit, and the row total and order summary update every time.

**Actual result:**

- After a few clicks on **+**, a red banner appears: _"Error: System overload — item interaction limit exceeded for this session. Please refresh the page to continue."_
- After the error, **+** no longer increases the quantity, even after lowering it with **−**.
- Following the message and refreshing the page logs the user out and empties the cart (see Bug #6).

**Impact:** A customer who wants more than a few of one item cannot complete the order, and following the on-screen advice loses their whole cart.

---

## Bug #8: lens_warp sees the wrong product images

**Priority:** High
**Reproducible:** Every time

**Description:**
When logged in as `lens_warp`, product images are mixed up, so each product shows another product's picture.

**Steps to reproduce:**

1. Open https://qa-task--oyettijon.replit.app
2. Enter username `lens_warp` and password `test_sauce`, then click **Login**
3. On the products page, look at the image next to each product name
4. In a new browser window, open the site and log in as `fern_signal` with `test_sauce`
5. Compare the images of the same products in both windows

**Expected result:** Each product shows its own image, the same as for `fern_signal`.

**Actual result:** Images don't match the products. For example:

- **Gridline Journal** shows a jacket
- **Summit Fleece** shows the blue Bolt T-Shirt
- **Nightline Safety Light** shows a backpack

**Impact:** A customer could buy the wrong item based on the picture.

---

## Bug #9: count_echo sees a cart badge of 1 with an empty cart

**Priority:** Medium
**Reproducible:** Every time

**Description:**
Straight after logging in as `count_echo`, the cart icon shows a badge of 1, but the cart is actually empty.

**Steps to reproduce:**

1. Open https://qa-task--oyettijon.replit.app
2. Enter username `count_echo` and password `test_sauce`, then click **Login**
3. Without adding anything, look at the cart icon in the top bar
4. Click **Cart**

**Expected result:** No badge on the cart icon, because nothing has been added.

**Actual result:** The badge shows **1**, but the cart page says "Your cart is empty".

**Impact:** The user thinks something is in their cart when it isn't.

---

## Bug #10: Cart badge still shows items after the order is placed

**Priority:** Medium
**Reproducible:** Every time

**Description:**
After finishing checkout, the "Order Placed!" page still shows the cart badge with the old item count.

**Steps to reproduce:**

1. Open https://qa-task--oyettijon.replit.app
2. Enter username `fern_signal` and password `test_sauce`, then click **Login**
3. Click **Add to Cart** on any one product (the badge shows 1)
4. Click **Cart**, then click **Proceed to Checkout**
5. Enter `Jack` as First Name, `Rode` as Last Name and `V7V 1A1` as Postal Code, then click **Continue**
6. On the Order Summary page, click **Finish**
7. On the "Order Placed!" page, look at the cart icon in the top bar

**Expected result:** The order is complete, so the cart is empty and no badge is shown.

**Actual result:** The badge still shows **1**. It only disappears after clicking **Continue Shopping**.

**Impact:** The user may think the order did not go through, or that items are still waiting in the cart.

---

## Bug #11: Postal Code accepts any value

**Priority:** Low
**Reproducible:** Every time

**Description:**
The Postal Code field on the checkout form doesn't check the format. Any text is accepted.

**Steps to reproduce:**

1. Open https://qa-task--oyettijon.replit.app
2. Enter username `fern_signal` and password `test_sauce`, then click **Login**
3. Click **Add to Cart** on any product
4. Click **Cart**, then click **Proceed to Checkout**
5. Enter `Jack` as First Name and `Rode` as Last Name
6. Enter `aa` as Postal Code
7. Click **Continue**

**Expected result:** An invalid postal code is rejected with a message, e.g. "Please enter a valid postal code".

**Actual result:** `aa` is accepted, and the Order Summary shows "Shipping to: Jack Rode — aa".

**Impact:** Orders can be placed with an address that can't be delivered to.

---

# Section 3: Observation (found during exploratory testing)

## Gridline Journal is listed under Accessories

**Description:** Gridline Journal is a notebook, but it shows up under **Accessories** instead of **Books**. Because of this, the Books filter only shows one product. This might be on purpose, so I'm raising it as a observation, not a bug.

**Steps to reproduce:**

1. Open https://qa-task--oyettijon.replit.app
2. Enter username `fern_signal` and password `test_sauce`, then click **Login**
3. Select **Accessories** in the category dropdown and look at the products shown
4. Select **Books** in the category dropdown and look at the products shown

**What was seen:** Gridline Journal (a notebook) appears under **Accessories**. **Books** only shows Signal Path Field Guide.