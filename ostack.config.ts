import { OStackConfig } from "@/core/types";

const config: OStackConfig = {
  proxy: {
    protectedRoutes: ["/library", "/account"],
  },
  stripe: {
    plans: [
      {
        id: "mini",
        priceId:
          process.env.NODE_ENV === "development"
            ? "price_1SOIbg5nzQqSqsEE5ic4doig"
            : "",
        overagePriceId:
          process.env.NODE_ENV === "development"
            ? "price_1SOJoS5nzQqSqsEErc67TxxP"
            : "",
        includedQuota: 100,
      },
    ],
    meterEvent: "energy",
    checkoutSuccessUrl: `${process.env.BETTER_AUTH_URL}/`,
    checkoutCancelUrl: `${process.env.BETTER_AUTH_URL}/`,
  },
  storage: {
    bucket: "omni",
  },
};

export default config;
