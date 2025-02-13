const express = require("express");
const router = express.Router();
const WordModel = require("../models/Word");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

router.get("/", async (req, res) => {
  const authToken = req.cookies.authToken;

  jwt.verify(authToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      // Token verification failed
      console.error("Token verification failed:", err);
      // Handle unauthorized access (e.g., send a 401 response)
      res.status(401).json({ message: "Unauthorized User" });
    } else {
      try {
        const page = parseInt(req.query._page) || 1;
        const limit = parseInt(req.query._limit) || 10;
        const skip = (page - 1) * limit;

        const user = await User.findOne({ _id: decoded.user.id });

        const query = {};

        // Dynamically handle query parameters
        Object.entries(req.query).forEach(([key, value]) => {
          switch (key) {
            case "search":
              query.name = { $regex: "^" + value, $options: "i" };
              break;
            case "exact":
              query.name = value;
              break;
            case "audio_us":
              query.audio_us = "";
              break;
            case "audio_src":
              query.audio_src = { $exists: false };
              break;
            case "source":
              query.source = value;
              break;
            // Add cases for known keys here
            default:
              // Optionally include unknown keys in the query object
              if (key !== "_limit" && key !== "_page" && key !== "level") {
                console.warn(`Unknown query parameter: ${key}`);

                query[key] = value;
              }
              break;
          }
        });

        let idArrays = [];
        if (user && user.level && Array.isArray(user.level[req.query.level])) {
          idArrays = user.level[req.query.level];
          query._id = { $in: idArrays };
        }

        let sort = {};
        if (req.query.sortBy) {
          sort[req.query.sortBy] = req.query.sortOrder === "desc" ? -1 : 1;
          if (req.query.sortBy === "length") {
            sort.name = 1;
          }
        } else {
          // sort["lastModified"] = 1;
          // sort["_id"] = 1;
        }

        const words = await WordModel.find(query).sort(sort).lean();

        let sortedWords = [];

        if (idArrays.length > 0 && !req.query.sortBy) {
          sortedWords = words
            .sort((a, b) => {
              const indexA = idArrays.indexOf(a._id.toString());

              const indexB = idArrays.indexOf(b._id.toString());

              return indexA - indexB;
            })
            .slice(skip)
            .slice(0, limit);
        } else {
          sortedWords = words.slice(skip).slice(0, limit);
        }

        const totalCount = await WordModel.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        res.json({
          data: sortedWords,
          userLevels: user.level,
          pagination: {
            page,
            limit,
            totalCount,
            totalPages,
          },
        });
      } catch (error) {
        console.error(
          "Error occurred while fetching words from MongoDB",
          error
        );
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
});

router.get("/all6", async (req, res) => {
  try {
    // const allWords = await WordModel.find({});
    const words6 = await WordModel.find({ meaning: "" }).limit(6);
    res.json(words6);
  } catch (error) {
    console.error(
      "Error occurred while fetching all words from MongoDB",
      error
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/checkmeaning", async (req, res) => {
  try {
    // const allWords = await WordModel.find({});
    const words6 = await WordModel.find({});
    res.json(words6);
  } catch (error) {
    console.error(
      "Error occurred while fetching all words from MongoDB",
      error
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/allaudio", async (req, res) => {
  try {
    // const allWords = await WordModel.find({});
    const words6 = await WordModel.find({});
    res.json(words6);
  } catch (error) {
    console.error(
      "Error occurred while fetching all words from MongoDB",
      error
    );
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.post("/", async (req, res) => {
  try {
    const newWord = await WordModel.create(req.body);
    res.status(201).json(newWord);
  } catch (error) {
    console.error("Error occurred while creating a word in MongoDB", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedWord = await WordModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedWord) {
      return res.status(404).json({ message: "Word not found" });
    }
    res.json(updatedWord);
  } catch (error) {
    console.error("Error occurred while updating a word in MongoDB", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deletedWord = await WordModel.findByIdAndDelete(req.params.id);
    if (!deletedWord) {
      return res.status(404).json({ message: "Word not found" });
    }
    res.json(deletedWord);
  } catch (error) {
    console.error("Error occurred while deleting a word in MongoDB", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
