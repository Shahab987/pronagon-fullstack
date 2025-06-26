import { useState, useEffect } from "react";
import { FaCrow, FaCrown, FaSignOutAlt } from "react-icons/fa";
import { IoClose, IoHandRight } from "react-icons/io5";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import startSoundFile from "./start.mp3";
import crowMedia from "./crow.mp3";
import toast from "react-hot-toast";
import SlotMachine from "./SlotMachine";

const Mine = () => {
  const { code } = useParams();
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [game, setGame] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState({});
  const [role, setRole] = useState("");
  const [nok, setNok] = useState(false);
  const [start, setStart] = useState(false);
  const [target, setTarget] = useState(null);
  const [word, setWord] = useState("");
  const [hideCard, setHideCard] = useState(false);
  const [playerName, setPlayerName] = useState(
    localStorage.getItem("playerName") || ""
  );
  const [isAdmin, setIsAdmin] = useState(
    JSON.parse(localStorage.getItem(`isAdmin-${code}`)) || false
  );
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem("MineSettings")) || {
      maxPlayers: 20,
      currentWord: "",
      wordSetBy: "",
    }
  );

  const playStartSound = () => new Audio(startSoundFile).play();
  const playCrow = () => new Audio(crowMedia).play();

  useEffect(() => {
    const newSocket = io(import.meta.env.VITE_SOCKET_URL);
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    if (!socket) return;

    socket.on("connect", () => {
      const pname = localStorage.getItem("playerName");
      const adminStatus = localStorage.getItem(`isAdmin-${code}`) === "true";
      if (pname && code) {
        if (adminStatus) {
          socket.emit("createMineRoom", { code, name: pname });
        } else {
          socket.emit("joinMineRoom", { code, name: pname });
        }
      }
    });

    socket.on("MineRoomCreated", setGame);

    socket.on("targetCardMine", ({ code, st, tr }) => {
      setStart(st);
      setTarget(tr);
    });

    socket.on("MineGameUpdated", (updatedGame, newStart) => {
      if (newStart === true) {
        playStartSound();
        setStart(false);
        setTarget(null);
      }

      setGame(updatedGame);
      const admin = updatedGame.players.find((p) => p.isAdmin);
      const pname = localStorage.getItem("playerName");
      const player = updatedGame.players.find((p) => p.name === pname);

      if (!player) {
        localStorage.clear();
        setPlayerName("");
        return;
      }

      setCurrentPlayer(player);
      localStorage.setItem("playerName", pname);
      const adminStatus = admin?.name === pname;
      setIsAdmin(adminStatus);
      localStorage.setItem(`isAdmin-${code}`, adminStatus.toString());
    });

    socket.on("error", (message) => {
      toast.error(message, { duration: 2000 }); // 2 seconds
    });

    if (playerName && code) joinGame();

    return () => {
      socket.off("connect");
      socket.off("MineRoomCreated");
      socket.off("MineGameUpdated");
      socket.off("targetCardMine");
      socket.off("error");
    };
  }, [socket, code]);

  useEffect(() => {
    if (game?.assignedRoles?.length > 0) {
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
    const pname = localStorage.getItem("playerName") || playerName;
    const adminStatus = localStorage.getItem(`isAdmin-${code}`) === "true";
    if (code && pname) {
      if (adminStatus) {
        socket.emit("createMineRoom", { code, name: pname });
      } else {
        socket.emit("joinMineRoom", { code, name: pname });
      }
    }
  };

  const startGame = () => socket?.emit("startMineGame", { code, settings });
  const submitWord = () =>
    socket?.emit("submitWordMineGame", { code, playerName, word });
  const removePlayer = (playerName) =>
    socket?.emit("removeMinePlayer", playerName, code);
  const handleExit = () => {
    setCurrentPlayer(null);
    socket?.emit("removeMinePlayer", currentPlayer.name, code);
  };
  const shuffleCard = () => {
    const totalCards = 5;
    socket?.emit("shuffleCardMine", code, !start, totalCards);
  };

  if (!game || !currentPlayer) {
    return (
      <div className="flex flex-col justify-center items-center">
        <p className="text-3xl mt-10 mb-5 text-gray-500">Mine Game Room</p>
        <input
          type="text"
          placeholder="Enter your name"
          className="p-2 mb-2 w-1/2 mt-3 font-semibold text-lg rounded"
          value={playerName}
          onChange={handleChange}
        />
        <button
          className="w-1/2 mt-3 flex items-center justify-center space-x-2 bg-gray-800 text-white py-2 px-4 rounded hover:bg-gray-950 transition"
          onClick={joinGame}
        >
          Join Game
        </button>
      </div>
    );
  }

  return (
    <div className="p-3">
      <button
        onClick={handleExit}
        className="absolute flex gap-2 justify-center items-center text-lg text-zinc-600 right-2"
      >
        <FaSignOutAlt />
      </button>
      {isAdmin && (
        <div className="admin-panel">
          <div className="flex justify-center">
            <button
              onClick={startGame}
              className="bg-blue-300 p-2 rounded-md w-52"
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
                  // implement change admin here
                } else {
                  setNok(!nok);
                  playCrow();
                }
              }}
              className={`relative flex gap-1 min-w-20 items-center justify-center text-zinc-700 font-semibold py-1 px-2 border rounded ${
                player.disconnected ? "bg-gray-300 opacity-70" : "bg-green-100"
              } ${isAdmin ? "cursor-pointer" : ""}`}
            >
              {player.isAdmin && (
                <span className="absolute -top-3 right-1 text-yellow-500">
                  <FaCrown />
                </span>
              )}
              {player.name === playerName && !player.isAdmin && (
                <span className="absolute -top-3.5 right-1 ">
                  <FaCrow
                    className={`absolute transition-all duration-500 ${
                      nok ? "rotate-45 right-0.5" : "rotate-0 right-8"
                    }`}
                  />
                </span>
              )}
              {player.name}
              <span
                className={`text-sm text-zinc-700 ms-1 ${
                  game.settings.wordSetBy === player.name ? "opacity-85" : ""
                }`}
              >
                {player.word && <IoHandRight />}
              </span>
              {isAdmin && (
                <button onClick={() => removePlayer(player.name)}>
                  <IoClose />
                </button>
              )}
            </li>
          ))}
        </ul>
      </div>

      {game?.status === "playing" &&
        !game.selectedWord &&
        currentPlayer?.role !== "nadoon" && (
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
              <div className="relative p-6 flex justify-center">
                <img
                  onClick={() => {
                    if (currentPlayer.role !== "sheytoon") {
                      setHideCard((p) => !p);
                    } else {
                      shuffleCard();
                    }
                  }}
                  className={`rounded-3xl max-w-md w-full ${
                    hideCard ? "opacity-15" : ""
                  }`}
                  src={`/img/${role}.png`}
                  alt="Role Card"
                />
                {start && (
                  <div className="absolute top-15">
                    <SlotMachine
                      start={start}
                      numCards={5}
                      duration={1}
                      target={target}
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Mine;
