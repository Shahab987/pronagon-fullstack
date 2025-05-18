import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaGamepad, FaRedhat } from "react-icons/fa";
import socket from "./socket";
import toast from "react-hot-toast";
console.log(socket);

function MineCreate() {
  const navigate = useNavigate();
  const [isCreating, setIsCreating] = useState(false);
  const [isJoining, setIsJoining] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    code: "",
  });
  const notif = (type, msg) => {
    if (type === "suc") {
      toast.success(msg);
    } else if (type === "err") {
      toast.error(msg);
    }
  };
  useEffect(() => {
    const socket = window.socket;

    socket.on("error", (message) => {
      console.log("Received error:", message);
      notif("err", message);
    });

    socket.on("connect", () => {
      console.log("Connected to WebSocket server", socket.id);
    });

    console.log("inside useEffect", socket.id);

    socket.on("roomCreated", (game, playerName) => {
      console.log("Game created:", game);
      // window.open(
      //   `http://localhost:3000/game/${game.gameCode}?name=ali`,
      //   "_blank",
      //   "noopener,noreferrer"
      // );
      // window.open(
      //   `http://localhost:3000/game/${game.gameCode}?name=mahdi`,
      //   "_blank",
      //   "noopener,noreferrer"
      // );
      // window.open(
      //   `http://localhost:3000/game/${game.gameCode}?name=maryam`,
      //   "_blank",
      //   "noopener,noreferrer"
      // );
      // window.open(
      //   `http://localhost:3000/game/${game.gameCode}?name=zahra`,
      //   "_blank",
      //   "noopener,noreferrer"
      // );
      // window.open(
      //   `http://localhost:3000/game/${game.gameCode}?name=pooya`,
      //   "_blank",
      //   "noopener,noreferrer"
      // );

      navigate(`/game/${game.gameCode}?name=${playerName}`, {
        state: {
          playerName,
          isAdmin: true,
          code: game.gameCode,
        },
      });
    });

    socket.on("playerJoined", (game, playerName) => {
      console.log("Game joined:", game);
      navigate(`/game/${game.gameCode}?name=${playerName}`, {
        state: {
          playerName,
          isAdmin: false,
          code: game.gameCode,
        },
      });
    });

    return () => {
      socket.off("connect");
      socket.off("roomCreated");
      socket.off("playerJoined");
    };
  }, [navigate]);

  const createMineGame = () => {
    const code = Math.floor(Math.random() * 900000) + 100000;
    localStorage.clear();
    localStorage.setItem(`isAdmin-${code}`, "true"); // Set admin flag

    navigate(`/mine/${code}`);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        {!isCreating && !isJoining && (
          <div className="">
            <button
              className=" w-full  flex items-center justify-center space-x-2 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-950 transition"
              onClick={createMineGame}
            >
              <FaRedhat />
              <span>Create Mine Room</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default MineCreate;
