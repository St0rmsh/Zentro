// Seeds N test user accounts via the real /api/auth/register endpoint so
// they go through actual validation and password hashing — no guessing at
// the User schema's required fields or bcrypt salt rounds.
//
// Run this AFTER raising RATE_LIMIT_MAX in your load-testing environment,
// or this script itself will get 429'd by your own rate limiter.
//
// Usage: node seed-users.js
// Configure via env vars: BASE_URL, USER_COUNT, CONCURRENCY, TEST_PASSWORD

import axios from "axios";
import { writeFileSync } from "fs";

const BASE_URL = process.env.BASE_URL || "http://localhost:3000";
const USER_COUNT = Number(process.env.USER_COUNT) || 1000;
const CONCURRENCY = Number(process.env.CONCURRENCY) || 20;
const TEST_PASSWORD = process.env.TEST_PASSWORD || "LoadTest123!";
const OUTPUT_FILE = "./test-users.json";

const client = axios.create({ baseURL: BASE_URL, validateStatus: () => true });

async function registerUser(index) {
  const username = `loadtest_${index}`;
  const email = `loadtest_${index}@example.com`;

  const response = await client.post("/api/auth/register", {
    fullname: `Load Test User ${index}`,
    username,
    email,
    password: TEST_PASSWORD,
  });

  if (response.status !== 201) {
    console.error(`Failed to register ${username}: ${response.status} ${JSON.stringify(response.data)}`);
    return null;
  }

  const userId = response.data?.data?.user?._id;

  return { userId, username, email, password: TEST_PASSWORD };
}

async function run() {
  console.log(`Seeding ${USER_COUNT} users against ${BASE_URL} (concurrency: ${CONCURRENCY})...`);

  const results = [];
  let nextIndex = 0;
  let succeeded = 0;
  let failed = 0;

  async function worker() {
    while (nextIndex < USER_COUNT) {
      const index = nextIndex++;
      const user = await registerUser(index);
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

  writeFileSync(OUTPUT_FILE, JSON.stringify(results, null, 2));
  console.log(`Done. ${succeeded} users seeded, ${failed} failed. Credentials written to ${OUTPUT_FILE}`);

  if (failed > 0) {
    console.warn("Some users failed to seed — check your rate limit and server logs before running the load test.");
  }
}

run().catch((error) => {
  console.error("Seeding script crashed:", error);
  process.exit(1);
});