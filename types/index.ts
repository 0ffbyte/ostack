export type OstackConfig = {
  name: string;
  description: string;
  logo: string;
  plans: {
    id: string;
    priceId: string;
    overagePriceId: string;
    monthlyCost: number;
    description: string;
    limits: {
      generations: number;
    };
  }[];
  meterEventName: string;
};
