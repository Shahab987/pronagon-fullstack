const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendEmail } = require("../mailsender");

const cookieOptions = {
  httpOnly: true, // Cookie is only accessible on the server side
  maxAge: 7 * 24 * 60 * 60 * 1000, // Max age of the cookie set to one week
};

// Register
router.post("/register", async (req, res) => {
  try {
    const { email, password } = req.body;
    // Check if user already exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: "User already exists" });
    }
    // Create new user
    user = new User({ email, password });
    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    // Save user to database
    await user.save();

    // Generate an activation token
    const activationToken = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "1d" } // Token expires in 1 day
    );

    const activationLink = `${req.protocol}://${req.get(
      "host"
    )}/api/auth/activate/${activationToken}`;

    await sendEmail(
      "security-noreply@mosaleh.ir",
      user.email,
      "Account Activation",
      `<p>Click <a href="${activationLink}">here</a> to activate your account.</p>`
    ).then((resp) => console.log(resp));

    res.json({
      message: "Register Successful. Activation email sent.",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

router.get("/activate/:token", async (req, res) => {
  const { token } = req.params;

  try {
    // Verify the activation token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Extract user ID from the decoded token
    const userId = decoded.userId;

    // Find the user by ID in the database
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Activate the user by updating the 'isActive' field to true
    user.isActive = true;
    await user.save();

    // Optionally, you can redirect the user to a success page
    res.redirect("/activation-success");
  } catch (error) {
    console.error(error.message);
    res.status(400).json({ message: "Invalid or expired token" });
  }
});

// Login
router.post("/login", async (req, res) => {
  const authToken = req.cookies.authToken;
  if (authToken) {
    // Authentication logic using authToken
    console.log("Auth token:", authToken);
  } else {
    console.log("Auth token not found");
  }
  try {
    const { email, password } = req.body;
    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(400)
        .json({ message: "User with this email does not exist" });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password" });
    }
    // Generate token
    const payload = {
      user: {
        id: user._id,
      },
    };
    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: 7 * 24 * 60 * 60 * 1000 },
      (err, token) => {
        if (err) throw err;

        // Set the cookie in the response with maxAge set to one week
        res.cookie("authToken", token, cookieOptions);

        res.json({
          message: "Login Successful",
          token,
          id: user._id,
          email: user.email,
        });
      }
    );
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

//token check
router.post("/checkToken", (req, res) => {
  // Read the authToken from the request cookies
  const authToken = req.cookies.authToken;

  jwt.verify(authToken, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      // Token verification failed
      console.error("Token verification failed:", err);
      // Handle unauthorized access (e.g., send a 401 response)
      res.status(401).json({ message: "Unauthorized" });
    } else {
      // Token is valid
      console.log("Decoded token:", decoded);
      const user = await User.findOne(decoded.id);
      if (!user) {
        res
          .status(400)
          .json({ message: "User with this email does not exist" });
      } else {
        res.json({
          message: "Wellcome Back",
          token: authToken,
          id: user._id,
          email: user.email,
        });
      }
    }
  });
});

// Logout
router.post("/logout", async (req, res) => {
  try {
    // Clear the authentication token cookie
    res.clearCookie("authToken", cookieOptions);
    console.log("logout");
    res.json({ message: "Logout successful" });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
