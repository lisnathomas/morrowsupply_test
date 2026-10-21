import { expect } from "@wdio/globals";
import Header from "../pages/Header";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import { calculateTotals, loginAsStandardUser } from "../utils/helpers";
import { FIRST_PRODUCT, LAST_PRODUCT, TAX_RATE } from "../data/cart";

// Calculates the expected subtotal, tax and total from the cart rows
// and checks they match what the cart page shows
async function verifyCartTotals() {
  const prices = await CartPage.getItemPrices();
  const quantities = await CartPage.getItemQuantities();

  const expected = calculateTotals(prices, quantities, TAX_RATE);

  expect(await CartPage.getSubtotal()).toBeCloseTo(expected.subtotal, 2);
  expect(await CartPage.getTax()).toBeCloseTo(expected.tax, 2);
  expect(await CartPage.getTotal()).toBeCloseTo(expected.total, 2);
}

describe("Pricing Tests", () => {
  beforeEach(async () => {
    await loginAsStandardUser();
  });

  // ---------- Step 6: Pricing ----------

  it("TC-PR01: cart total equals subtotal plus 8% tax", async () => {
    await ProductPage.addProductToCart(FIRST_PRODUCT);
    await ProductPage.addProductToCart(LAST_PRODUCT);
    await Header.openCart();

    await CartPage.increaseQuantity(0);
    await expect(CartPage.itemQuantities[0]).toHaveText("2");
    await expect(Header.cartBadge).toHaveText("3");

    await verifyCartTotals();
  });

  // ---------- Additional Coverage ----------

  it("TC-PR02: totals recalculate after decreasing a quantity", async () => {
    await ProductPage.addProductToCart(FIRST_PRODUCT);
    await Header.openCart();

    await CartPage.increaseQuantity(0);
    await expect(CartPage.itemQuantities[0]).toHaveText("2");

    await CartPage.decreaseQuantity(0);
    await expect(CartPage.itemQuantities[0]).toHaveText("1");

    await verifyCartTotals();
  });

  it("TC-PR03: totals are correct for a single item", async () => {
    await ProductPage.addProductToCart(FIRST_PRODUCT);
    await Header.openCart();

    await verifyCartTotals();
  });
});
