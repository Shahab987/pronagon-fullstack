const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const axios = require("axios");

const { generateResponse } = require("./openai");

const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.static(path.join(__dirname)));
app.use("/assets", express.static(path.join(__dirname, "assets")));

// Define a route to serve the React app

app.use(cookieParser());

app.use(express.json());
app.use(
  cors({
    origin: process.env.ALLOW_ORIGIN,
    credentials: true,
  })
);

mongoose
  .connect(process.env.DATABASE_URL, {
    authSource: "admin",
  })
  .then(() => {
    console.log("hooray ! Connected to MongoDB");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

const wordRoutes = require("./routes/wordRoutes");
app.use("/api/words", wordRoutes);

// const wordRoutes = require('./routes/wordRoutes');
// app.use('/words', validateToken, wordRoutes); // Protect routes with token validation middleware

const userRoutes = require("./routes/userRoutes");
app.use("/api/auth", userRoutes);

app.get("/api/openai", async (req, res) => {
  try {
    const result = await generateResponse(req.query.word);
    res.json(result);
  } catch (error) {
    console.error("Error calling OpenAI endpoint:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
