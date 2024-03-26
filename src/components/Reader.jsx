import React, { useState } from "react";
import { useEffect } from "react";
import { useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import axiosApi from "../api/axiosApi";
import { BASE_URL } from "../api/config";
import ReaderWord from "./ReaderWord";
import SubText from "./SubText";

function Reader() {
  const [text, setText] =
    useState(`With its capacity for bringing down governments and scarring political careers, 
  the onion plays an explosive role in Indian politics. This week, reports of rising 
  onion prices have made front-page news and absorbed the attention of the 
  governing elite. 
  The most vital / staple ingredient in Indian cooking, the basic element with 
  which all dishes begin and, normally, the cheapest vegetable available, the 
  pink onion is an essential item in the shopping basket of families of all classes.
  But in recent weeks, the onion has started to seem an unaffordable luxury for 
  India’s poor. Over the past few days, another sharp surge / increase in prices 
  has begun to unsettle the influential urban middle classes.
  The sudden spike in prices has been caused by large exports to neighboring
  countries and a shortage of supply. But the increase follows a trend of rising 
  consumer prices across the board — from diesel fuel to cement, from milk to 
  lentils.`);
  const [explodedText, setExplodedText] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchIndex, setSearchIndex] = useState(-1);
  const [foundItem, setFoundItem] = useState(null);

  const { loading, success, error, userToken, user } = useSelector(
    (state) => state.auth
  );

  const searchWord = async () => {
    // setIsLoading(true);

    let singularWord = singularize(
      explodedText[searchIndex]
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

  const addWord = async (word) => {
    setIsLoading(true);
    console.log(isLoading);
    const newWord = word
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
      .split(" ");
    setExplodedText(splitText);
  };

  return (
    <div className="p-2">
      <div className="flex flex-col ">
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
        <div className="mt-5 p-3 bg-gray-50">
          <p className="text-lg font-bold text-lime-800">Active Text :</p>
          <p className="w-full  font-semibold text-stone-700">
            {explodedText.map((sub, index) => (
              <span key={index}>
                <SubText
                  subText={sub}
                  index={index}
                  setSearchIndex={setSearchIndex}
                />{" "}
              </span>
            ))}
          </p>
        </div>
      </div>
    </div>
  );
}

export default Reader;
