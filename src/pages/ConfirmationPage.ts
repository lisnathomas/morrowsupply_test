class ConfirmationPage {
  get confirmationTitle() {
    return $('[data-test="checkout-success-title"]');
  }
  get confirmationMessage() {
    return $('[data-test="checkout-success-message"]');
  }
  get continueShoppingButton() {
    return $('[data-test="back-to-home"]');
  }

  async continueShopping() {
    await this.continueShoppingButton.click();
  }
}
export default new ConfirmationPage();
