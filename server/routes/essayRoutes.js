const express = require("express");
const router = express.Router();
const EssayModel = require("../models/Essay");
const jwt = require("jsonwebtoken");

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
        const limit = parseInt(req.query._limit) || 2000;
        const skip = (page - 1) * limit;

        let query = {};
        if (req.query.search) {
          query.title = { $regex: req.query.search, $options: "i" };
        }

        const essays = await EssayModel.find(query).skip(skip).limit(limit);

        const totalCount = await EssayModel.countDocuments(query);
        const totalPages = Math.ceil(totalCount / limit);

        res.json({
          data: essays,
          pagination: {
            page,
            limit,
            totalCount,
            totalPages,
          },
        });
      } catch (error) {
        console.error("Error occurred while fetching essays from DB", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    }
  });
});

router.post("/add", async (req, res) => {
  try {
    const newEssay = await EssayModel.create(req.body);
    res.status(201).json(newEssay);
  } catch (error) {
    console.error("Error occurred while creating a word in MongoDB", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const updatedEssay = await EssayModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedEssay) {
      return res.status(404).json({ message: "Word not found" });
    }
    res.json(updatedEssay);
  } catch (error) {
    console.error("Error occurred while updating a word in MongoDB", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const deleteEssay = await EssayModel.findByIdAndDelete(req.params.id);
    if (!deleteEssay) {
      return res.status(404).json({ message: "Word not found" });
    }
    res.json(deleteEssay);
  } catch (error) {
    console.error("Error occurred while deleting a word in MongoDB", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

module.exports = router;
