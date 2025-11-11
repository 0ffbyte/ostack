"use server";
import { withTransaction } from "@/core/auth/middleware";
/**
 * Example use of 'withTransaction' to generate an image.
 * It checks if user has enough credits and increments usage on success.
 */
export const generateImage = async () => {
  await withTransaction(async () => {
    // do something
    console.log("triggered action");

    // simulate error
    //throw new Error("Simulated error");
  }, 4);
};
