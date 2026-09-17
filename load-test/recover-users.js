// Recovers test-users.json by logging in as the deterministic loadtest_N
// accounts instead of registering them — use this when the accounts already
// exist in the database (e.g. after test-users.json got lost/overwritten)
// rather than wiping the database and reseeding from scratch.
//
// Usage: node recover-users.js

import axios from "axios";
import { writeFileSync } from "fs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const USER_COUNT = Number(process.env.USER_COUNT) || 1000;
const CONCURRENCY = Number(process.env.CONCURRENCY) || 20;
const TEST_PASSWORD = process.env.TEST_PASSWORD || "LoadTest123!";
const OUTPUT_FILE = "./test-users.json";

const client = axios.create({ baseURL: BASE_URL, validateStatus: () => true });

async function loginUser(index) {
  const username = `loadtest_${index}`;
  const email = `loadtest_${index}@example.com`;

  const response = await client.post("/api/auth/login", {
    email,
    password: TEST_PASSWORD,
  });

  if (response.status !== 200) {
    console.error(`Failed to recover ${username}: ${response.status} ${JSON.stringify(response.data)}`);
    return null;
  }

  const userId = response.data?.data?.user?._id;
  if (!userId) {
    console.error(`Logged in as ${username} but no userId in response — check response shape.`);
    return null;
  }

  return { userId, username, email, password: TEST_PASSWORD };
}

async function run() {
  console.log(`Recovering ${USER_COUNT} users from ${BASE_URL} via login (concurrency: ${CONCURRENCY})...`);

  const results = [];
  let nextIndex = 0;
  let succeeded = 0;
  let failed = 0;

  async function worker() {
    while (nextIndex < USER_COUNT) {
      const index = nextIndex++;
      const user = await loginUser(index);
      if (user) {
        results.push(user);
        succeeded++;
      } else {
        failed++;
      }
      if ((succeeded + failed) % 100 === 0) {
        console.log(`Progress: ${succeeded + failed}/${USER_COUNT} (${succeeded} ok, ${failed} failed)`);
      }
    }
  }

  const workers = Array.from({ length: CONCURRENCY }, () => worker());
  await Promise.all(workers);

  if (succeeded === 0) {
    console.error("No users recovered. Either these accounts don't exist yet (run seed-users.js instead) or something else is wrong.");
    return;
  }

  writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`Done. ${succeeded} users recovered, ${failed} failed. Credentials written to ${OUTPUT_FILE}`);
}

run().catch((error) => {
  console.error("Recovery script crashed:", error);
  process.exit(1);
});