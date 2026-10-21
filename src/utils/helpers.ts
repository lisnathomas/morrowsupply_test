import LoginPage from "../pages/LoginPage";
import ProductPage from "../pages/ProductPage";
import { STANDARD_USER, PASSWORD } from "../data/users";

// Shared setup for every test that needs to start logged in as the standard user
export async function loginAsStandardUser() {
  await browser.reloadSession();
  await LoginPage.open();
  await LoginPage.login(STANDARD_USER, PASSWORD);
  await ProductPage.pageTitle.waitForDisplayed();
}

// Works out subtotal, tax and total from unit prices and quantities
export function calculateTotals(prices: number[], quantities: number[], taxRate: number) {
  // Every price needs a matching quantity
  if (prices.length !== quantities.length) {
    throw new Error("Prices and quantities must have the same length");
  }

  let subtotal = 0;
  for (let i = 0; i < prices.length; i++) {
    subtotal += prices[i] * quantities[i];
  }
  
  // Tax is rounded to 2 decimals, the same way the site shows it
  const tax = Math.round(subtotal * taxRate * 100) / 100;
  return { subtotal, tax, total: subtotal + tax };
}
