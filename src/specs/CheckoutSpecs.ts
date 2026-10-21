import { expect } from "@wdio/globals";
import Header from "../pages/Header";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import CheckoutPage from "../pages/CheckoutPage";
import OrderSummaryPage from "../pages/OrderSummaryPage";
import ConfirmationPage from "../pages/ConfirmationPage";
import { calculateTotals, loginAsStandardUser } from "../utils/helpers";
import { FIRST_PRODUCT, LAST_PRODUCT, TAX_RATE } from "../data/cart";
import {
  SHIPPING_INFO,
  ORDER_PLACED_TITLE,
  ORDER_PLACED_MESSAGE,
  checkoutErrors,
} from "../data/checkout";

// Adds two products and goes to the checkout page
async function goToCheckout() {
  await ProductPage.addProductToCart(FIRST_PRODUCT);
  await ProductPage.addProductToCart(LAST_PRODUCT);
  await Header.openCart();
  await CartPage.proceedToCheckout();
  await expect(CheckoutPage.pageTitle).toHaveText("Checkout");
}

describe("Checkout Tests", () => {
  beforeEach(async () => {
    await loginAsStandardUser();
  });

  // ---------- Step 7: Full checkout ----------

  it("TC-CO01: completes checkout and shows the order confirmation", async () => {
    await goToCheckout();

    // Shipping information
    await CheckoutPage.fillShippingInfo(
      SHIPPING_INFO.firstName,
      SHIPPING_INFO.lastName,
      SHIPPING_INFO.postalCode,
    );
    await CheckoutPage.clickContinue();

    // Order Summary page
    await expect(OrderSummaryPage.pageTitle).toHaveText("Order Summary");
    await expect(OrderSummaryPage.itemNames).toBeElementsArrayOfSize(2);
    await expect(OrderSummaryPage.shippingInfo).toHaveText(
      `${SHIPPING_INFO.firstName} ${SHIPPING_INFO.lastName} — ${SHIPPING_INFO.postalCode}`,
    );

    // Totals on the Order Summary are calculated correctly
    const prices = await OrderSummaryPage.getItemPrices();
    const quantities = await OrderSummaryPage.getItemQuantities();
    const expected = calculateTotals(prices, quantities, TAX_RATE);

    expect(await OrderSummaryPage.getSubtotal()).toBeCloseTo(expected.subtotal, 2);
    expect(await OrderSummaryPage.getTax()).toBeCloseTo(expected.tax, 2);
    expect(await OrderSummaryPage.getTotal()).toBeCloseTo(expected.total, 2);

    // Finish → confirmation page
    await OrderSummaryPage.finishCheckout();
    await expect(ConfirmationPage.confirmationTitle).toHaveText(ORDER_PLACED_TITLE);
    await expect(ConfirmationPage.confirmationMessage).toHaveText(ORDER_PLACED_MESSAGE);

    // Back to products, cart is empty
    await ConfirmationPage.continueShopping();
    await expect(ProductPage.pageTitle).toBeDisplayed();
    await expect(Header.cartBadge).not.toBeDisplayed();
  });

  // ---------- Additional: empty field validation ----------

  // TC-CO02 to TC-CO04: one test per empty field
  // TC-CO02 currently fails: empty First Name shows "Last Name is required" (Bug #3)
  for (const data of checkoutErrors) {
    it(`${data.id}: shows an error when ${data.field} is empty`, async () => {
      await goToCheckout();

      await CheckoutPage.fillShippingInfo(data.firstName, data.lastName, data.postalCode);
      await CheckoutPage.clickContinue();

      await expect(CheckoutPage.errorFor(data.field)).toHaveText(data.expectedError);
    });
  }
});
