class LoginPage {
  get usernameInput() {
    return $("#user-name");
  }
  get passwordInput() {
    return $("#password");
  }
  get loginButton() {
    return $("#login-button");
  }
  // The same element shows every login error (locked user, wrong password, empty fields)
  get errorMessage() {
    return $('[data-test="login-error-message"]');
  }

  async open() {
    await browser.url("/");
  }

  //Types the username and password, then clicks Login
  async login(username: string, password: string) {
    await this.usernameInput.setValue(username);
    await this.passwordInput.setValue(password);
    await this.loginButton.click();
  }
}

export default new LoginPage();
