import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";

// Move socket outside component to maintain connection
const socket = io("http://localhost:3003");

function GameRoom() {
  const navigate = useNavigate();
  const { gameCode } = useParams();
  const location = useLocation();
  const { playerName, isAdmin } = location.state || {};
  const [gameState, setGameState] = useState({
    players: [],
    status: "waiting",
    settings: {
      maxPlayers: 20,
      currentWord: "",
      wordSetBy: "",
    },
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!playerName) {
      navigate("/yours");
      return;
    }

    console.log("Socket connection status:", socket.connected);
    console.log("Current socket ID:", socket.id);

    // Set up listeners for game updates
    const handleGameUpdate = (newGameState) => {
      console.log("Received game update:", newGameState);
      setGameState(newGameState); // Replace entire state object
      let currentPlayer = newGameState.players.filter(
        (p) => p.name === playerName
      );
      console.log("---------------------", currentPlayer);
    };

    const handleError = (errorMessage) => {
      console.log("Received error:", errorMessage);
      setError(errorMessage);
    };

    // Subscribe to game updates
    socket.on("gameStateUpdate", handleGameUpdate);
    socket.on("error", handleError);

    // Request initial game state immediately
    console.log("Requesting game state for code:", gameCode);
    socket.emit("getGameState", { gameCode });

    // Cleanup function
    return () => {
      socket.off("gameStateUpdate", handleGameUpdate);
      socket.off("error", handleError);
      socket.emit("leaveGame", { gameCode, playerName });
    };
  }, [gameCode, playerName, navigate]);

  useEffect(() => {
    console.log("Socket connection status:", socket.connected);

    socket.on("connect", () => {
      console.log("Reconnected! Socket ID:", socket.id);
    });

    socket.on("disconnect", (reason) => {
      console.log("Disconnected:", reason);
    });

    return () => {
      socket.off("connect");
      socket.off("disconnect");
    };
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      console.log("Requesting game state...");
      socket.emit("getGameState", { gameCode });
    }, 5000); // 5 seconds

    return () => clearInterval(interval); // Cleanup on unmount
  }, [gameCode]); // Runs when `gameCode` changes

  const removePlayer = (playerToRemove) => {
    if (!isAdmin) return;
    socket.emit("removePlayer", { gameCode, playerName: playerToRemove });
  };

  const startGame = () => {
    if (!isAdmin) return;
    socket.emit("startGame", { gameCode });
  };

  const restartGame = () => {
    if (!isAdmin) return;
    socket.emit("restartGame", { gameCode });
  };

  const submitWord = (word) => {
    if (gameState.settings.wordSetBy !== playerName) return;
    socket.emit("submitWord", { gameCode, word });
  };

  // Debug log
  console.log("Current game state:", gameState);
  console.log("Current players:", gameState.players);

  return (
    <div className="max-w-4xl mx-auto p-4">
      {/* Game Code Display */}
      <div className="mb-4 text-center">
        <h2 className="text-xl font-bold">Game Code: {gameCode}</h2>
        <p>Your Name: {playerName}</p>
        {isAdmin && <p className="text-green-600">You are the admin</p>}
      </div>

      {/* Player List */}
      <div className="mb-6">
        <h2 className="text-xl font-bold mb-3">
          Players ({gameState.players.length})
        </h2>
        <div className="grid grid-cols-2 gap-2">
          {Array.isArray(gameState.players) &&
            gameState.players.map((player) => (
              <div
                key={player.id}
                className="flex justify-between items-center p-2 bg-gray-100 rounded"
              >
                <span>
                  {player.name}
                  {player.isAdmin && (
                    <span className="text-green-600"> (Admin)</span>
                  )}
                </span>
                {isAdmin && player.name !== playerName && (
                  <button
                    onClick={() => removePlayer(player.name)}
                    className="text-red-500 hover:text-red-700"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
        </div>
      </div>

      {/* Admin Controls */}
      {isAdmin && gameState.status === "waiting" && (
        <div className="mb-6">
          <button
            onClick={startGame}
            className="bg-lime-600 text-white px-4 py-2 rounded mr-2"
            disabled={gameState.players.length < 4}
          >
            Start Game{" "}
            {gameState.players.length < 4 && "(Need at least 4 players)"}
          </button>
        </div>
      )}

      {isAdmin && gameState.status === "playing" && (
        <div className="mb-6">
          <button
            onClick={restartGame}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Restart Game
          </button>
        </div>
      )}

      {/* Game Status */}
      {gameState.status === "playing" && (
        <div className="mb-6">
          {gameState.settings.wordSetBy === playerName ? (
            <div>
              <h3 className="font-bold mb-2">Enter a word:</h3>
              <input
                type="text"
                className="border border-lime-700 rounded p-2"
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    submitWord(e.target.value);
                    e.target.value = "";
                  }
                }}
              />
            </div>
          ) : gameState.settings.currentWord &&
            gameState.players.find((p) => p.name === playerName)?.role !==
              "nadoon" ? (
            <div>
              <h3 className="font-bold mb-2">The word is:</h3>
              <p className="text-xl">{gameState.settings.currentWord}</p>
            </div>
          ) : null}

          {/* Show role to current player */}
          <div className="mt-4">
            <h3 className="font-bold">Your Role:</h3>
            <p className="text-xl">
              {gameState.players.find((p) => p.name === playerName)?.role ||
                "Waiting for game to start..."}
            </p>
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </div>
  );
}

export default GameRoom;
