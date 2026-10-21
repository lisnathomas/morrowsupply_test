import { expect } from "@wdio/globals";
import Header from "../pages/Header";
import ProductPage from "../pages/ProductPage";
import CartPage from "../pages/CartPage";
import { loginAsStandardUser } from "../utils/helpers";
import { EMPTY_CART_MESSAGE, FIRST_PRODUCT, LAST_PRODUCT } from "../data/cart";
import { TOTAL_PRODUCTS } from "../data/products";

describe("Cart Tests", () => {
  beforeEach(async () => {
    await loginAsStandardUser();
  });

  // ---------- Step 3: Initial cart state ----------

  it("TC-C01: cart is empty at the start and Continue Shopping returns to products", async () => {
    await Header.openCart();

    await expect(CartPage.emptyCartMessage).toHaveText(EMPTY_CART_MESSAGE);
    await expect(Header.cartBadge).not.toBeDisplayed();

    await CartPage.continueShopping();
    await expect(ProductPage.pageTitle).toBeDisplayed();
  });

  // ---------- Step 4: Add items from the top and bottom of the list ----------

  it("TC-C02: adds the first and last products to the cart", async () => {
    const names = await ProductPage.getProductNames();
    const prices = await ProductPage.getProductPrices();

    await ProductPage.addProductToCart(FIRST_PRODUCT);
    await ProductPage.addProductToCart(LAST_PRODUCT);
    await expect(Header.cartBadge).toHaveText("2");

    await Header.openCart();

    const cartNames = await CartPage.getItemNames();
    expect(cartNames).toContain(names[FIRST_PRODUCT]);
    expect(cartNames).toContain(names[LAST_PRODUCT]);

    // Subtotal should be the sum of the two product prices
    const expectedSubtotal = prices[FIRST_PRODUCT] + prices[LAST_PRODUCT];
    expect(await CartPage.getSubtotal()).toBeCloseTo(expectedSubtotal, 2);
  });

  // ---------- Step 5: Increase / decrease quantity ----------

  it("TC-C03: + button increases the quantity and item count", async () => {
    await ProductPage.addProductToCart(FIRST_PRODUCT);
    await Header.openCart();

    await CartPage.increaseQuantity(0);

    await expect(CartPage.itemQuantities[0]).toHaveText("2");
    await expect(Header.cartBadge).toHaveText("2");
  });

  it("TC-C04: - button decreases the quantity and item count", async () => {
    await ProductPage.addProductToCart(FIRST_PRODUCT);
    await Header.openCart();

    await CartPage.increaseQuantity(0); // 1 - 2
    await CartPage.decreaseQuantity(0); // 2 - 1

    await expect(CartPage.itemQuantities[0]).toHaveText("1");
    await expect(Header.cartBadge).toHaveText("1");
  });

  // ---------- Additional Coverage ----------

  it("TC-C05: - button at quantity 1 removes the item from the cart", async () => {
    await ProductPage.addProductToCart(FIRST_PRODUCT);
    await Header.openCart();

    await CartPage.decreaseQuantity(0); // 1 - removed

    await expect(CartPage.emptyCartMessage).toHaveText(EMPTY_CART_MESSAGE);
  });

  // TC-C06 currently fails: Bolt T-Shirt cannot be added to the cart (Bug #1)
  it("TC-C06: every product can be added to the cart", async () => {
    const names = await ProductPage.getProductNames();

    // Click Add to Cart on every product, top to bottom
    for (let i = 0; i < TOTAL_PRODUCTS; i++) {
      await ProductPage.addProductToCart(i);
    }

    await Header.openCart();
    const cartNames = await CartPage.getItemNames();

    // Every product from the products page should be in the cart
    for (const name of names) {
      expect(cartNames).toContain(name);
    }
  });
});
