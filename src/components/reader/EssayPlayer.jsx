import React, { useState, useEffect, useRef } from "react";
import {
  BiLeftArrowCircle,
  BiPauseCircle,
  BiPlayCircle,
  BiRightArrowCircle,
  BiStopCircle,
} from "react-icons/bi";
import { MEDIA_ENV_URL } from "../../api/config";

const EssayPlayer = ({ explodedText }) => {
  const [items, setItems] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [intervalId, setIntervalId] = useState(null);
  const [duration, setDuration] = useState(1000);

  async function playWordsAudio(item) {
    let audio = new Audio(
      `${MEDIA_ENV_URL}/phonetic/${item.slice(0, 1)}/${item}.mp3`
    );

    audio.onerror = (error) => {
      audio.src = `${MEDIA_ENV_URL}/phonetic/n/next.mp3`;
      console.log(audio);
      audio.play();
    };
    audio.play();
  }

  const play = () => {
    setIsPlaying(true);
    const id = setInterval(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }, duration);
    setIntervalId(id);
  };

  const pause = () => {
    setIsPlaying(false);
    clearInterval(intervalId);
  };

  const stop = () => {
    setIsPlaying(false);
    clearInterval(intervalId);
    setCurrentIndex(-1);
  };

  const handleDelay = () => {
    if (duration < 8000) {
      setDuration((p) => p + 1000);
    } else {
      setDuration(1000);
    }
  };

  useEffect(() => {
    return () => {
      clearInterval(intervalId);
    };
  }, [intervalId]);

  useEffect(() => {
    if (currentIndex > -1) {
      playWordsAudio(items[currentIndex].word);
    }
  }, [currentIndex]);

  useEffect(() => {
    stop();
    if (explodedText) {
      setItems(
        explodedText.filter(
          (item) => item.word.replace(/[^a-zA-Z]/g, "").length > 2
        )
      );
    }
  }, [explodedText]);

  useEffect(() => {
    console.log(items.map((i) => i.word));
  }, [items]);

  return (
    <div className="flex gap-2 text-2xl px-3 ms-2 border-x-2">
      {!isPlaying ? (
        <button className="hover:text-sky-700" onClick={play}>
          <BiPlayCircle />
        </button>
      ) : (
        <button className="hover:text-sky-700 text-lime-700" onClick={pause}>
          <BiPauseCircle />
        </button>
      )}

      <button
        disabled={currentIndex === -1}
        className={`${
          currentIndex > -1 ? "hover:text-sky-700" : "text-stone-300"
        }`}
        onClick={stop}
      >
        <BiStopCircle />
      </button>
      <abbr
        className="no-underline text-base font-bold text-stone-700 hover:text-sky-700 select-none cursor-pointer"
        title="Delay between each word"
      >
        <button disabled={isPlaying} onClick={handleDelay}>
          {duration / 1000} s
        </button>
      </abbr>
      <button
        className="hover:text-sky-700"
        onClick={() => {
          pause();
          setCurrentIndex((p) => (p > -1 ? p - 1 : p));
        }}
      >
        <BiLeftArrowCircle />
      </button>
      <input
        type="number"
        value={currentIndex}
        className="text-base p-0 w-8 text-center"
        onChange={(e) => {
          setCurrentIndex(Number(e.target.value));
        }}
      />

      <button
        className="hover:text-sky-700"
        onClick={() => {
          pause();
          setCurrentIndex((p) => (p < items.length ? p + 1 : p));
        }}
      >
        <BiRightArrowCircle />
      </button>
    </div>
  );
};

export default EssayPlayer;
