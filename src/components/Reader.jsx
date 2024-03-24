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
    setIsLoading(true);

    axiosApi
      .get(`${BASE_URL}/words`, {
        params: {
          _page: 1,
          _limit: 5,
          exact: explodedText[searchIndex],
        },
      })
      .then((res) => {
        if (res.data.pagination.totalCount > 0) {
          console.log();
          setFoundItem(res.data.data[0]);
        } else {
          axiosApi
            .get(`${BASE_URL}/words`, {
              params: {
                _page: 1,
                _limit: 5,
                search: explodedText[searchIndex],
              },
            })
            .then((res) => {
              if (res.data.pagination.totalCount > 0) {
                setFoundItem(res.data.data[0]);
              } else {
                console.log("not found");
              }
            });
        }
      })
      .catch((err) => {
        console.log(err.response?.data?.message, err?.response);
        // if (err.response.status === 401) {
        //   dispatch(logout());
        // }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleAddAll = async () => {
    setIsLoading(true);

    const wordsArr = newWords
      .replace(/[^\w\s]|_|\d+/g, "")
      .replace(/\s+/g, " ")
      .trim()
      .split(" ");

    let skippedWords = "";
    let reapeated = "";
    let wordCount = 0;
    try {
      // Iterate over each item and send individual POST requests
      for (let i = 0; i < wordsArr.length; i++) {
        const item = wordsArr[i].toLowerCase();
        if (item.length > 3) {
          const itemExist = await axiosApi
            .get(`${BASE_URL}/words?exact=${item}`)
            .then((res) => res?.data?.data?.length);
          if (itemExist === 0) {
            let openAiResponse = {};
            let tmpNewWord = {
              name: item,
              meaning: "",
              audio_us: "",
              level: 0,
              length: item.length,
            };

            try {
              axios
                .post(`${BASE_URL}/words`, tmpNewWord)
                .then((res) =>
                  res.statusText === "Created" ? console.log("Added") : ""
                );
              //   });
            } catch (error) {
              console.error("Error fetching data:", error);
            }

            // Log the response message after each item is successfully added
            setCounter((p) => p + 1);
            wordCount = wordCount + 1;
            // Add a 0.5 second delay between requests
            // await new Promise((resolve) => setTimeout(resolve, 100));
          } else {
            reapeated = `"${item}", ${reapeated}`;
          }
        } else if (item.length > 0) {
          skippedWords = `"${item}", ${skippedWords}`;
        }

        // Log the final response message after all items have been successfully added
      }
      if (wordCount > 0) {
        toast.success(`I ate ${wordCount} Words.`);
      }
      if (skippedWords) {
        toast.error(
          `Too short to feed me with: 
          ${skippedWords}`
        );
      }
      if (reapeated) {
        toast.error(
          `Already ate : 
          ${reapeated}`
        );
      }
      setNewWords("");
      setCounter(0);
      FetchWords();
      setIsLoading(false);
    } catch (error) {
      console.error("Error:", error);
    }
  };

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
      <div className="flex flex-col">
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
        <div>
          {foundItem && (
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
