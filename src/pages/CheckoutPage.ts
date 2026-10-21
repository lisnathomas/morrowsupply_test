export type CheckoutField = "firstName" | "lastName" | "postalCode";

class CheckoutPage {
  // --- Form fields ---
  get pageTitle() {
    return $('[data-test="checkout-title"]');
  }
  get firstNameInput() {
    return $('[data-test="checkout-first-name"]');
  }
  get lastNameInput() {
    return $('[data-test="checkout-last-name"]');
  }
  get postalCodeInput() {
    return $('[data-test="checkout-postal-code"]');
  }
  get continueButton() {
    return $('[data-test="continue-to-summary"]');
  }

  // --- Error messages ---
  get firstNameError() {
    return $('[data-test="first-name-error"]');
  }
  get lastNameError() {
    return $('[data-test="last-name-error"]');
  }
  get postalCodeError() {
    return $('[data-test="postal-code-error"]');
  }

  async fillShippingInfo(firstName: string, lastName: string, postalCode: string) {
    await this.firstNameInput.setValue(firstName);
    await this.lastNameInput.setValue(lastName);
    await this.postalCodeInput.setValue(postalCode);
  }

  async clickContinue() {
    await this.continueButton.click();
  }

  // Returns the error message element for the given field
  errorFor(field: CheckoutField) {
    switch (field) {
      case "firstName":
        return this.firstNameError;
      case "lastName":
        return this.lastNameError;
      case "postalCode":
        return this.postalCodeError;
      default:
        throw new Error(`No error message for field: ${field}`);
    }
  }
}
export default new CheckoutPage();
