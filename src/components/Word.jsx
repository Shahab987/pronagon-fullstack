import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useRef } from "react";
import { FaPlay, FaStop } from "react-icons/fa";
import { BsFillTrash3Fill } from "react-icons/bs";

function Word({ item, deleteItem }) {
  const [playing, setPlaying] = useState(false);
  const [word, setWord] = useState({});
  const [ready, setReady] = useState(false);
  const [isSure, setIsSure] = useState(false);
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
    fetch(`http://127.0.0.1:5000/words/${item.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...item,
        audio_us: audioRef.current.currentSrc,
      }),
    });
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

  const toggleSure = () => {
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

  return (
    <div className="relative flex items-center w-full m-1 p-3 border rounded-lg  hover:shadow-md hover:border-red-600">
      <p className="font-semibold text-xl">{item?.name}</p>

      {item.audio_us.search("uk_pron") !== -1 && (
        <p className="text-red-600 font-bold ms-7">UK Pronounce</p>
      )}

      {!isSure && (
        <button className="absolute right-14" onClick={toggleSure}>
          <BsFillTrash3Fill className="text-gray-500 hover:text-red-700" />
        </button>
      )}
      {isSure && (
        <div className="absolute bg-gray-100 border p-3 right-16 top-0 rounded-xl border-red-600 flex items-center justify-center gap-4">
          <p>Sure?</p>
          <button onClick={() => deleteItem(item.id)}>Yes</button>
          <button onClick={toggleSure}>No</button>
        </div>
      )}

      <div className="flex gap-5 absolute right-4">
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
