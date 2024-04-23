import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { LoaderIcon } from "react-hot-toast";
import {
  BiCheck,
  BiSolidEdit,
  BiSolidSave,
  BiToggleLeft,
  BiToggleRight,
  BiXCircle,
} from "react-icons/bi";
import { dotPulse } from "ldrs";
import { MdGTranslate } from "react-icons/md";
import axiosApi from "../../api/axiosApi";
import { BASE_URL } from "../../api/config";
import ActiveParaghraph from "./ActiveParaghraph";
import { FaBook } from "react-icons/fa";
import Modal from "../Modal/Modal";
import EditEssay from "./EditEssay";

dotPulse.register();

function EssayList() {
  const [essays, setEssays] = useState([]);
  const [explodedText, setExplodedText] = useState([]);
  const [title, setTitle] = useState("");
  const [selectedEssay, setSelectedEssay] = useState({});
  const [saveLoading, setSaveLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [filterRead, setFilterRead] = useState(false);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchContent, setSearchContent] = useState("");
  const [filteredEssays, setFilteredEssays] = useState([]);

  const loadEssays = () => {
    setLoading(true);
    axiosApi
      .get(`${BASE_URL}/essay`)
      .then((res) => {
        if (res.status === 200) {
          setEssays(res.data.data);
        }
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setLoading(false);
      });
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
        searchContent:
          searchContent &&
          item.toLowerCase().includes(searchContent.toLowerCase()),
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
        // window.open(
        //   `https://translate.google.com/?sl=en&tl=fa&text=${text}%20&op=translate`,
        //   "_blank"
        // );
        window.open(`https://abadis.ir/entofa/${text}/`, "_blank");
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

  function filterEssays() {
    const filtered = essays
      .filter((item) => (filterRead ? item.isRead === false : item))
      .filter((item) =>
        searchTitle
          ? item.title.toLowerCase().includes(searchTitle.toLowerCase())
          : item
      )
      .filter((item) =>
        searchContent
          ? item.content.toLowerCase().includes(searchContent.toLowerCase())
          : item
      );
    console.log(filtered);

    setFilteredEssays(filtered);
  }

  useEffect(() => {
    filterEssays();
  }, [essays, filterRead, searchTitle, searchContent]);

  if (essays.length === 0) {
    if (loading) {
      return (
        <div className="flex items-baseline p-4 ">
          <p className="pe-1 text-lg font-semibold text-lime-700">Loading </p>
          <l-dot-pulse size="20" speed="1.3" color="#555"></l-dot-pulse>
        </div>
      );
    } else {
      return <p className="p-3">List is Empty...</p>;
    }
  }

  return (
    <div className="">
      <div className="flex items-start p-2 flex-col gap-1 sm:flex-row sm:justify-between">
        <div className="flex items-center">
          <button
            className="text-3xl text-lime-800 ms-1 transition-all pt-1"
            onClick={() => {
              setFilterRead(!filterRead);
            }}
          >
            {filterRead ? <BiToggleRight /> : <BiToggleLeft />}
          </button>
          <p className="ps-1">Show {!filterRead ? "All" : "Not Done"}</p>
        </div>
        <div className="flex gap-2 items-center">
          <input
            className="border p-1 rounded"
            type="text"
            onChange={(e) => setSearchTitle(e.target.value)}
            value={searchTitle}
            placeholder="Search Title"
          />
          <input
            className="border p-1 rounded"
            type="text"
            onChange={(e) => setSearchContent(e.target.value)}
            value={searchContent}
            placeholder="Search Content"
          />
        </div>
      </div>
      <div className="h-50 overflow-y-scroll  border shadow-inner  ">
        {filteredEssays.map((essay, index) => {
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
