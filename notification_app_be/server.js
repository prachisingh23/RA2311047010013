const express = require("express");
const axios = require("axios");

const app = express();
app.use(express.json());

let TOKEN = "";

// REGISTER
async function register() {
  let attempts = 3;

  while (attempts > 0) {
    try {
      const res = await axios.post(
        "http://20.207.122.201/evaluation-service/register",
        {
          email: "ps6822@srmist.edu.in",
          name: "Prachi Singh",
          mobileNo: "9456222779",
          githubUsername: "prachisingh23",
          rollNo: "RA2311047010013",
          accessCode: "QkbpxH"
        },
        { timeout: 10000 }
      );

      console.log("✅ REGISTER SUCCESS:", res.data);
      return res.data;

    } catch (err) {
      console.log("Retrying... attempts left:", attempts - 1);
      attempts--;
      await new Promise(res => setTimeout(res, 3000));
    }
  }

  throw new Error("Registration failed after retries");
}

// AUTH TOKEN
async function getAuthToken(clientID, clientSecret) {
  try {
    const res = await axios.post(
      "http://20.207.122.201/evaluation-service/auth",
      {
        email: "ps6822@srmist.edu.in",
        name: "Prachi Singh",
        rollNo: "RA2311047010013",
        accessCode: "QkbpxH",
        clientID,
        clientSecret
      },
      { timeout: 10000 }
    );

    TOKEN = res.data.access_token;

    console.log("TOKEN RECEIVED:");
    console.log(TOKEN);

  } catch (err) {
    console.log("AUTH ERROR:");
    console.log(err.response?.data || err.message);
  }
}

//  LOG FUNCTION (MAIN REQUIREMENT)
async function Log(stack, level, pkg, message) {
  try {
    await axios.post(
      "http://20.207.122.201/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message
      },
      {
        headers: {
          Authorization: `Bearer ${TOKEN}`
        },
        timeout: 5000
      }
    );
  } catch (err) {
    console.log(" Log failed");
  }
}

// TEST API
app.get("/test", async (req, res) => {
  await Log("backend", "info", "route", "Test API called");
  res.json({ message: "API Working" });
});

// START EVERYTHING
async function start() {
  console.log("Skipping register due to server issue");

  // TEMP TOKEN (dummy for now)
  TOKEN = "dummy_token";

  app.listen(3000, () => {
    console.log("Server running at http://localhost:3000");
  });
}

start();