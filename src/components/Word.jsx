import React from "react";
import axios from "axios";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { FaPlay, FaStop, FaTrashAlt } from "react-icons/fa";
import { BsBookmarkFill } from "react-icons/bs";
import { BASE_URL } from "../api/config";
import { toast } from "react-hot-toast";

function Word({ item, deleteItem, FetchWords }) {
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
    if (item.name.length === 2) {
      setUrl({
        l1: item.name.slice(0, 1),
        l3: item.name.slice(0, 3) + "_",
        l5: item.name.slice(0, 5) + "__u",
        word: item.name,
        word2: item.name.slice(0, -2),
      });
    }
    if (item.name.length === 3) {
      setUrl({
        l1: item.name.slice(0, 1),
        l3: item.name.slice(0, 3),
        l5: item.name.slice(0, 5) + "__",
        word: item.name,
        word2: item.name.slice(0, -2),
      });
    }

    if (item.name.length === 4) {
      setUrl({
        l1: item.name.slice(0, 1),
        l3: item.name.slice(0, 3),
        l5: item.name.slice(0, 5) + "_",
        word: item.name,
        word2: item.name.slice(0, -2),
      });
    }

    if (item.name.length > 4) {
      setUrl({
        l1: item.name.slice(0, 1),
        l3: item.name.slice(0, 3),
        l5: item.name.slice(0, 5),
        word: item.name,
        word2: item.name.slice(0, -2),
      });
    }
    if (item.name.slice(0, 3) === "con") {
      setUrl({
        l1: "x",
        l3: "x" + item.name.slice(0, 2),
        l5: "x" + item.name.slice(0, 4),
        word: "x" + item.name,
        word2: "x" + item.name.slice(0, -2),
      });
    }
  };

  const toggleSure = (id) => {
    if (id) {
      deleteItem(id);
    }
    setIsSure(!isSure);
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
        setLevelColor("text-stone-300");
        break;
      case 1:
        setLevelColor("text-lime-600");
        break;
      case 2:
        setLevelColor("text-purple-600");
        break;
      case 3:
        setLevelColor("text-yellow-500");
        break;
      case 4:
        setLevelColor("text-red-600");
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
            FetchWords();
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
      onClick={(e) => reset(e)}
      className="relative flex items-center w-full p-3 border rounded-lg  hover:shadow-md hover:border-red-600"
    >
      <p className="font-semibold  xs:text-lg ">{item?.name}</p>

      {item.audio_us.search("uk_pron") !== -1 && (
        <p className="text-red-600 font-bold ms-7">UK</p>
      )}

      {/* ------------------------ buttons  */}
      <div className="icons flex items-center gap-3 xs:gap-6 ms-auto text-xl ">
        <button onClick={() => setIsSettingLevel(true)}>
          <BsBookmarkFill className={levelColor} />
        </button>
        {isSettingLevel && (
          <div className="absolute right-24 bg-white border p-1 rounded-md shadow">
            <button onClick={() => setLevel(0)}>
              <BsBookmarkFill className="text-stone-300" />
            </button>
            <button onClick={() => setLevel(1)}>
              <BsBookmarkFill className="text-lime-600" />
            </button>
            <button onClick={() => setLevel(2)}>
              <BsBookmarkFill className="text-purple-600" />
            </button>
            <button onClick={() => setLevel(3)}>
              <BsBookmarkFill className="text-yellow-500" />
            </button>
            <button onClick={() => setLevel(4)}>
              <BsBookmarkFill className="text-red-600" />
            </button>
          </div>
        )}

        <button className="" onClick={() => toggleSure(null)}>
          <FaTrashAlt className="text-zinc-600 hover:text-red-700" />
        </button>
        {isSure && (
          <div className="absolute bg-gray-100 border p-3 right-20  rounded-xl border-gray-700 flex items-center justify-center gap-4">
            <p>Sure?</p>
            <button onClick={() => toggleSure(item._id)}>Yes</button>
            <button onClick={() => toggleSure(false)}>No</button>
          </div>
        )}

        {!playing ? (
          <button disabled={!ready}>
            <FaPlay
              className="hover:text-blue-700"
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

      <div id="audioTag">
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
    </div>
  );
}

export default Word;
