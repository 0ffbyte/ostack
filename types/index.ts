export type OstackConfig = {
  name: string;
  description: string;
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
  r2Bucket: string;
};
