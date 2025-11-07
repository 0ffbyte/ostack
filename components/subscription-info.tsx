import { H2, P } from "./ui/typography";

import { getUserSubscription, getCurrentUsage } from "@/lib/db/queries";
import { verifySession } from "@/lib/auth/session";

export default async function SubscriptionInfo() {
  const { user } = await verifySession();
  const subscription = await getUserSubscription(user.id);
  const usage = await getCurrentUsage(user.id);
  return (
    <div className="flex flex-col">
      <H2>Subscription Info</H2>
      <P>Plan: {subscription?.currentPlanId}</P>
      <P>Included Quota: {subscription?.includedQuota}</P>
      <P>Cancel at Period End: {subscription?.cancelAtPeriodEnd.toString()}</P>
      <P>
        Downgrade at Period End: {subscription?.downgradeAtPeriodEnd.toString()}
      </P>
      <P>Total Usage: {usage?.totalUsage}</P>
    </div>
  );
}
