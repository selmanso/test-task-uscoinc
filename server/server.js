require("dotenv").config();
const express = require("express");
const axios = require("axios");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(bodyParser.json());
app.use(cors());

/**
 * GET /api/computeDistance
 * Query parameters:
 *   - origin: String address of the starting location.
 *   - destination: String address of the destination.
 *
 * This endpoint calls the PC*MILER API to get the driving (ground) distance between the two addresses.
 */
app.get("/api/computeDistance", async (req, res) => {
  const { origin, destination } = req.query;

  if (!origin || !destination) {
    return res
      .status(400)
      .json({ error: "Missing required parameters: origin and destination." });
  }

  try {
    // PC*MILER API configuration
    const pcmilerUrl = process.env.PCMILER_API_URL;
    const apiKey = process.env.PCMILER_API_KEY;

    if (!apiKey || !pcmilerUrl) {
      return res
        .status(500)
        .json({ error: "PC*MILER API configuration is missing." });
    }

    // Construct the request to PC*MILER.
    // Adjust parameters as per PC*MILER documentation.
    const response = await axios.get(pcmilerUrl, {
      params: {
        origin,
        destination,
        // Add any additional parameters required by the PC*MILER API here.
      },
      headers: {
        Authorization: `Bearer ${apiKey}`,
        // Add any other required headers (e.g., content-type) here.
      },
    });

    // Assume the PC*MILER API returns a JSON object with a property "distance"
    // Adjust this according to the actual API response.
    const distance = response.data.distance;

    return res.json({ groundMiles: distance });
  } catch (error) {
    console.error("Error fetching distance from PC*MILER:", error.message);

    // If PC*MILER returns an error, pass along its status and message.
    if (error.response) {
      return res
        .status(error.response.status)
        .json({ error: error.response.data });
    }

    return res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start the Express server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
