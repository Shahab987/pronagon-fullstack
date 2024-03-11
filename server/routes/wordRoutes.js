const express = require("express");
const router = express.Router();
const WordModel = require("../models/Word");
const jwt = require("jsonwebtoken");

router.get("/", async (req, res) => {
  const authToken = req.cookies.authToken;

  jwt.verify(authToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      // Token verification failed
      console.error("Token verification failed:", err);
      // Handle unauthorized access (e.g., send a 401 response)
      res.status(401).json({ message: "Unauthorized" });
    } else {
      try {
        const page = parseInt(req.query._page) || 1;
        const limit = parseInt(req.query._limit) || 10;
        const skip = (page - 1) * limit;

        let query = {};
        if (req.query.search) {
          query.name = { $regex: req.query.search, $options: "i" };
        }
        if (req.query.exact) {
          query.name = req.query.exact;
        }
        if (req.query.level) {
          query.level = req.query.level;
        }

        let sort = {};
        if (req.query.sortBy) {
          sort[req.query.sortBy] = req.query.sortOrder === "desc" ? -1 : 1;
          if (req.query.sortBy === "length") {
            sort.name = 1;
          }
        }

        const words = await WordModel.find(query)
          .sort(sort)
          .skip(skip)
          .limit(limit);

        const totalCount = await WordModel.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        res.json({
          data: words,
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

router.get("/all", async (req, res) => {
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
