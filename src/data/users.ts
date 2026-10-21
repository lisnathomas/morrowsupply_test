export const PASSWORD = "test_sauce"; //Common password for all users
export const STANDARD_USER = "fern_signal"; //User for every test that starts logged in

// List of users for login tests
export const users = [
  { id: "TC-L01", username: "fern_signal", canLogin: true },
  {
    id: "TC-L02",
    username: "quiet_lock",
    canLogin: false,
    expectedError: "Epic sadface below — Sorry, this user has been locked out.",
  },
  { id: "TC-L03", username: "lens_warp", canLogin: true },
  { id: "TC-L04", username: "count_echo", canLogin: true },
];

// List of invalid login cases for negative tests
export const invalidLogins = [
  {
    id: "TC-L05",
    case: "wrong username",
    username: "wrong_user",
    password: "test_sauce",
    expectedError:
      "Epic sadface below — Username and password do not match any user in this service",
  },
  {
    id: "TC-L06",
    case: "wrong password",
    username: "fern_signal",
    password: "wrong_pass",
    expectedError:
      "Epic sadface below — Username and password do not match any user in this service",
  },
  {
    id: "TC-L07",
    case: "both empty",
    username: "",
    password: "",
    expectedError: "Epic sadface below — Username is required",
  },
  {
    id: "TC-L08",
    case: "empty username",
    username: "",
    password: "test_sauce",
    expectedError: "Epic sadface below — Username is required",
  },
  {
    id: "TC-L09",
    case: "empty password",
    username: "fern_signal",
    password: "",
    expectedError: "Epic sadface below — Username is required",
  },
];
