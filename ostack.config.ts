import { OstackConfig } from "./types";

const config: OstackConfig = {
  name: "OStack",
  description: "The Ominstack",
  logo: "https://i.imgur.com/0k5y4w6.png",
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
      monthlyCost: 9.99,
      description: "mini plan",
      limits: {
        generations: 100,
      },
    },
    {
      id: "plus",
      priceId:
        process.env.NODE_ENV === "development"
          ? "price_1SPlFt5nzQqSqsEEOlXnnhEf"
          : "",
      overagePriceId:
        process.env.NODE_ENV === "development"
          ? "price_1SPsY05nzQqSqsEELI5Z3Idj"
          : "",
      monthlyCost: 19.99,
      description: "plus plan",
      limits: {
        generations: 250,
      },
    },
  ],
  meterEventName: "energy",
  r2Bucket: "omni",
};

export default config;
