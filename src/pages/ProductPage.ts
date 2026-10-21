import { parseCurrency } from "../utils/currency";

class ProductPage {
  
  get pageTitle() {
    return $('[data-test="inventory-title"]');
  }
  // No data-test or id on this text, so it's found by its fixed wording
  get itemCount() {
    return $("p*=items to explore");
  }
  get categoryDropdown() {
    return $('[data-test="filter-category"]');
  }
  get sortDropdown() {
    return $('[data-test="sort-select"]');
  }
  get inventoryContainer() {
    return $('[data-test="inventory-container"]');
  }
  get productCards() {
    return $$('[data-test="inventory-item"]');
  }
  get productNames() {
    return $$('[data-test="inventory-item-name"]');
  }
  get productPrices() {
    return $$('[data-test="inventory-item-price"]');
  }
  get addToCartButtons() {
    return $$('[data-test^="add-to-cart"]');
  }

  async filterByCategory(category: string) {
    await this.categoryDropdown.selectByVisibleText(category);
  }

  async sortBy(option: string) {
    await this.sortDropdown.selectByVisibleText(option);
  }

  async getItemCount() {
    const countText = await this.itemCount.getText();
    return parseInt(countText);
  }

  // Reads the name of every product shown, top to bottom
  async getProductNames() {
    const elements = await this.productNames;
    const names: string[] = [];
    for (const element of elements) {
      names.push(await element.getText());
    }
    return names;
  }

  // Reads the price of every product shown, top to bottom, and turns it into a number
  async getProductPrices() {
    const elements = await this.productPrices;
    const prices: number[] = [];
    for (const element of elements) {
      const text = await element.getText();
      prices.push(parseCurrency(text));
    }
    return prices;
  }

  async addProductToCart(index: number) {
    const buttons = await this.addToCartButtons;
    if (!buttons[index]) {
      throw new Error(`No product at position ${index}, only ${buttons.length} found`);
    }
    await buttons[index].click();
  }
}
export default new ProductPage();
