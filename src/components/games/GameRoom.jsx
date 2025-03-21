import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { SOCKET_URL } from "../../api/config";
import { FaConnectdevelop } from "react-icons/fa";
import { TbPlugConnectedX } from "react-icons/tb";
const socket = io(SOCKET_URL);

function GameRoom() {
  const navigate = useNavigate();
  const { gameCode } = useParams();
  const location = useLocation();
  const { playerName } = location.state || {};
  const [gameState, setGameState] = useState({
    players: [],
    status: "waiting",
    settings: {
      maxPlayers: 20,
      currentWord: "",
      wordSetBy: "",
    },
  });

  const [isAdmin, setIsAdmin] = useState(false);

  const [error, setError] = useState(null);
  const [word, setWord] = useState("");

  useEffect(() => {
    if (!playerName) {
      navigate("/yours");
      return;
    }

    // Set up listeners for game updates
    const handleGameUpdate = (newGameState) => {
      setGameState(newGameState); // Replace entire state object
    };

    const handleError = (errorMessage) => {
      console.log("Received error:", errorMessage);
      setError(errorMessage);
    };

    // Subscribe to game updates
    socket.on("gameStateUpdate", handleGameUpdate);
    socket.on("error", handleError);

    const interval = setInterval(() => {
      socket.emit("getGameState", { gameCode });
    }, 1000); // 1 seconds

    // Cleanup function
    return () => {
      socket.off("gameStateUpdate", handleGameUpdate);
      socket.off("error", handleError);
      socket.emit("leaveGame", { gameCode, playerName });
      clearInterval(interval);
    };
  }, [gameCode, playerName, navigate]);

  useEffect(() => {
    if (gameState.players.length > 0) {
      setIsAdmin(gameState.players.find((p) => p.name === playerName)?.isAdmin);
    }
  }, [gameState]);

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
  const reConnect = () => {
    socket.emit("joinGame", {
      gameCode: gameCode,
      playerName: playerName,
    });
  };

  const submitWord = (word) => {
    if (gameState.settings.wordSetBy !== playerName) return;
    socket.emit("submitWord", { gameCode, word });
  };

  // Debug log
  console.log("Current game state:", gameState);
  console.log("Current players:", gameState.players);

  return (
    <div className="max-w-4xl mx-auto p-2">
      {/* Game Code Display */}
      <div className="flex font-semibold justify-center gap-2 mb-4 text-center">
        <p>{playerName}</p>
        {isAdmin && <p className="text-green-600">- admin</p>}
        <p className="ms-5">Players ({gameState.players.length})</p>
        {!gameState.players.find((p) => p.name === playerName) && (
          <button
            className="px-2 bg-orange-200 rounded ms-2 "
            onClick={reConnect}
          >
            <TbPlugConnectedX />
          </button>
        )}
      </div>

      {/* Player List */}
      <div className="mb-4">
        <div className="flex gap-2 flex-wrap">
          {Array.isArray(gameState.players) &&
            gameState.players.map((player) => (
              <div
                key={player.id}
                className="flex text-sm justify-between items-center p-1 bg-gray-100 rounded"
              >
                <span className="pe-3">
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
        <div className="mb-6 flex justify-center">
          <button
            onClick={startGame}
            className="bg-lime-600 text-white px-4 py-2 rounded mr-2 "
            disabled={gameState.players.length < 4}
          >
            Start Game{" "}
            {gameState.players.length < 4 && "(Need at least 4 players)"}
          </button>
        </div>
      )}

      {isAdmin && gameState.status === "playing" && (
        <div className="mb-6 flex justify-center">
          <button
            onClick={restartGame}
            className="bg-blue-600 text-white px-4 py-2 rounded active:bg-blue-950 hover:bg-blue-700"
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
                className="border border-r-0 border-lime-700 rounded-l-md p-2"
                value={word}
                onKeyUp={(e) => {
                  if (e.key === "Enter") {
                    submitWord(e.target.value);
                    e.target.value = "";
                  }
                }}
                onChange={(e) => setWord(e.target.value)}
              />
              <button
                className="border border-lime-700 rounded-r-md p-2 px-4 font-semibold bg-lime-600 text-gray-50"
                onClick={() => {
                  if (word) {
                    submitWord(word);
                  }
                }}
              >
                Go
              </button>
            </div>
          ) : gameState.settings.currentWord &&
            gameState.players.find((p) => p.name === playerName)?.role !==
              "nadoon" ? (
            <div>
              <h3 className="font-bold mb-2">The word is:</h3>
              <p className="text-2xl ">{gameState.settings.currentWord}</p>
            </div>
          ) : null}

          {/* Show role to current player */}
          <div className="mt-4 flex flex-col justify-center items-center">
            <div className="flex gap-3 items-center">
              <h3 className="font-bold">Role:</h3>
              <p className="text-xl">
                {gameState.players.find((p) => p.name === playerName)?.role ||
                  "Waiting for game to start..."}
              </p>
            </div>
            <img
              className="w-8/12 rounded-2xl"
              src={`/${
                gameState.players.find((p) => p.name === playerName)?.role
              }.png`}
            />
            {/* <img className="w-8/12 rounded-2xl" src={`/nadoon.png`} /> */}
          </div>
        </div>
      )}

      {/* Error Display */}
      {error && <div className="text-red-500 text-center mt-4">{error}</div>}
    </div>
  );
}

export default GameRoom;
