/**
 * Playground 1.0.0
 */

import { client } from "@/core/integration/upstash";
const data = await client.schedules.list();

console.log("active schedules:", data);
