const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
require("dotenv").config();
const http = require("http");
const { Server } = require("socket.io");
const Game = require("./models/Game");

const { generateResponse } = require("./openai");
const { generateResponseArray } = require("./openaiArr");
const { huggingfaceApi } = require("./huggingFace");
const { getTextFromURL } = require("./utils/scraper");
const { deepSeek } = require("./deepSeek");
const distributeRoles = require("./utils/distributeRoles");

const cookieParser = require("cookie-parser");
const axios = require("axios");
const fs = require("fs");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3001",
    methods: ["GET", "POST"],
  },
});
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

const playwrightRoutes = require("./routes/playwrightRoutes");
app.use("/api/playwright", playwrightRoutes);

app.get("/api/openai", async (req, res) => {
  const wordExist = await WordModel.findOne({ name: req.query.word });
  if (wordExist) {
    res.json(wordExist);
    return;
  }
  const result = await generateResponse(req.query.word);
  if (result) {
    console.log("AI result: ", result);

    if (Array.isArray(result.meaning)) {
      result.meaning = result.meaning.join(" ");
    }

    if (!wordExist) {
      const newWord = await WordModel.create({
        name: result.word,
        ...result,
        length: result.word.length,
        level: 0,
      });
      console.log("existingObject: ", newWord);

      res.json(newWord);
    } else {
      res.json(wordExist);
    }
  } else {
    try {
      const meaning = await getTextFromURL(
        `https://abadis.ir/entofa/${req.query.word}/`
      );

      const newWord = await WordModel.create({
        name: req.query.word,
        length: req.query.word.length,
        meaning: meaning,
        level: 0,
      });
      console.log("existingObject22: ", newWord);

      res.json(newWord);
    } catch (err) {
      console.error("Error calling OpenAI endpoint", err);
      res.status(500).json({ error: "An error occurred" });
    }
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

app.get("/api/hfapi", async (req, res) => {
  try {
    const result = await huggingfaceApi(req.query.prompt); // Call the huggingFaceApi function
    res.json(result); // Send the Hugging Face response back to the client
  } catch (error) {
    console.error("Error calling AI endpoint:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
  }
});

app.get("/api/deepseekapi", async (req, res) => {
  try {
    const result = await deepSeek(req.query.prompt); // Call the huggingFaceApi function
    res.json(result); // Send the Hugging Face response back to the client
  } catch (error) {
    console.error("Error calling AI endpoint:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing the request." });
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

// Track active socket connections
const activePlayers = new Map();

io.on("connection", (socket) => {
  console.log("New connection:", socket.id);

  socket.on("createGame", async ({ gameCode, playerName }) => {
    try {
      await Game.deleteOne({ gameCode });
      // Check if game already exists
      const existingGame = await Game.findOne({ gameCode });
      if (existingGame) {
        socket.emit("error", "Game code already exists");
        return;
      }

      // Create new game
      const newGame = new Game({
        gameCode,
        players: [
          {
            id: socket.id,
            name: playerName,
            isAdmin: true,
          },
        ],
        status: "waiting",
        settings: {
          maxPlayers: 20,
          currentWord: "",
          wordSetBy: "",
        },
      });

      await newGame.save();

      // Track player
      activePlayers.set(socket.id, { gameCode, playerName });

      // Join socket room
      socket.join(gameCode);

      // Emit success event
      socket.emit("gameCreated", newGame);

      // Broadcast game state
      io.to(gameCode).emit("gameStateUpdate", newGame);
    } catch (error) {
      console.error("Error creating game:", error);
      socket.emit("error", "Failed to create game");
    }
  });

  socket.on("joinGame", async ({ gameCode, playerName }) => {
    try {
      // Find existing game
      const game = await Game.findOne({ gameCode });
      if (!game) {
        socket.emit("error", "Game not found");
        return;
      }

      // Check for duplicate name
      const isDuplicateName = game.players.some(
        (p) => p.name.toLowerCase() === playerName.toLowerCase()
      );

      if (isDuplicateName && !game.players.some((p) => p.id === socket.id)) {
        socket.emit("error", "Name already taken in this game");
        return;
      }

      // Check if game is full
      if (game.players.length >= game.settings.maxPlayers) {
        socket.emit("error", "Game is full");
        return;
      }

      // If player isn't already in the game, add them
      if (!game.players.some((p) => p.id === socket.id)) {
        game.players.push({
          id: socket.id,
          name: playerName,
          isAdmin: game.players.length === 0, // First player becomes admin
        });
      }
      await game.save();

      // Track player
      activePlayers.set(socket.id, { gameCode, playerName });

      // Join socket room
      socket.join(gameCode);

      // Emit success event
      socket.emit("gameJoined", game);

      // Broadcast updated game state
      const updatedGame = await Game.findOne({ gameCode }); // Fetch fresh data
      console.log("✅ Updated game state:", updatedGame);
      io.to(gameCode).emit("gameStateUpdate", updatedGame);
      console.log("Player joined:", playerName);
    } catch (error) {
      console.error("Error joining game:", error);
      socket.emit("error", "Failed to join game");
    }
  });

  socket.on("getGameState", async ({ gameCode }) => {
    try {
      const game = await Game.findOne({ gameCode });
      if (game) {
        socket.emit("gameStateUpdate", game);
      }
    } catch (error) {
      console.error("Error getting game state:", error);
    }
  });

  socket.on("leaveGame", async ({ gameCode, playerName }) => {
    try {
      const game = await Game.findOneAndUpdate(
        { gameCode },
        { $pull: { players: { name: playerName } } },
        { new: true }
      );

      if (game) {
        // If there are still players and no admin, make the first player admin
        if (game.players.length > 0 && !game.players.some((p) => p.isAdmin)) {
          game.players[0].isAdmin = true;
          await game.save();
        }

        // Broadcast updated state to all players
        io.to(gameCode).emit("gameStateUpdate", game);
      }
    } catch (error) {
      console.error("Error handling player leave:", error);
    }
  });

  // Handle disconnections
  socket.on("disconnect", async () => {
    const playerData = activePlayers.get(socket.id);
    if (playerData) {
      const { gameCode } = playerData;
      try {
        const game = await Game.findOneAndUpdate(
          { gameCode },
          { $pull: { players: { id: socket.id } } },
          { new: true }
        );

        if (game && game.players.length > 0) {
          // If admin disconnected, assign new admin
          const hasAdmin = game.players.some((p) => p.isAdmin);
          if (!hasAdmin) {
            game.players[0].isAdmin = true;
            await game.save();
          }
          io.to(gameCode).emit("gameStateUpdate", game);
        } else if (game && game.players.length === 0) {
          // Delete empty game
          await Game.deleteOne({ gameCode });
        }
      } catch (error) {
        console.error("Error handling disconnect:", error);
      }
      activePlayers.delete(socket.id);
    }
  });

  socket.on("startGame", async ({ gameCode }) => {
    try {
      const game = await Game.findOne({ gameCode });
      if (!game) {
        socket.emit("error", "Game not found");
        return;
      }

      const playerCount = game.players.length;
      const roles = distributeRoles(playerCount);

      // Assign roles to players
      game.players = game.players.map((player, index) => ({
        ...player,
        role: roles[index],
      }));

      // Select a random boodoon player for word input
      const boodoonPlayers = game.players.filter((p) => p.role === "boodoon");
      const randomBoodoon =
        boodoonPlayers[Math.floor(Math.random() * boodoonPlayers.length)];

      game.status = "playing";
      game.settings.wordSetBy = randomBoodoon.name;

      await game.save();
      io.to(gameCode).emit("gameStateUpdate", game);
    } catch (error) {
      console.error("Error starting game:", error);
      socket.emit("error", "Failed to start game: " + error.message);
    }
  });

  socket.on("submitWord", async ({ gameCode, word }) => {
    try {
      const game = await Game.findOneAndUpdate(
        { gameCode },
        {
          "settings.currentWord": word,
          "settings.wordSetBy": "",
        },
        { new: true }
      );
      io.to(gameCode).emit("gameStateUpdate", game);
    } catch (error) {
      console.error("Error submitting word:", error);
    }
  });

  socket.on("restartGame", async ({ gameCode }) => {
    try {
      const game = await Game.findOne({ gameCode });
      if (!game) {
        socket.emit("error", "Game not found");
        return;
      }

      const playerCount = game.players.length;
      const roles = distributeRoles(playerCount);

      // Reassign roles to players
      game.players = game.players.map((player, index) => ({
        ...player,
        role: roles[index],
      }));

      // Select a random boodoon player for word input
      const boodoonPlayers = game.players.filter((p) => p.role === "boodoon");
      const randomBoodoon =
        boodoonPlayers[Math.floor(Math.random() * boodoonPlayers.length)];

      game.status = "playing";
      game.settings.wordSetBy = randomBoodoon.name;
      game.settings.currentWord = ""; // Reset the current word

      await game.save();
      io.to(gameCode).emit("gameStateUpdate", game);
    } catch (error) {
      console.error("Error restarting game:", error);
      socket.emit("error", "Failed to restart game: " + error.message);
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
