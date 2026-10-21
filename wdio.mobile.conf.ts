import { config as baseConfig } from "./wdio.conf.ts";

export const config: WebdriverIO.Config = {
  ...baseConfig,
  specs: ["src/specs/mobile/**/*.ts"],
  exclude: [],
  capabilities: [
    {
      browserName: "chrome",
      "goog:chromeOptions": {
        // iPhone 16 screen size (393 × 852) with a mobile user agent
        mobileEmulation: {
          deviceMetrics: { width: 393, height: 852, pixelRatio: 3 },
          userAgent:
            "Mozilla/5.0 (iPhone; CPU iPhone OS 18_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/18.0 Mobile/15E148 Safari/604.1",
        },
      },
    },
  ],
};
