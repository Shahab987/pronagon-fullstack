const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3003;

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

// Middleware to validate token
function validateToken(req, res, next) {
  const token = req.headers["authorization"];
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(403).json({ message: "Forbidden" });
    req.user = decoded.user; // Attach decoded user information to request object
    next();
  });
}

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
