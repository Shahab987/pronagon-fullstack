import { useState, useEffect } from "react";
import { FaCrow, FaCrown } from "react-icons/fa";
import { IoClose, IoHandRight } from "react-icons/io5";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import soundFile from "/audio/start.mp3";

const Mine = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [game, setGame] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [role, setRole] = useState("");
  const [nok, setNok] = useState(false);
  const [word, setWord] = useState("");
  const [isAdmin, setIsAdmin] = useState(
    JSON.parse(localStorage.getItem(`isAdmin-${code}`)) || false
  );
  const [hideCard, setHideCard] = useState(false);
  const [playerName, setPlayerName] = useState(
    localStorage.getItem("playerName") || ""
  );
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem("MineSettings")) || {
      maxPlayers: 20,
      currentWord: "",
      wordSetBy: "",
    }
  );
  const playSound = () => {
    const audio = new Audio(soundFile);
    audio.play();
  };
  useEffect(() => {
    console.log(import.meta.env.VITE_SOCKET_URL);

    const newSocket = io(import.meta.env.VITE_SOCKET_URL);
    console.log(newSocket);

    setSocket(newSocket);

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("MineRoomCreated", (updatedGame) => {
      console.log("Room created:", updatedGame);
      setGame(updatedGame);
    });

    socket.on("MineGameUpdated", (updatedGame) => {
      console.log("Game updated:", updatedGame);

      setGame(updatedGame);
      const admin = updatedGame.players.find((p) => p.isAdmin);
      const currntPlayerTemp = updatedGame.players.find(
        (p) => p.name === playerName
      );
      setCurrentPlayer(currntPlayerTemp);

      localStorage.clear();
      localStorage.setItem(`playerName`, playerName);

      if (admin.name === playerName) {
        console.log("setting local admin");
        setIsAdmin("true");
        localStorage.setItem(`isAdmin-${code}`, "true");
      } else {
        setIsAdmin("false");
        localStorage.setItem(`isAdmin-${code}`, "false");
      }
    });

    socket.on("error", (error) => {
      alert(error);
    });

    if (playerName && code) {
      joinGame();
    }

    return () => {
      socket.off("MineRoomCreated");
      socket.off("MineGameUpdated");
      socket.off("error");
    };
  }, [socket, code, navigate]);

  useEffect(() => {
    if (game?.assignedRoles.length > 0) {
      setRole(
        game.assignedRoles.find((r) => r.playerName === playerName)?.role
      );
    }
    if (game) {
      setIsAdmin(game?.players?.find((p) => p.name === playerName)?.isAdmin);
    }
  }, [game]);

  const handleChange = (e) => {
    setPlayerName(e.target.value);
    localStorage.setItem("playerName", e.target.value);
  };

  const joinGame = () => {
    console.log("nameee", code, playerName, isAdmin);

    localStorage.setItem("playerName", playerName);
    if (code && playerName) {
      if (isAdmin) {
        console.log("emmiting create");

        socket.emit("createMineRoom", { code, name: playerName });
      } else {
        console.log("emmiting join");

        socket.emit("joinMineRoom", { code, name: playerName });
      }
    }
  };

  const startGame = () => {
    if (!socket) return;
    playSound();

    localStorage.setItem("MineSettings", JSON.stringify(settings));
    socket.emit("startMineGame", { code, settings });
  };
  const submitWord = () => {
    if (!socket) return;

    socket.emit("submitWordMineGame", { code, playerName, word });
  };

  const removePlayer = (playerToRemove) => {
    if (!socket) return;
    socket.emit("removeMinePlayer", playerToRemove, code);
  };

  if (!game) {
    return (
      <div className="flex flex-col justify-center items-center">
        <p className="text-3xl mt-10 mb-5 text-gray-500">Mine Game Room</p>
        <input
          type="text"
          placeholder="Enter your name"
          className="p-2 mb-2 w-1/2 mt-3 font-semibold text-lg rounded"
          value={playerName}
          onChange={(e) => handleChange(e)}
        />
        <button
          className=" w-1/2 mt-3 flex items-center justify-center space-x-2 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-950 transition"
          onClick={joinGame}
        >
          Join Game
        </button>
      </div>
    );
  }

  return (
    <div className="p-3">
      {isAdmin && (
        <div className="admin-panel">
          <div className="flex justify-center">
            <button
              onClick={startGame}
              className="bg-blue-300 p-2 rounded-md w-52 "
            >
              {game?.status === "playing" ? "Restart Game" : "Start Game"}
            </button>
          </div>
        </div>
      )}
      <div className="py-4">
        <ul className="flex flex-wrap mt-1 gap-1">
          {game?.players?.map((player) => (
            <li
              key={player.name}
              onClick={() => {
                if (isAdmin) {
                  socket.emit("MineChangeAdmin", {
                    name: player.name,
                    code,
                  });
                } else {
                  setNok(!nok);
                }
              }}
              className={`relative flex gap-1 min-w-20 items-center justify-center text-zinc-700 font-semibold py-1 px-2 border rounded ${
                player.disconnected ? "bg-gray-300 opacity-70" : "bg-green-100 "
              } ${isAdmin ? "cursor-pointer" : ""} `}
            >
              {player.isAdmin && (
                <span className="absolute -top-3 right-1 text-yellow-500">
                  <FaCrown />
                </span>
              )}
              {player.name === playerName && !player.isAdmin && (
                <span className="absolute -top-3 right-1 ">
                  <FaCrow className={` ${nok ? "rotate-45" : ""}`} />
                </span>
              )}

              {player.name}
              <span className="text-sm text-zinc-700 ms-1">
                {player.word && <IoHandRight />}
              </span>
              {isAdmin && (
                <>
                  <button onClick={() => removePlayer(player.name)}>
                    <IoClose />
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      </div>
      {game?.status === "playing" && !game.selectedWord && (
        <div className="mb-4">
          <input
            type="text"
            className="border border-gray-300 rounded-md p-2 w-full"
            placeholder="Enter a word..."
            value={word}
            onChange={(e) => setWord(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter" && word) {
                submitWord();
                setWord("");
              }
            }}
          />
          <button
            onClick={() => {
              if (word) {
                submitWord();
                setWord("");
              }
            }}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md w-full"
          >
            Submit Word
          </button>
        </div>
      )}
      {game.selectedWord && currentPlayer?.role !== "nadoon" && (
        <div className="flex flex-col items-center justify-center">
          <p>Selected Word</p>
          <p className="font-VazirMatn text-2xl my-2 py-2 px-4 bg-zinc-200 text-zinc-500 rounded-lg">
            {game.selectedWord}
          </p>
        </div>
      )}

      <div className="player-view">
        {game?.status === "playing" && game?.assignedRoles && (
          <div className="role-card">
            <h3>
              Your Role:{" "}
              <span
                className={`font-semibold text-lg ms-2 ${
                  hideCard ? "opacity-15" : ""
                }`}
              >
                {role}
              </span>
            </h3>
            {role && (
              <div className="p-6 flex justify-center">
                <img
                  onClick={() => setHideCard((p) => !p)}
                  className={`rounded-3xl max-w-md w-full ${
                    hideCard ? "opacity-15" : ""
                  }`}
                  src={`/img/${role}.png`}
                  alt="Role Card"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mine;
