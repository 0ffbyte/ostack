"use client";
import { generateImage } from "@/app/(protected)/library/actions";
import { Button } from "@/components/ui/button";
import { authClient } from "@/core/auth/auth-client";
import useAppStore from "@/lib/store";

export default function TriggerAlert() {
  const setAlert = useAppStore((state) => state.setAlert);
  const session = authClient.useSession();

  const handleClick = async () => {
    await generateImage()
      .then(() => {
        setAlert({
          title: "Alert",
          message: `Hello ${
            session.data?.user?.name ?? "world"
          }, Image generated successfully!`,
        });
      })
      .catch(() => {
        setAlert({
          title: "Error",
          message: `Hello ${
            session.data?.user?.name ?? "world"
          }, Image generation failed!`,
        });
      });
  };
  return <Button onClick={handleClick}>Trigger Alert</Button>;
}
