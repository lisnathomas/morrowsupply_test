import type { CheckoutField } from "../pages/CheckoutPage";

// Shipping details used for a successful checkout
export const SHIPPING_INFO = {
  firstName: "Jack",
  lastName: "Rode",
  postalCode: "V7V 1A1",
};

// Text shown on the confirmation page
export const ORDER_PLACED_TITLE = "Order Placed!";
export const ORDER_PLACED_MESSAGE =
  "Thank you for your purchase. Your order has been successfully submitted.";

export const checkoutErrors: {
  id: string;
  field: CheckoutField;
  firstName: string;
  lastName: string;
  postalCode: string;
  expectedError: string;
}[] = [
  {
    id: "TC-CO02", //TC--C002 is failed - see Bug #3
    field: "firstName",
    firstName: "",
    lastName: "Rode",
    postalCode: "V7V 1A1",
    expectedError: "First Name is required",
  },
  {
    id: "TC-CO03",
    field: "lastName",
    firstName: "Jack",
    lastName: "",
    postalCode: "V7V 1A1",
    expectedError: "Last Name is required",
  },
  {
    id: "TC-CO04",
    field: "postalCode",
    firstName: "Jack",
    lastName: "Rode",
    postalCode: "",
    expectedError: "Postal Code is required",
  },
];
