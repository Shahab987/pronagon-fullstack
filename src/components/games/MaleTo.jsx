import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import { SOCKET_URL } from "../../api/config";
const socket = io(SOCKET_URL);

function MaleTo() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    player: "",
    gameCode: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    socket.on("error", (message) => {
      console.log("Received error:", message);
      setError(message);
    });

    socket.on("gameCreated", (gameData) => {
      console.log("Game created:", gameData);
      navigate(`/game/${gameData.gameCode}`, {
        state: {
          playerName: formData.player,
          isAdmin: true,
        },
      });
    });

    socket.on("gameJoined", (gameData) => {
      console.log("Game joined:", gameData);
      navigate(`/game/${gameData.gameCode}`, {
        state: {
          playerName: formData.player,
          isAdmin: false,
        },
      });
    });

    return () => {
      socket.off("error");
      socket.off("gameCreated");
      socket.off("gameJoined");
    };
  }, [navigate, formData.player]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setError(null);
  };

  const handleSubmit = (isCreating) => (e) => {
    e.preventDefault();
    if (!formData.player || !formData.gameCode) {
      setError("Please fill in all fields");
      return;
    }

    console.log("Submitting:", {
      isCreating,
      player: formData.player,
      gameCode: formData.gameCode,
    });

    if (isCreating) {
      socket.emit("createGame", {
        gameCode: formData.gameCode,
        playerName: formData.player,
      });
    } else {
      socket.emit("joinGame", {
        gameCode: formData.gameCode,
        playerName: formData.player,
      });
    }
  };

  return (
    <div className="max-w-md mx-auto p-4">
      <form>
        <div className="flex m-1 gap-1 mt-6">
          <label className="font-semibold w-2/12" htmlFor="player">
            Name:
          </label>
          <input
            className="border border-lime-700 rounded w-10/12"
            type="text"
            name="player"
            value={formData.player}
            onChange={handleChange}
            required
          />
        </div>
        <div className="flex m-1 gap-1">
          <label className="font-semibold w-2/12" htmlFor="gameCode">
            Code:
          </label>
          <input
            className="border border-lime-700 rounded w-10/12"
            type="text"
            name="gameCode"
            value={formData.gameCode}
            onChange={handleChange}
            required
          />
        </div>
        {error && <div className="text-red-500 text-center my-2">{error}</div>}
        <div className="flex gap-2 mt-4">
          <button
            type="submit"
            className="bg-lime-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit(true)}
          >
            Create Game
          </button>
          <button
            type="submit"
            className="bg-lime-600 text-white px-4 py-2 rounded"
            onClick={handleSubmit(false)}
          >
            Join Game
          </button>
        </div>
      </form>
    </div>
  );
}

export default MaleTo;
