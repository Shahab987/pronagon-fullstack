import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { FaPlay, FaStop, FaTrashAlt } from "react-icons/fa";
import { BsBookmarkFill, BsPencil } from "react-icons/bs";
import { BiSolidEdit } from "react-icons/bi";

import { BASE_URL, MEDIA_ENV_URL, MEDIA_LOCAL_URL } from "../api/config";
import { toast } from "react-hot-toast";
import Modal from "./Modal/Modal";
import EditWord from "./EditWord";
import axiosApi from "../api/axiosApi";

const Button = ({ onClick, icon, iconClass, btnClass }) => (
  <button onClick={onClick} className={btnClass}>
    {icon && <icon.type className={`${iconClass}`} />}
  </button>
);

function ReaderWord({ item, deleteItem, user }) {
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [isSure, setIsSure] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [expand, setExpand] = useState(false);
  const [level, setLevel] = useState(item?.level || 0);
  const [didMount, setDidMount] = useState(false);
  const [isSettingLevel, setIsSettingLevel] = useState(false);
  const [url, setUrl] = useState({
    l1: "",
    l3: "",
    l5: "",
    word: "",
    word2: "",
  });

  const levelColors = [
    "bg-stone-300",
    "bg-lime-600",
    "bg-purple-600",
    "bg-yellow-500",
    "bg-red-600",
  ];

  const audioRef = useRef();

  const stop = () => {
    audioRef.current.pause();
    audioRef.current.currentTime = 0;
  };

  const setAudioUrl = () => {
    if (audioRef.current?.currentSrc) {
      axios
        .put(`${BASE_URL}/words/${item._id}`, {
          ...item,
          audio_us: audioRef.current.currentSrc,
        })
        .then((res) => {
          if (res.status === 200) {
            handleDownload(res.data);
          }
        })
        .catch((err) => console.error(err));
    }
  };

  const handleDownload = (item) => {
    const url = item.audio_us;
    const path = `${MEDIA_LOCAL_URL}/media/phonetic/${item.name.slice(0, 1)}/${
      item.name
    }.mp3`;

    axiosApi
      .post(`${BASE_URL}/saveaudio`, { url, path })
      .then((response) => {
        if (response.status === 200) {
          console.log("File downloaded successfully");
          axiosApi
            .put(`${BASE_URL}/words/${item._id}`, {
              ...item,
              audio_src: `/phonetic/${item.name.slice(0, 1)}/${item.name}.mp3`,
            })
            .then((res) => {
              console.log(`Item updated successfully`);
            });
        } else {
          console.error("Error downloading file:");
          console.log("Error downloading file");
        }
      })
      .catch((error) => {
        console.error("Error downloading file:", error);
        console.log("Error downloading file");
      });
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

  useEffect(() => {
    genAudioUrl();
    if ((ready && !item.audio_us) || !item.audio_src) {
      setAudioUrl();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready]);

  useEffect(() => {
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [level]);

  const reset = () => {
    if (isSettingLevel) setIsSettingLevel(false);
    if (isSure) setIsSure(false);
  };

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.load(); // Load the new audio source
    }
  }, [item.name]);

  return (
    <div
      onClick={(e) => {
        reset();
      }}
      className={`relative flex flex-col items-center w-full p-3 border rounded-lg gap-1 hover:shadow-md hover:bg-gray-50 max-w-3xl mx-auto ${
        ready && ""
      }`}
    >
      <div
        className={`h-full w-[6px] md:w-2 absolute rounded-s-lg left-0 top-0  ${levelColors[level]}`}
      ></div>
      <div className="flex items-center w-full py-0 ps-1">
        <p
          onClick={() => setExpand((p) => !p)}
          className="font-semibold  2xs:text-lg w-fit cursor-pointer me-3"
        >
          {item?.name}
        </p>
        <p className=" bg-slate-100 rounded-md px-2 text-lg text-zinc-500 ">
          ({item.pronunciation})
        </p>
        <p
          dir="rtl"
          className=" text-sm bg-slate-100 rounded-md px-2 py-1 me-auto ms-5  font-IranSans  font-bold text-cyan-950"
        >
          {item.meaning}
        </p>
      </div>
      {/* ---------------------- Details  */}

      {expand && (
        <div className="w-full text" onClick={(e) => e.stopPropagation()}>
          <div className="flex items-center w-full justify-between ps-2 mt-1 ">
            <p>Ex: {item.example}</p>
            {user.role === "ADMIN" && (
              <div className="flex items-center gap-3">
                <Button
                  onClick={() => setShowModal(true)}
                  icon={<BiSolidEdit />}
                  iconClass="text-sky-950 hover:text-sky-700 mt-[2px]"
                  btnClass="text-2xl"
                />

                <button className="text-xl" onClick={() => toggleSure(null)}>
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
            )}
          </div>
        </div>
      )}
      {/* ------------------------ Icons  */}
      <div className={`icons flex items-center gap-6 mt-2`}>
        <div className={`flex gap-1 2xs:gap-2 xs:gap-3 text-2xl `}>
          {[0, 1, 2, 3, 4].map((num) => (
            <Button
              key={num}
              onClick={() => setLevel(num)}
              icon={<BsBookmarkFill />}
              iconClass={
                [
                  "text-stone-300",
                  "text-lime-600",
                  "text-purple-600",
                  "text-yellow-500",
                  "text-red-600",
                ][num]
              }
            />
          ))}
        </div>
        {!playing ? (
          <Button
            onClick={() => audioRef.current.play()}
            icon={<FaPlay />}
            iconClass={ready ? "hover:text-blue-700" : "text-gray-400"}
            btnClass="text-2xl"
          />
        ) : (
          <Button onClick={stop} icon={<FaStop />} />
        )}
      </div>
      {/* ------------------------ Audio tag  */}
      <div id="audioTag" className="absolute">
        {item?.audio_src && (
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
            <source src={`${MEDIA_ENV_URL}${item.audio_src}`} />
            Your browser does not support the audio tag. src
          </audio>
        )}
        {!item.audio_src && item?.audio_us && (
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
      {showModal && (
        <Modal setShowModal={setShowModal}>
          <EditWord
            setShowModal={setShowModal}
            FetchWords={FetchWords}
            item={item}
          />
        </Modal>
      )}
    </div>
  );
}

export default ReaderWord;
