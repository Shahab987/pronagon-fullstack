import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { FaPlay, FaStop, FaTrashAlt } from "react-icons/fa";
import { BsBookmarkFill } from "react-icons/bs";
import { BASE_URL } from "../api/config";
import { toast } from "react-hot-toast";

function Word2({
  item,
  deleteItem,
  currentExpand,
  setCurrentExpand,
  itemsPerPage,
}) {
  const [playing, setPlaying] = useState(false);
  const [word, setWord] = useState({});
  const [ready, setReady] = useState(false);
  const [isSure, setIsSure] = useState(false);
  const [level, setLevel] = useState(item?.level || 0);
  const [levelColor, setLevelColor] = useState("text-stone-300");
  const [didMount, setDidMount] = useState(false);
  const [isSettingLevel, setIsSettingLevel] = useState(false);

  const audioRef = useRef();
  const [url, setUrl] = useState({
    l1: "",
    l3: "",
    l5: "",
    word: "",
    word2: "",
  });

  const stop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const setAudioUrl = () => {
    console.log(item._id);
    axios
      .put(`${BASE_URL}/words/${item._id}`, {
        ...item,
        audio_us: audioRef.current.currentSrc,
      })
      .then((res) => console.log(res))
      .catch((err) => console.error(err));
  };

  const genAudioUrl = () => {
    if (item?.name?.length === 2) {
      setUrl({
        l1: item?.name?.slice(0, 1),
        l3: item?.name?.slice(0, 3) + "_",
        l5: item?.name?.slice(0, 5) + "__u",
        word: item.name,
        word2: item?.name?.slice(0, -2),
      });
    }
    if (item?.name?.length === 3) {
      setUrl({
        l1: item?.name?.slice(0, 1),
        l3: item?.name?.slice(0, 3),
        l5: item?.name?.slice(0, 5) + "__",
        word: item.name,
        word2: item?.name?.slice(0, -2),
      });
    }

    if (item?.name?.length === 4) {
      setUrl({
        l1: item?.name?.slice(0, 1),
        l3: item?.name?.slice(0, 3),
        l5: item?.name?.slice(0, 5) + "_",
        word: item.name,
        word2: item?.name?.slice(0, -2),
      });
    }

    if (item?.name?.length > 4) {
      setUrl({
        l1: item?.name?.slice(0, 1),
        l3: item?.name?.slice(0, 3),
        l5: item?.name?.slice(0, 5),
        word: item.name,
        word2: item?.name?.slice(0, -2),
      });
    }
    if (item?.name?.slice(0, 3) === "con") {
      setUrl({
        l1: "x",
        l3: "x" + item?.name?.slice(0, 2),
        l5: "x" + item?.name?.slice(0, 4),
        word: "x" + item.name,
        word2: "x" + item?.name?.slice(0, -2),
      });
    }
  };

  const toggleSure = (id) => {
    if (id) {
      deleteItem(id);
    }
    setIsSure(!isSure);
  };

  const toggleExpand = (e) => {
    setCurrentExpand((prev) => {
      if (prev !== item._id) {
        return item._id;
      } else {
        return -1;
      }
    });
  };

  useEffect(() => {
    genAudioUrl();
  }, []);

  useEffect(() => {
    if (ready && !item.audio_us) {
      setAudioUrl();
    }
  }, [ready]);

  useEffect(() => {
    switch (level) {
      case 0:
        setLevelColor("bg-stone-300");
        break;
      case 1:
        setLevelColor("bg-lime-600");
        break;
      case 2:
        setLevelColor("bg-purple-600");
        break;
      case 3:
        setLevelColor("bg-yellow-500");
        break;
      case 4:
        setLevelColor("bg-red-600");
        break;

      default:
        break;
    }

    if (didMount) {
      setIsSettingLevel(false);
      axios
        .put(`${BASE_URL}/words/${item._id}`, {
          ...item,
          level,
        })
        .then((res) => {
          if (res.status === 200) {
            toast.success("Tag changed");
          }
        });
    } else {
      setDidMount(true);
    }
  }, [level]);

  const reset = (e) => {
    if (isSettingLevel) {
      setIsSettingLevel(false);
    }
    if (isSure) {
      setIsSure(false);
    }
  };

  return (
    <div
      onClick={(e) => {
        reset(e);
        toggleExpand(e);
      }}
      className="relative flex flex-col items-center w-full p-3
       border rounded-lg gap-2  hover:shadow-md hover:bg-gray-50 max-w-3xl mx-auto"
    >
      <div
        className={`h-full w-[6px] md:w-2 absolute rounded-s-lg left-0 top-0  ${levelColor}`}
      ></div>
      <div className="flex items-center w-full py-0 ps-1">
        <p className="font-semibold  2xs:text-lg w-full md:w-fit cursor-pointer me-3">
          {item?.name}
        </p>

        <p className="hidden md:block bg-slate-100 rounded-md px-2 text-lg text-zinc-500 ">
          ({item.pronunciation})
        </p>

        <p
          dir="rtl"
          className="hidden md:block text-sm bg-slate-100 rounded-md px-2 py-1 me-auto ms-5  font-IranSans  font-bold text-cyan-950"
        >
          {item.meaning}
        </p>

        {/* ------------------------ buttons  */}
        <div
          onClick={(e) => e.stopPropagation()}
          className={`icons flex items-center gap-2 xs:gap-5  text-xl ${
            itemsPerPage === "1" ? "hidden" : ""
          }`}
        >
          <div className={`flex gap-1 2xs:gap-2 xs:gap-3 text-xl `}>
            <button onClick={(e) => setLevel(0)}>
              <BsBookmarkFill className="text-stone-300" />
            </button>
            <button onClick={(e) => setLevel(1)}>
              <BsBookmarkFill className="text-lime-600" />
            </button>
            <button onClick={(e) => setLevel(2)}>
              <BsBookmarkFill className="text-purple-600" />
            </button>
            <button onClick={(e) => setLevel(3)}>
              <BsBookmarkFill className="text-yellow-500" />
            </button>
            <button onClick={(e) => setLevel(4)}>
              <BsBookmarkFill className="text-red-600" />
            </button>
          </div>

          {!playing ? (
            <button disabled={!ready}>
              <FaPlay
                className={`hover:text-blue-700 ${
                  itemsPerPage === "1" && "text-2xl"
                }`}
                style={{ color: !ready && "gray" }}
                onClick={() => audioRef.current.play()}
              />{" "}
            </button>
          ) : (
            <button disabled={!ready}>
              <FaStop onClick={() => stop()} />
            </button>
          )}
        </div>
      </div>
      {/* ------------------------ details  */}
      {(currentExpand === item._id || itemsPerPage === "1") && (
        <div className="w-full" onClick={(e) => e.stopPropagation()}>
          <div className="flex md:hidden items-center justify-between w-full bg-slate-100 px-2 py-1 mt-1 rounded-md">
            <p className="text-lg text-zinc-500 w-full">
              ({item.pronunciation})
            </p>
            <p dir="rtl" className="font-IranSans  font-bold text-cyan-950">
              {item.meaning}
            </p>
          </div>
          <div className="flex items-center w-full justify-between ps-2 mt-1">
            <p>Ex: {item.example}</p>

            <button
              className="text-xl"
              onClick={(e) => {
                toggleSure(null);
              }}
            >
              <FaTrashAlt className="text-zinc-600 hover:text-red-700" />
            </button>
            {isSure && (
              <div className="absolute bg-gray-100 border p-3 right-20  rounded-xl border-gray-700 flex items-center justify-center gap-4">
                <p>Sure?</p>
                <button onClick={() => toggleSure(item._id)}>Yes</button>
                <button onClick={() => toggleSure(false)}>No</button>
              </div>
            )}
          </div>
        </div>
      )}
      {/* ------------------------ Audio tag  */}
      <div id="audioTag" className="absolute">
        {item?.audio_us && (
          <audio
            onCanPlay={() => setReady(true)}
            ref={audioRef}
            // preload="auto"
            onPlay={() => {
              setPlaying(true);
            }}
            onPause={() => {
              setPlaying(false);
            }}
            type="audio/mpeg"
          >
            <source src={item.audio_us} />
            Your browser does not support the audio tag.
          </audio>
        )}
        {url.l1 && !item?.audio_us && (
          <audio
            onCanPlay={() => setReady(true)}
            ref={audioRef}
            // preload="auto"
            onPlay={() => {
              setPlaying(true);
            }}
            onPause={() => {
              setPlaying(false);
            }}
            type="audio/mpeg"
          >
            <source
              src={`https://www.oxfordlearnersdictionaries.com/us/media/english/us_pron/${url.l1}/${url.l3}/${url.l5}/${url.word}__us_1.mp3`}
            />
            <source
              src={`https://www.oxfordlearnersdictionaries.com/us/media/english/us_pron/${url.l1}/${url.l3}/${url.l5}/${url.word}__1_us_1.mp3`}
            />
            <source
              src={`https://www.oxfordlearnersdictionaries.com/us/media/english/us_pron/${url.l1}/${url.l3}/${url.l5}/${url.word2}__us_1.mp3`}
            />
            <source
              src={`https://www.oxfordlearnersdictionaries.com/us/media/english/us_pron/${url.l1}/${url.l3}/${url.l5}/${url.word}__1_us_2.mp3`}
            />
            <source
              src={`https://www.ldoceonline.com/media/english/ameProns/${item.name}.mp3`}
            />
            <source
              src={`https://www.farsidic.com/Content/Voice/${item.name}.mp3`}
            />
            <source
              src={`https://www.oxfordlearnersdictionaries.com/us/media/english/uk_pron/${url.l1}/${url.l3}/${url.l5}/${url.word}__gb_1.mp3`}
            />
            Your browser does not support the audio tag.
          </audio>
        )}
      </div>

      <div
        className={`icons flex items-center gap-6 mt-3   ${
          itemsPerPage === "1" ? "" : "hidden"
        }`}
      >
        <div className={`flex gap-1 2xs:gap-2 xs:gap-3 text-3xl `}>
          <button onClick={(e) => setLevel(0)}>
            <BsBookmarkFill className="text-stone-300" />
          </button>
          <button onClick={(e) => setLevel(1)}>
            <BsBookmarkFill className="text-lime-600" />
          </button>
          <button onClick={(e) => setLevel(2)}>
            <BsBookmarkFill className="text-purple-600" />
          </button>
          <button onClick={(e) => setLevel(3)}>
            <BsBookmarkFill className="text-yellow-500" />
          </button>
          <button onClick={(e) => setLevel(4)}>
            <BsBookmarkFill className="text-red-600" />
          </button>
        </div>

        {!playing ? (
          <button disabled={!ready}>
            <FaPlay
              className={`hover:text-blue-700 text-3xl`}
              style={{ color: !ready && "gray" }}
              onClick={() => audioRef.current.play()}
            />{" "}
          </button>
        ) : (
          <button disabled={!ready}>
            <FaStop onClick={() => stop()} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Word2;
