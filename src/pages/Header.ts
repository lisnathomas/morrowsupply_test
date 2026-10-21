// Top bar shown on every page (cart button and badge)
class Header {
  get cartBadge() {
    return $('[data-test="cart-badge"]');
  }
  get cartButton() {
    return $('[data-test="nav-cart"]');
  }

  async openCart() {
    await this.cartButton.click();
  }
}
export default new Header();
