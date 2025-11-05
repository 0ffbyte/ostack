/** Example Plans */
export const Plans = [
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
];

/** Styling */
export const GlassMaterial = {
  border: "none",
  backdropFilter: "blur(4px)",
  boxShadow:
    "inset 0px 0px 0px 1px rgba(0, 0, 0, 0.1), inset 0px 1px 1px 1px rgba(255, 255, 255, 1), inset 0px 4px 8px 2px rgba(0, 0, 0, 0.05), inset 0px -1px 1px 1px rgba(255, 255, 255, 0.8), inset 0px -4px 8px 0px rgba(255, 255, 255, 0.5), 0px -4px 32px 0px rgba(255, 255, 255, 0.32), 0px 12px 32px 0px rgba(0, 0, 0, 0.05)",
};
