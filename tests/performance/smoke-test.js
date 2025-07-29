import http from "k6/http"
import { check, sleep, __VU, __ITER } from "k6"

export const options = {
  vus: 10, // 10 virtual users
  duration: "30s", // for 30 seconds
  thresholds: {
    http_req_failed: ["rate<0.01"], // http errors should be less than 1%
    http_req_duration: ["p(95)<200"], // 95% of requests should be below 200ms
  },
}

const BASE_URL = "http://localhost:5000/api" // Backend API URL

export default function () {
  // Simulate user login
  const loginRes = http.post(
    `${BASE_URL}/users/login`,
    JSON.stringify({
      username: "testuser", // Ensure this user exists in your DB or register it in a setup phase
      password: "testpassword",
    }),
    {
      headers: { "Content-Type": "application/json" },
    },
  )

  check(loginRes, {
    "login successful": (resp) => resp.status === 200 && resp.json() && resp.json().token !== undefined,
  })

  const token = loginRes.json() ? loginRes.json().token : ""

  if (token) {
    // Simulate fetching items
    const itemsRes = http.get(`${BASE_URL}/items`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    check(itemsRes, {
      "get items successful": (resp) => resp.status === 200,
    })

    // Simulate creating an item
    const newItem = {
      name: `Test Item ${__VU}-${__ITER}`, // Use VU and ITER for unique names
      description: "This is a test item created during a smoke test.",
      quantity: Math.floor(Math.random() * 100) + 1,
      price: Number.parseFloat((Math.random() * 100).toFixed(2)),
    }

    const createItemRes = http.post(`${BASE_URL}/items`, JSON.stringify(newItem), {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })

    check(createItemRes, {
      "create item successful": (resp) => resp.status === 201,
    })
  }

  sleep(1) // Simulate user thinking time
}
