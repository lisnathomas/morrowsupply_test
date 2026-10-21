import { expect } from "@wdio/globals";
import Header from "../../pages/Header";
import LoginPage from "../../pages/LoginPage";
import ProductPage from "../../pages/ProductPage";
import CartPage from "../../pages/CartPage";
import CheckoutPage from "../../pages/CheckoutPage";
import OrderSummaryPage from "../../pages/OrderSummaryPage";
import ConfirmationPage from "../../pages/ConfirmationPage";
import { loginAsStandardUser } from "../../utils/helpers";
import { STANDARD_USER, PASSWORD } from "../../data/users";
import { FIRST_PRODUCT } from "../../data/cart";
import { SHIPPING_INFO, ORDER_PLACED_TITLE } from "../../data/checkout";
import { categories } from "../../data/products";

describe("Mobile Tests", () => {
  // ---------- Step 8: Mobile (iPhone 16) ----------

  it("TC-M01: user can log in on a mobile screen", async () => {
    await browser.reloadSession();
    await LoginPage.open();

    const screenWidth = await browser.execute(() => window.innerWidth);
    expect(screenWidth).toBeLessThan(500);

    await LoginPage.login(STANDARD_USER, PASSWORD);
    await expect(ProductPage.pageTitle).toBeDisplayed();
  });

  it("TC-M02: category filter shows the right count on mobile", async () => {
    await loginAsStandardUser();

    const apparel = categories[0]; // Apparel, 5 items
    await ProductPage.filterByCategory(apparel.name);
    await expect(ProductPage.productCards).toBeElementsArrayOfSize(apparel.count);
  });

  it("TC-M03: product can be added to the cart on mobile", async () => {
    await loginAsStandardUser();
    const names = await ProductPage.getProductNames();

    await ProductPage.addProductToCart(FIRST_PRODUCT);
    await expect(Header.cartBadge).toHaveText("1");

    await Header.openCart();
    expect(await CartPage.getItemNames()).toContain(names[FIRST_PRODUCT]);
  });

  it("TC-M04: full checkout works on mobile", async () => {
    await loginAsStandardUser();

    await ProductPage.addProductToCart(FIRST_PRODUCT);
    await Header.openCart();
    await CartPage.proceedToCheckout();
    await expect(CheckoutPage.pageTitle).toHaveText("Checkout");

    await CheckoutPage.fillShippingInfo(
      SHIPPING_INFO.firstName,
      SHIPPING_INFO.lastName,
      SHIPPING_INFO.postalCode,
    );
    await CheckoutPage.clickContinue();
    await expect(OrderSummaryPage.pageTitle).toHaveText("Order Summary");

    await OrderSummaryPage.finishCheckout();
    await expect(ConfirmationPage.confirmationTitle).toHaveText(ORDER_PLACED_TITLE);
  });
});
