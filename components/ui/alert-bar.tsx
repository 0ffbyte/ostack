"use client";
import React from "react";
import { H2, P } from "./typography";
import { AnimatePresence, motion, scale } from "motion/react";
import useAppStore from "@/lib/store";
import { Button } from "./button";
import { GlassMaterial } from "@/lib/constants";

export default function AlertBar() {
  const [isVisible, setIsVisible] = React.useState(false);
  const alert = useAppStore((state) => state.alert);

  React.useEffect(() => {
    if (!alert) {
      setIsVisible(false);
      return;
    }

    setIsVisible(true);

    const timerId = setTimeout(() => {
      setIsVisible(false);
    }, 5000);

    return () => clearTimeout(timerId);
  }, [alert]);

  return (
    <div className="fixed w-full h-fit flex items-center justify-center pt-2 pointer-events-none">
      <AnimatePresence>
        {isVisible && alert && (
          <motion.div
            whileTap={{
              scale: 0.9,
            }}
            layout
            initial={{
              filter: "blur(8px)",
              opacity: 0,
              y: -100,
              scale: 0.8,
            }}
            animate={{
              filter: "blur(0px)",
              opacity: 1,
              y: 0,
              scale: 1,
              transition: {
                type: "spring",
                stiffness: 200,
                damping: 18,
                opacity: { duration: 0.2 },
                filter: { duration: 0.2 },
              },
            }}
            exit={{ filter: "blur(8px)", opacity: 0, y: -80, scale: 0.8 }}
            className="max-w-[260px] min-w-[128px] w-fit p-4 pr-4 rounded-[32px] flex justify-start items-start pointer-events-auto gap-2"
            style={GlassMaterial}
            tabIndex={0}
          >
            <motion.div
              layout
              className="hidden h-[42px] rounded-[42px] aspect-square bg-zinc-400"
            />
            <motion.div
              key={alert.timestamp}
              layout="position"
              initial={{ opacity: 0, filter: "blur(8px)" }}
              animate={{
                opacity: 1,
                filter: "blur(0px)",
                transition: { delay: 0.1 },
              }}
              className="flex flex-col"
            >
              <P>{alert.title}</P>
              <P className="text-sm mb-2">{alert.message}</P>
              <Button className="w-fit" onClick={() => setIsVisible(false)}>
                Dismiss
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
