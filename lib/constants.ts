/** Example Plans */
export const Plans = [
  {
    name: "mini",
    priceId: process.env.STRIPE_PRICE_ID_MINI!,
    annualPriceId: process.env.STRIPE_PRICE_ID_MINI_ANNUAL!,
    overagePriceId: process.env.STRIPE_PRICE_ID_MINI_OVERAGE!,
    monthlyCost: 9.99,
    description: "mini plan",
    limits: {
      generations: 100,
    },
  },
];
