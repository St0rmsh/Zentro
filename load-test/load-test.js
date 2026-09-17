// k6 load test for the REST API under ~1000 concurrent users.
// Does NOT test the Socket.io real-time layer — see the note in chat.
//
// Prerequisites:
//   1. RATE_LIMIT_MAX raised in the target environment (see app.ts change)
//   2. test-users.json produced by seed-users.js, sitting next to this file
//
// Run:  k6 run load-test.js
// Override target: k6 run -e BASE_URL=https://your-domain.com load-test.js

import http from "k6/http";
import { check, sleep } from "k6";
import { SharedArray } from "k6/data";

const BASE_URL = __ENV.BASE_URL || "http://localhost:3000";

// SharedArray loads this once and shares it (read-only) across all VUs,
// instead of every VU parsing its own copy of the JSON file.
const users = new SharedArray("test users", function () {
  return JSON.parse(open("./test-users.json"));
});

export const options = {
  scenarios: {
    ramping_users: {
      executor: "ramping-vus",
      startVUs: 0,
      stages: [
        { duration: "1m", target: 200 },   // warm-up
        { duration: "2m", target: 1000 },  // ramp to full 1000 users
        { duration: "5m", target: 1000 },  // sustain peak load
        { duration: "2m", target: 0 },     // ramp down
      ],
    },
  },
  thresholds: {
    http_req_failed: ["rate<0.02"],       // less than 2% of requests should fail
    http_req_duration: ["p(95)<800"],     // 95% of requests under 800ms
    "http_req_duration{endpoint:login}": ["p(95)<1000"],
  },
};

function pickUser() {
  // Deterministic per-VU mapping (not random) so each virtual user
  // consistently acts as the same seeded account across its iterations,
  // avoiding two VUs racing to log in as the same account simultaneously.
  const index = (__VU - 1) % users.length;
  return users[index];
}

export default function () {
  const user = pickUser();

  // --- Login ---
  const loginRes = http.post(
    `${BASE_URL}/api/auth/login`,
    JSON.stringify({ email: user.email, password: user.password }),
    { headers: { "Content-Type": "application/json" }, tags: { endpoint: "login" } }
  );

  const loginOk = check(loginRes, {
    "login succeeded": (r) => r.status === 200,
  });

  if (!loginOk) {
    // Don't waste iteration time hammering downstream endpoints with no session.
    sleep(1);
    return;
  }

  sleep(Math.random() * 1 + 0.5); // brief pause, like a real user reading the page

  // --- Weighted mix of realistic actions ---
  const roll = Math.random();

  if (roll < 0.55) {
    // Browsing the feed — the most common action on a social app
    const res = http.get(`${BASE_URL}/api/feed?page=1&limit=10`, { tags: { endpoint: "feed" } });
    check(res, { "feed loaded": (r) => r.status === 200 });
  } else if (roll < 0.75) {
    // Checking notifications
    const unread = http.get(`${BASE_URL}/api/notification/unread-count`, { tags: { endpoint: "notifications" } });
    check(unread, { "unread count loaded": (r) => r.status === 200 });

    const list = http.get(`${BASE_URL}/api/notification?page=1&limit=5`, { tags: { endpoint: "notifications" } });
    check(list, { "notification list loaded": (r) => r.status === 200 });
  } else if (roll < 0.9) {
    // Checking messages inbox
    const res = http.get(`${BASE_URL}/api/messages/inbox`, { tags: { endpoint: "inbox" } });
    check(res, { "inbox loaded": (r) => r.status === 200 });
  } else {
    // Sending a message to another seeded test user (real userId, captured
    // during seeding from the register response).
    const otherUser = users[__VU % users.length];

    if (otherUser.userId && otherUser.userId !== user.userId) {
      const res = http.post(
        `${BASE_URL}/api/messages/${otherUser.userId}`,
        JSON.stringify({ content: `Load test message at ${Date.now()}` }),
        { headers: { "Content-Type": "application/json" }, tags: { endpoint: "send_message" } }
      );
      check(res, { "message sent": (r) => r.status === 201 });
    }
  }

  sleep(Math.random() * 2 + 1); // think time between 1-3s
}