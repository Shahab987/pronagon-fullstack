import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import axiosApi from "../../api/axiosApi";
import { BASE_URL } from "../../api/config";

import ReaderWord from "../ReaderWord";
import SubText from "../SubText";
import LoaderButton from "../ui/LoaderButton";
import ActiveParaghraph from "./ActiveParaghraph";

function AddEssay() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [explodedText, setExplodedText] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchIndex, setSearchIndex] = useState(-1);
  const [foundItem, setFoundItem] = useState(null);
  const [saveLoading, setSaveLoading] = useState(false);

  const { loading, success, error, userToken, user } = useSelector(
    (state) => state.auth
  );

  const searchWord = async () => {
    // setIsLoading(true);
    if (explodedText[searchIndex].word.length < 3) {
      return;
    }
    let singularWord = singularize(
      explodedText[searchIndex].word
        .toLowerCase()
        .replace(/[^\w\s\-]|_|\d+/g, "")
        .replace(/\s+/g, " ")
        .replace(/[’']s$/, "")
    );

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
          console.log();
          setFoundItem(res.data.data[0]);
          setIsLoading(false);
        } else {
          addWord(explodedText[searchIndex]);
        }
      })
      .catch((err) => {
        console.log(err.response?.data?.message, err?.response);
        setIsLoading(false);
      })
      .finally(() => {});
  };

  const addWord = async (wordObj) => {
    setIsLoading(true);
    console.log(isLoading);
    const newWord = wordObj.word
      .toLowerCase()
      .replace(/[^\w\s\-]|_|\d+/g, "")
      .replace(/\s+/g, " ")
      .replace(/[’']s$/, "");

    if (newWord.length > 3) {
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

  const handleChange = (event) => {
    setText(event.target.value);
    let tempText = event.target.value;
    let splitText = tempText
      .replace(/\n/g, " ")
      .replace(/([.,?!'"'])/g, " $1 ")
      .split(" ")
      .map((item) => ({ word: item, highlight: false }));
    setExplodedText(splitText);
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  function unifyText(expTextArr) {
    const tempArr = expTextArr
      .filter((obj) => obj.word !== "")
      .map((wordObj) =>
        wordObj.highlight ? "@**" + wordObj.word : wordObj.word
      )
      .join(" ");
    return tempArr;
  }

  const handleSaveEssay = (e) => {
    e.preventDefault();
    setSaveLoading(true);
    if (title && text && explodedText.length > 0) {
      console.log(text, explodedText, title);
      const unifiedText = unifyText(explodedText);

      // return;
      axiosApi
        .post(`${BASE_URL}/essay/add`, {
          title: title,
          content: unifiedText,
        })
        .then((res) => console.log(res))
        .catch((err) => console.log(err))
        .finally(() => {
          setSaveLoading(false);
        });
    } else {
      toast.error("Fill Title and Essay");
      setSaveLoading(false);
    }
  };

  const setHighlight = (index) => {
    if (explodedText[index].word.length < 3) {
      return;
    }
    const tempArr = explodedText.map((wordObj, i) =>
      i === index ? { ...wordObj, highlight: !wordObj.highlight } : wordObj
    );

    setExplodedText(tempArr);
  };

  return (
    <div className="pt-3">
      <div className="flex flex-col ">
        {/* ------------------------ texarea input  */}
        <form onSubmit={(e) => handleSaveEssay(e)}>
          <input
            type="text"
            name="title"
            value={title}
            onChange={(e) => handleChangeTitle(e)}
            className="p-2 border mb-2 w-full sm:w-150"
            placeholder="Title"
          />
          <textarea
            className="w-full p-2 border text-sm"
            name="textarea"
            id="textarea"
            cols="50"
            rows="8"
            value={text}
            onChange={(e) => handleChange(e)}
            placeholder="Paste your text here"
          />
          <div className="text-center mt-2">
            <LoaderButton
              loading={saveLoading}
              style="border w-50 p-2 bg-lime-600 text-lime-50"
              type="submit"
              text="Save"
            />
          </div>
        </form>

        {/* --------------------- word box  */}
        <div className="mt-2">
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
            <ReaderWord
              isLoading={isLoading}
              item={foundItem}
              deleteItem={() => {}}
              user={user}
            />
          )}
        </div>
        {/* ---------------------- paragraph box  */}
        <ActiveParaghraph
          explodedText={explodedText}
          setSearchIndex={setSearchIndex}
          setHighlight={setHighlight}
        />
      </div>
    </div>
  );
}

export default AddEssay;
