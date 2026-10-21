export const config: WebdriverIO.Config = {
  runner: "local",
  tsConfigPath: "./tsconfig.json",

  // ---------- Test files ----------
  specs: ["src/specs/**/*.ts"],
  // Mobile tests run separately with wdio.mobile.conf.ts
  exclude: ["src/specs/mobile/**"],

  // ---------- Browser ----------
  // Each spec file runs in its own browser, up to 10 at the same time
  maxInstances: 10,
  capabilities: [
    {
      browserName: "chrome",
      "goog:chromeOptions": {
        // Hide Chrome's own console messages so the test results are easier to read
        args: ["--log-level=3"],
        excludeSwitches: ["enable-logging"],
      },
    },
  ],

  // ---------- Test settings ----------
  // updated to show only error in the console
  logLevel: "error",
  bail: 0,
  // Lets the tests use browser.url("/") instead of the full address
  baseUrl: "https://qa-task--oyettijon.replit.app",
  // How long waitFor... and expect checks keep retrying before they fail
  waitforTimeout: 10000,
  connectionRetryTimeout: 120000,
  connectionRetryCount: 3,

  framework: "mocha",
  mochaOpts: {
    ui: "bdd",
    timeout: 60000,
  },

  // ---------- Reports ----------
  // "spec" prints results in the terminal, "allure" creates the HTML report
  reporters: [
    ["spec", { showPreface: false }],
    [
      "allure",
      {
        outputDir: "allure-results",
        disableWebdriverStepsReporting: true,
      },
    ],
  ],
  // ---------- Hooks ----------
  // Slow mode: waits 1 second before every browser command so the run can be followed
  beforeCommand: async function () {
    if (process.env.SLOW) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  },

  // Runs after each test
  afterTest: async function (_test, _context, { passed }) {
    // Take a screenshot when a test fails; Allure attaches it to that test in the report
    if (!passed) {
      await browser.takeScreenshot();
    }

    // Slow mode: keeps the browser open for 3 seconds after each test
    if (process.env.SLOW) {
      await browser.pause(3000);
    }
  },
};
