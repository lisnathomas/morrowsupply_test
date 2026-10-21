import { parseCurrency } from "../utils/currency";

class OrderSummaryPage {
  
  get pageTitle() {
    return $('[data-test="checkout-title"]');
  }
  get itemNames() {
    return $$('[data-test="checkout-item-name"]');
  }
  get itemQtyAndPrice() {
    return $$('[data-test="checkout-item-qty"]');
  }
  get itemTotals() {
    return $$('[data-test="checkout-item-subtotal"]');
  }

  // --- Payment summary ---
  get subtotal() {
    return $('[data-test="checkout-subtotal"]');
  }
  get tax() {
    return $('[data-test="checkout-tax"]');
  }
  get total() {
    return $('[data-test="checkout-total"]');
  }

  // --- Shipping info and finish button ---
  get shippingInfo() {
    return $('[data-test="shipping-info"]');
  }
  get finishButton() {
    return $('[data-test="finish-button"]');
  }

  async finishCheckout() {
    await this.finishButton.click();
  }

  async getItemNames() {
    const elements = await this.itemNames;
    const names: string[] = [];
    for (const element of elements) {
      names.push(await element.getText());
    }
    return names;
  }

  //Reads every "Qty: 1 × $44.99" line and splits it into quantity and price
  async readQtyAndPrice() {
    const elements = await this.itemQtyAndPrice;
    const rows: { quantity: number; price: number }[] = [];

    for (const element of elements) {
      const text = await element.getText();

      // "Qty: 1 × $44.99" → ["Qty: 1 × ", "44.99"]
      const parts = text.split("$");
      const quantity = parseInt(parts[0].replace("Qty:", ""));
      const price = parseFloat(parts[1]);

      // Stop with a clear message if the text is not in the expected format
      if (isNaN(quantity) || isNaN(price)) {
        throw new Error(`Could not read quantity and price from: "${text}"`);
      }

      rows.push({ quantity, price });
    }
    return rows;
  }

  // Quantity of each item: "Qty: 1 × $44.99" → 1
  async getItemQuantities() {
    const rows = await this.readQtyAndPrice();
    return rows.map((row) => row.quantity);
  }

  // Unit price of each item: "Qty: 1 × $44.99" → 44.99
  async getItemPrices() {
    const rows = await this.readQtyAndPrice();
    return rows.map((row) => row.price);
  }

  // "$44.99" → 44.99
  async getSubtotal() {
    return parseCurrency(await this.subtotal.getText());
  }

  async getTax() {
    return parseCurrency(await this.tax.getText());
  }

  async getTotal() {
    return parseCurrency(await this.total.getText());
  }
}

export default new OrderSummaryPage();
