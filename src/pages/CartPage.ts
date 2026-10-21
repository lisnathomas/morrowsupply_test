import { parseCurrency } from "../utils/currency";

class CartPage {
  
  get emptyCartMessage() {
    return $('[data-test="cart-empty-title"]');
  }
  get continueShoppingButton() {
    return $('[data-test="continue-shopping"]');
  }

  // --- Cart with items ---
  get cartTitle() {
    return $('[data-test="cart-title"]');
  }
  get cartItems() {
    return $$('[data-test="cart-item"]');
  }
  get itemNames() {
    return $$('[data-test="cart-item-name"]');
  }
  get itemPrices() {
    return $$('[data-test="cart-item-price"]');
  }
  get itemQuantities() {
    return $$('[data-test^="quantity-item"]');
  }
  get plusButtons() {
    return $$('[data-test^="increase-qty"]');
  }
  get minusButtons() {
    return $$('[data-test^="decrease-qty"]');
  }
  get itemTotals() {
    return $$('[data-test^="cart-item-total"]');
  }

  // --- Order summary ---
  get subtotal() {
    return $('[data-test="cart-subtotal"]');
  }
  get tax() {
    return $('[data-test="cart-tax"]');
  }
  get total() {
    return $('[data-test="cart-total"]');
  }
  get checkoutButton() {
    return $('[data-test="checkout-button"]');
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }

  async proceedToCheckout() {
    await this.checkoutButton.click();
  }

  async increaseQuantity(index: number) {
    const buttons = await this.plusButtons;
    if (!buttons[index]) {
      throw new Error(`No cart row at position ${index}, only ${buttons.length} found`);
    }
    await buttons[index].click();
  }

  async decreaseQuantity(index: number) {
    const buttons = await this.minusButtons;
    if (!buttons[index]) {
      throw new Error(`No cart row at position ${index}, only ${buttons.length} found`);
    }
    await buttons[index].click();
  }

  // --- Read data from the page ---
  async getItemNames() {
    const elements = await this.itemNames;
    const names: string[] = [];
    for (const element of elements) {
      names.push(await element.getText());
    }
    return names;
  }

  // Turns "$44.99" into the number 44.99
  async getSubtotal() {
    return parseCurrency(await this.subtotal.getText());
  }

  async getTax() {
    return parseCurrency(await this.tax.getText());
  }

  async getTotal() {
    return parseCurrency(await this.total.getText());
  }

  // Reads every "$44.99 each" line and turns it into a number
  async getItemPrices() {
    const elements = await this.itemPrices;
    const prices: number[] = [];
    for (const element of elements) {
      const text = await element.getText();
      prices.push(parseCurrency(text.replace("each", "")));
    }
    return prices;
  }

  // Reads every quantity line and turns it into a number
  async getItemQuantities() {
    const elements = await this.itemQuantities;
    const quantities: number[] = [];
    for (const element of elements) {
      quantities.push(parseInt(await element.getText()));
    }
    return quantities;
  }
}

export default new CartPage();
