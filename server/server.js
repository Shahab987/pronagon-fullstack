const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();

const { generateResponse } = require("./openai");
const { generateResponseArray } = require("./openaiArr");

const cookieParser = require("cookie-parser");
const axios = require("axios");
const fs = require("fs");

const app = express();
const PORT = process.env.PORT || 3003;

app.use(express.static(path.join(__dirname)));
app.use("/assets", express.static(path.join(__dirname, "assets")));

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
const WordModel = require("./models/Word");
app.use("/api/words", wordRoutes);

const userRoutes = require("./routes/userRoutes");
app.use("/api/auth", userRoutes);

const essayRoutes = require("./routes/essayRoutes");
app.use("/api/essay", essayRoutes);

app.get("/api/openai", async (req, res) => {
  try {
    const result = await generateResponse(req.query.word);
    console.log("AI result: ", result);
    const wordExist = await WordModel.findOne({ name: result.word });
    if (!wordExist) {
      const newWord = await WordModel.create({
        name: result.word,
        ...result,
        length: result.word.length,
      });
      console.log("existingObject: ", newWord);

      res.json(newWord);
    } else {
      res.json(wordExist);
    }
  } catch (error) {
    console.error("Error calling OpenAI endpoint:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

app.get("/api/openaiarr", async (req, res) => {
  try {
    const result = await generateResponseArray(req.query.word);
    res.json(result);
  } catch (error) {
    console.error("Error calling OpenAI endpoint:", error);
    res.status(500).json({ error: "An error occurred" });
  }
});

// Define a route to handle file download request
app.post("/api/saveaudio", async (req, res) => {
  const { url, path: filePath } = req.body;

  try {
    const response = await axios({
      url: url,
      method: "GET",
      responseType: "stream",
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/123.0.0.0 Safari/537.36", // Specify user-agent header to avoid issues
      },
    });
    const directory = path.dirname(filePath);
    if (!fs.existsSync(directory)) {
      fs.mkdirSync(directory, { recursive: true });
    }

    const writer = fs.createWriteStream(filePath);

    response.data.pipe(writer);
    console.log(directory);
    writer.on("finish", () => {
      res.status(200).send("File downloaded successfully");
    });

    writer.on("error", (err) => {
      console.error("Error downloading file:", err);
      res.status(500).send("Error downloading file");
    });
  } catch (err) {
    console.error("Error downloading file:", err);
    res.status(500).send("Error downloading file");
  }
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "index.html"));
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
