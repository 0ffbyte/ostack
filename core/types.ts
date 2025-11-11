export type OStackConfig = {
  proxy: {
    protectedRoutes: string[];
  };
  stripe: {
    plans: {
      id: string;
      priceId: string;
      overagePriceId: string;
      includedQuota: number;
      limits?: Record<string, number>;
      features?: string[];
    }[];
    meterEvent: string;
    checkoutSuccessUrl: string;
    checkoutCancelUrl: string;
  };
  storage: {
    bucket: string;
  };
};

/**
 * core:
 * - db
 * - auth
 * - payment
 * - integration
 * - types.ts
 * lib:
 * - data
 *   - _schema.ts
 *   - user.ts
 *   - article.ts
 * - store.ts
 * - constants.ts
 * - utils.ts
 *
 */
