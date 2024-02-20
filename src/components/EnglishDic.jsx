import axios from "axios";
import React, { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";
import { BASE_URL } from "../api/config";
import Word from "./Word";
import { IoArrowBackCircle, IoArrowForwardCircle } from "react-icons/io5";
import { LoaderIcon } from "react-hot-toast";

function EnglishDic() {
  const [words, setWords] = useState([]);
  const [newWords, setNewWords] = useState("");
  const [idsToDelete, setIdsToDelete] = useState([138, 139, 140]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [counter, setCounter] = useState(0);

  const FetchWords = async () => {
    setIsLoading(true);
    console.log("page: ", page);
    axios
      .get(`${BASE_URL}/words`, {
        params: {
          _page: page,
          _limit: 10,
          _sort: "name",
        },
      })
      .then((res) => {
        setTotalCount(res.headers["x-total-count"]);
        setWords(res.data);
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlePage = (go) => {
    console.log("inhandle:", page, "go:", go);
    console.log(totalCount / 10);
    if (go === 1 && page <= totalCount / 10) {
      setPage((p) => p + go);
    }
    if (go === -1 && page > 1) {
      setPage((p) => p + go);
    }
  };

  useEffect(() => {
    FetchWords();
  }, [page]);

  const addNewWords = async () => {
    const wordsArr = newWords.split(" ");
    await Promise.all(
      wordsArr.map(async (w) => {
        const tmpNewWord = {
          name: w.toLowerCase(),
          meaning: "",
          audio_us: "",
        };
        await fetch("http://127.0.0.1:5000/words", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tmpNewWord),
        }).then((res) => console.log(res));
      })
    );
  };

  // const cleanDatabaseDoubl = async () => {
  //   //finds unique items
  //   var array1 = words.filter(
  //     (arr, index, self) => index === self.findIndex((t) => t.name === arr.name)
  //   );
  //   // unique ids
  //   const idsInArray1 = array1.map((item) => item.id);

  //   // Finds doublicates ids
  //   const doplicatedIds = words
  //     .filter((item) => !idsInArray1.includes(item.id))
  //     .map((item) => item.id);

  //   try {
  //     // Iterate over each ID and send individual DELETE requests
  //     for (let i = 0; i < doplicatedIds.length; i++) {
  //       const id = doplicatedIds[i];
  //       await fetch(`http://127.0.0.1:5000/words/${id}`, {
  //         method: "DELETE",
  //       });
  //       // Set the response after each item is successfully deleted
  //       console.log({ message: `Item with ID ${id} deleted successfully` });
  //       // Add a 0.5 second delay between requests
  //       await new Promise((resolve) => setTimeout(resolve, 300));
  //     }
  //     // Set the final response after all items have been successfully deleted
  //     console.log({ message: "All items deleted successfully" });
  //   } catch (error) {
  //     console.error("Error:", error);
  //     console.log({ error: error.message });
  //   }
  // };

  const handleAddAll = async () => {
    if (!newWords) {
      console.log("empty");
      return;
    }
    const wordsArr = newWords.replace(/\s+/g, " ").trim().split(" ");

    try {
      // Iterate over each item and send individual POST requests
      for (let i = 0; i < wordsArr.length; i++) {
        const item = wordsArr[i].toLowerCase();
        const response = await fetch(`${BASE_URL}/words?name=${item}`).then(
          (res) => res.json()
        );
        if (response.length == 0) {
          const tmpNewWord = {
            name: item,
            meaning: "",
            audio_us: "",
          };
          await fetch(`${BASE_URL}/words`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(tmpNewWord),
          });
          // Log the response message after each item is successfully added
          console.log(`Item ${JSON.stringify(item)} added successfully`);
          setCounter((p) => p + 1);
          // Add a 0.5 second delay between requests
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
        // Log the final response message after all items have been successfully added
      }
      console.log("All items added successfully");
      setCounter(0);
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteItem = async (id) => {
    axios.delete(`${BASE_URL}/words/${id}`).then((res) => {
      console.log(res);
    });
  };

  return (
    <div className="w-full  p-5 md:p-10 text-center">
      <div className="flex">
        <button
          className="p-3 border w-52 hover:bg-slate-950 hover:text-slate-300 font-semibold transition-all"
          onClick={FetchWords}
        >
          Load words
        </button>
      </div>
      <div className="flex items-center mt-3">
        <input
          value={newWords}
          onChange={(e) => setNewWords(e.target.value)}
          type="text"
          name="newWords"
          id="newWords"
          className="border p-3 w-full  "
          placeholder="Paste new words split by space"
        />{" "}
        <button
          className="p-3 border w-32 m-1 bg-gray-800 text-gray-200 hover:bg-slate-950 hover:text-slate-300 font-semibold transition-all"
          onClick={handleAddAll}
          disabled={counter > 0}
        >
          {counter > 0 ? (
            <div className="flex items-center justify-evenly">
              <LoaderIcon />
              <p>
                {counter} item{counter > 1 && "s"}
              </p>
            </div>
          ) : (
            "Add"
          )}
        </button>
      </div>
      <hr className="m-4 " />
      {/* pagination  */}
      <div className="pagination flex justify-center items-center">
        <button
          disabled={page === 1}
          className="text-2xl mx-3"
          style={{ color: page === 1 ? "gray" : "" }}
          onClick={() => handlePage(-1)}
        >
          <IoArrowBackCircle />
        </button>
        {page - 10 > 0 && (
          <p
            onClick={() => {
              setPage((p) => p - 10);
            }}
            className="p-1 text-sky-950 text-sm font-bold"
          >
            {page - 10}
          </p>
        )}
        {page - 5 > 0 && (
          <p
            onClick={() => {
              setPage((p) => p - 5);
            }}
            className="p-1 text-sky-950 text-sm font-bold"
          >
            {page - 5}
          </p>
        )}
        <p className="p-1 text-sky-800 text-lg font-bold">{page}</p>
        {page + 5 <= totalCount / 10 && (
          <p
            onClick={() => {
              setPage((p) => p + 5);
            }}
            className="p-1 text-sky-950 text-sm font-bold"
          >
            {page + 5}
          </p>
        )}
        {page + 10 <= totalCount / 10 && (
          <p
            onClick={() => {
              setPage((p) => p + 10);
            }}
            className="p-1 text-sky-950 text-sm font-bold"
          >
            {page + 10}
          </p>
        )}
        <button className="text-2xl mx-3" onClick={() => handlePage(1)}>
          <IoArrowForwardCircle />
        </button>
      </div>

      <p>Words : {totalCount}</p>
      <div className="w-full mx-auto">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-2">
          {isLoading && <p>loading</p>}
          {!isLoading && words.length === 0 ? (
            <p>list empty</p>
          ) : (
            words.map((item, index) => {
              return (
                <div key={item.id}>
                  <Word item={item} deleteItem={deleteItem} />
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

export default EnglishDic;
