import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import { BiCheck, BiSolidEdit, BiSolidSave, BiXCircle } from "react-icons/bi";
import { MdGTranslate } from "react-icons/md";
import { BsSave } from "react-icons/bs";
import axiosApi from "../../api/axiosApi";
import { BASE_URL } from "../../api/config";
import ActiveParaghraph from "./ActiveParaghraph";
import { FaBook } from "react-icons/fa";
import Modal from "../Modal/Modal";
import EditEssay from "./EditEssay";

function EssayList() {
  const [essays, setEssays] = useState([]);
  const [explodedText, setExplodedText] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedEssay, setSelectedEssay] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const loadEssays = () => {
    axiosApi
      .get(`${BASE_URL}/essay`)
      .then((res) => {
        if (res.status === 200) {
          setEssays(res.data.data);
        }
      })
      .catch((err) => console.log(err));
  };

  useEffect(() => {
    loadEssays();
  }, []);

  function strToArr(txt) {
    return txt
      .replace(/\n/g, " ")
      .replace(/([.,?!'"'-])/g, " $1 ")
      .split(" ")
      .map((item) => ({
        word: item.slice(0, 3) === "@**" ? item.substring(3) : item,
        highlight: item.slice(0, 3) === "@**" ? true : false,
      }));
  }

  function arrToStr(expTextArr) {
    return expTextArr
      .filter((obj) => obj.word !== "")
      .map((wordObj) =>
        wordObj.highlight ? "@**" + wordObj.word : wordObj.word
      )
      .join(" ");
  }

  const handleSelectEssay = (essay) => {
    setTitle(essay.title);
    setExplodedText(strToArr(essay.content));
    setSelectedEssay(essay);
    setIsEditing(false);
  };

  const handleSaveEssay = (e) => {
    e.preventDefault();
    setSaveLoading(true);
    if (title && explodedText.length > 0) {
      const unifiedText = arrToStr(explodedText);

      // return;
      axiosApi
        .put(`${BASE_URL}/essay/${selectedEssay._id}`, {
          title: title,
          content: unifiedText,
          isRead: selectedEssay?.isRead,
        })
        .then((res) => {
          if (res.status === 200) {
            setIsEditing(false);
            loadEssays();
          }
        })
        .catch((err) => console.log(err))
        .finally(() => {
          setSaveLoading(false);
        });
    } else {
      toast.error("Fill Title and Essay");
      setSaveLoading(false);
    }
  };

  const handleIsRead = (e, essay) => {
    e.stopPropagation();

    // return;
    axiosApi
      .put(`${BASE_URL}/essay/${essay._id}`, {
        ...essay,
        isRead: !essay.isRead,
      })
      .then((res) => {
        if (res.status === 200) {
          setIsEditing(false);
          loadEssays();
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setSaveLoading(false);
      });
  };

  function googleTranslate() {
    navigator.clipboard.readText().then((text) => {
      if (text) {
        window.open(
          `https://translate.google.com/?sl=en&tl=fa&text=${text}%20&op=translate`,
          "_blank"
        );
      }
    });
  }
  function longmanTranslate() {
    navigator.clipboard.readText().then((text) => {
      if (text) {
        window.open(`https://www.ldoceonline.com/dictionary/${text}`, "_blank");
      }
    });
  }

  if (essays.length === 0) {
    return <p className="p-3">List is Empty...</p>;
  }

  return (
    <div className="mt-2">
      <div className="h-50 overflow-y-scroll  border shadow-inner  ">
        {essays.map((essay, index) => {
          return (
            <div
              key={essay._id}
              id={"essay_" + index + 1}
              onClick={() => handleSelectEssay(essay)}
              className={`cursor-pointer flex gap-2 font-semibold hover:text-lime-700 hover:bg-lime-50 w-full border-b p-1 ps-2 ${
                selectedEssay._id === essay._id ? "bg-amber-100" : ""
              }`}
            >
              <p>{index + 1}-</p>
              <p
                className={
                  selectedEssay._id === essay._id
                    ? "font-bold text-purple-700"
                    : ""
                }
              >
                {essay.title}
              </p>
              <button
                onClick={(e) => handleIsRead(e, essay)}
                className="text-2xl ms-auto pe-2"
              >
                <abbr title="Done Reading">
                  <BiCheck
                    className={
                      essay?.isRead ? "text-green-700" : "text-stone-200"
                    }
                  />
                </abbr>
              </button>
            </div>
          );
        })}
      </div>

      <div className="mt-3">
        {/* ------------------------ Buttons  */}
        {title && (
          <div className="w-full bg-slate-50 flex items-center py-1 px-2 gap-3 text-stone-900  border ">
            <button
              disabled={saveLoading || !isEditing}
              onClick={handleSaveEssay}
              className="hover:text-sky-800 text-2xl"
            >
              <abbr title="Save Highlights">
                {saveLoading ? (
                  <LoaderIcon className="w-5 h-5 me-1" />
                ) : (
                  <BiSolidSave className={!isEditing ? "text-stone-400" : ""} />
                )}
              </abbr>
            </button>
            <button
              onClick={() => setShowModal(true)}
              className="hover:text-sky-800 text-2xl"
            >
              <abbr title="Edit Essay">
                <BiSolidEdit />
              </abbr>
            </button>
            <button
              onClick={() => googleTranslate()}
              className="hover:text-sky-800 text-lg"
            >
              <abbr title="Google Translate the clipboard">
                <MdGTranslate />
              </abbr>
            </button>
            <button
              onClick={() => longmanTranslate()}
              className="hover:text-sky-800 text-lg"
            >
              <abbr title="Longman Translate the clipboard">
                <FaBook />
              </abbr>
            </button>
            <button
              onClick={() => {
                setExplodedText([]);
                setTitle("");
              }}
              className="text-2xl ms-auto"
            >
              <abbr title="Close Essay">
                <BiXCircle />
              </abbr>
            </button>
          </div>
        )}
        <ActiveParaghraph
          explodedText={explodedText}
          setExplodedText={setExplodedText}
          title={title}
          setIsEditing={setIsEditing}
        />
      </div>
      {showModal && (
        <Modal setShowModal={setShowModal}>
          <EditEssay
            setShowModal={setShowModal}
            essay={selectedEssay}
            loadEssays={loadEssays}
            handleSelectEssay={handleSelectEssay}
          />
        </Modal>
      )}
    </div>
  );
}

export default EssayList;
