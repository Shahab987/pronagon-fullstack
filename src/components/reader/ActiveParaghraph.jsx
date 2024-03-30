import React, { useEffect, useState } from "react";
import axiosApi from "../../api/axiosApi";
import SubText from "../SubText";
import { toast } from "react-hot-toast";
import { BASE_URL } from "../../api/config";
import ReaderWord from "../ReaderWord";
import { useSelector } from "react-redux";
import { BiX, BiXCircle } from "react-icons/bi";

function ActiveParaghraph({
  explodedText,
  setExplodedText,
  title,
  setIsEditing,
}) {
  const [searchIndex, setSearchIndex] = useState(-1);
  const [isLoading, setIsLoading] = useState(false);
  const [foundItem, setFoundItem] = useState(null);

  const { loading, success, error, userToken, user } = useSelector(
    (state) => state.auth
  );

  const addWord = async (wordObj) => {
    setIsLoading(true);
    console.log(isLoading);
    const newWord = wordObj.word
      .toLowerCase()
      .replace(/[^\w\s\-]|_|\d+/g, "")
      .replace(/\s+/g, " ")
      .replace(/[’']s$/, "");

    if (newWord.length > 2) {
      let tmpNewWord = {
        name: newWord,
        meaning: "",
        audio_us: "",
        level: 0,
        length: newWord.length,
      };

      // OPEN AI REQ
      try {
        axiosApi
          .get(`${BASE_URL}/openai`, {
            params: {
              word: newWord,
            },
          })
          .then((res) => {
            setFoundItem(res.data);
            setIsLoading(false);
          })
          .catch((err) => {
            console.log(err);
            toast.error("not found : 500");
            setIsLoading(false);
          });
      } catch (error) {
        console.error("Error adding data status:", error.message);
        setIsLoading(false);
      }
    }
  };

  const searchWord = async () => {
    const wordToSearch = explodedText[searchIndex];
    // setIsLoading(true);
    if (wordToSearch.word.length < 3) {
      return;
    }
    let singularWord = singularize(
      wordToSearch.word
        .toLowerCase()
        .replace(/[^\w\s\-]|_|\d+/g, "")
        .replace(/\s+/g, " ")
        .replace(/[’']s$/, "")
    );
    console.log(singularWord);
    axiosApi
      .get(`${BASE_URL}/words`, {
        params: {
          _page: 1,
          _limit: 5,
          search: singularWord,
          sortBy: "length",
          sortOrder: "asce",
        },
      })
      .then((res) => {
        if (res.data.pagination.totalCount > 0) {
          const firstSimilar = res.data.data[0];
          if (firstSimilar.name.length <= singularWord.length + 1) {
            setFoundItem(res.data.data[0]);
            setIsLoading(false);
          } else {
            addWord(wordToSearch);
          }
        } else {
          addWord(wordToSearch);
        }
      })
      .catch((err) => {
        console.log(err.response?.data?.message, err?.response);
        setIsLoading(false);
      })
      .finally(() => {});
  };

  function singularize(word) {
    const rulesAndExceptions = [
      [/([^aeiou])ies$/, "$1y"], // Change 'ies' to 'y'
      [/([^aeiou])xes$/, "$1x"], // Change 'xes' to 'x'
      [/([^aeiou])es$/, "$1"], // Remove 'es' except for specific cases
      [/([^aeiou])s$/, "$1"], // Remove 's'
      [/^(bus)(es)$/, "$1"], // Exception for buses
    ];

    // Apply rules and exceptions
    for (let [pattern, replacement] of rulesAndExceptions) {
      if (pattern.test(word)) {
        return word.replace(pattern, replacement);
      }
    }

    // Return unchanged if no match found
    return word.replace(/(es|s|d)$/, "");
  }

  useEffect(() => {
    if (searchIndex !== -1) {
      searchWord();
    }
  }, [searchIndex]);

  const setHighlight = (index) => {
    if (explodedText[index].word.length < 2) {
      return;
    }
    const tempArr = explodedText.map((wordObj, i) =>
      i === index ? { ...wordObj, highlight: !wordObj.highlight } : wordObj
    );
    setIsEditing(true);
    setExplodedText(tempArr);
  };

  return (
    <div>
      {/* --------------------- word box  */}
      <div className="mt-1 relative">
        {isLoading && (
          <div className="flex p-5 justify-center bg-slate-100 rounded-md h-15 items-center">
            <l-zoomies
              size="300"
              stroke="10"
              bg-opacity="0.1"
              speed="4"
              color="#aaa"
            ></l-zoomies>
          </div>
        )}
        {foundItem && !isLoading && (
          <div>
            <button
              onDoubleClick={() => {
                setFoundItem(null);
              }}
              className="text-2xl ms-auto absolute right-0 z-20 text-stone-500"
            >
              <abbr title="Close Word">
                <BiX />
              </abbr>
            </button>
            <ReaderWord
              isLoading={isLoading}
              item={foundItem}
              deleteItem={() => {}}
              user={user}
            />
          </div>
        )}
      </div>
      <div className=" px-3 bg-gray-50 pb-10">
        <p className="text-lg font-bold text-lime-800">{title}</p>
        <p className="w-full  font-semibold text-stone-700">
          {explodedText.map((wordObj, index) => (
            <span key={index}>
              <SubText
                wordObj={wordObj}
                index={index}
                setSearchIndex={setSearchIndex}
                setHighlight={setHighlight}
              />{" "}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

export default ActiveParaghraph;
