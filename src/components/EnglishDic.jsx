import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { BASE_URL } from "../api/config";
import Word from "./Word";
import { IoArrowBackCircle, IoArrowForwardCircle } from "react-icons/io5";
import { LoaderIcon, toast } from "react-hot-toast";
import { BsBookmarkFill } from "react-icons/bs";
import {
  FaSearch,
  FaSortAlphaDown,
  FaSortAlphaDownAlt,
  FaSortAmountDown,
  FaSortAmountDownAlt,
} from "react-icons/fa";
import { useLocation, useSearchParams } from "react-router-dom";

function EnglishDic() {
  const [words, setWords] = useState([]);
  const [newWords, setNewWords] = useState("");
  const [idsToDelete, setIdsToDelete] = useState([138, 139, 140]);
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [urlParams, setUrlParams] = useState(
    Object.fromEntries(new URLSearchParams(location.search))
  );

  const FetchWords = async () => {
    setIsLoading(true);

    axios
      .get(`${BASE_URL}/words`, {
        params: {
          _page: page,
          _limit: itemsPerPage,
          _sort: "name",
          ...urlParams,
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
    if (go === 1 && page <= totalCount / itemsPerPage) {
      setPage((p) => p + go);
    }
    if (go === -1 && page > 1) {
      setPage((p) => p + go);
    }
  };

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
            level: 0,
            length: item.length,
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
      toast.success("All items added successfully");
      setNewWords("");
      setCounter(0);
      FetchWords();
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const deleteItem = async (id) => {
    axios
      .delete(`${BASE_URL}/words/${id}`)
      .then((res) => {
        if (res.status === 200) {
          FetchWords();
          toast.success("Item deleted successfully");
        }
      })
      .catch((err) => console.log(err.message));
  };

  const handlePageInput = async (e) => {
    setPageInput(e.target.value);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (e.target.value > Math.ceil(totalCount / itemsPerPage)) {
      setPage(Math.ceil(totalCount / itemsPerPage));
      toast.error("Out of range");
    } else if (e.target.value < 1) {
      setPage(1);
      toast.error("Out of range");
    } else {
      setPage(+e.target.value);
    }
  };

  useEffect(() => {
    setUrlParams(Object.fromEntries(new URLSearchParams(location.search)));
  }, [location]);

  useEffect(() => {
    FetchWords();
    setPageInput(page);
  }, [page, urlParams]);

  useEffect(() => {
    if (Math.ceil(totalCount / itemsPerPage) < page) {
      setPage(1);
    }
  }, [totalCount]);

  return (
    <div className="w-full  px-5 md:px-10">
      {/* ------------------------------------- Header  */}
      <div className="bg-lime-300 pb-3 pt-2 text-center rounded-b-2xl mb-3">
        <h1 className="text-3xl font-mono">Prona App</h1>
      </div>
      {/* ------------------------------------- Add new words  */}
      <div className="flex items-center my-1">
        <input
          value={newWords}
          onChange={(e) => setNewWords(e.target.value)}
          type="text"
          name="newWords"
          id="newWords"
          className="border p-2 w-full  "
          placeholder="Enter new words split by space"
        />{" "}
        <button
          className="p-2 border w-32  bg-gray-800 text-gray-200 hover:bg-slate-950 hover:text-slate-300 font-semibold transition-all"
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

      {/* ------------------------------------- Filter & Sort  */}
      <div className="FilterBox flex p-2 border gap-4 ">
        <div className="flex gap-2">
          <p>Filter:</p>
          <div className="flex gap-2 text-lg ">
            <button onClick={() => setSearchParams({ ...urlParams, level: 0 })}>
              <BsBookmarkFill className="text-stone-300" />
            </button>
            <button onClick={() => setSearchParams({ ...urlParams, level: 1 })}>
              <BsBookmarkFill className="text-lime-600" />
            </button>
            <button onClick={() => setSearchParams({ ...urlParams, level: 2 })}>
              <BsBookmarkFill className="text-purple-600" />
            </button>
            <button onClick={() => setSearchParams({ ...urlParams, level: 3 })}>
              <BsBookmarkFill className="text-yellow-500" />
            </button>
            <button onClick={() => setSearchParams({ ...urlParams, level: 4 })}>
              <BsBookmarkFill className="text-red-600" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <p>Sort:</p>
          <button
            onClick={() =>
              setSearchParams({ ...urlParams, _sort: "name", _order: "asce" })
            }
          >
            <FaSortAlphaDown />
          </button>
          <button
            onClick={() =>
              setSearchParams({ ...urlParams, _sort: "name", _order: "desc" })
            }
          >
            <FaSortAlphaDownAlt />
          </button>

          <button
            onClick={() =>
              setSearchParams({ ...urlParams, _sort: "length", _order: "asce" })
            }
          >
            <FaSortAmountDownAlt />
          </button>
          <button
            onClick={() =>
              setSearchParams({ ...urlParams, _sort: "length", _order: "desc" })
            }
          >
            <FaSortAmountDown />
          </button>
        </div>
      </div>

      {/* ------------------------------------- Search  */}
      <div className="relative flex items-center w-1/2 mt-1">
        <input
          type="text"
          name="search"
          placeholder="Search"
          className="border p-2 w-full pe-10"
        />
        <button className="absolute right-3">
          <FaSearch />
        </button>
      </div>

      <hr className="m-4 " />
      {/* ------------------------------------- pagination  */}
      <div className="pagination flex justify-center items-center">
        <button
          disabled={page === 1}
          className="text-2xl mx-3"
          style={{ color: page === 1 ? "gray" : "" }}
          onClick={() => handlePage(-1)}
        >
          <IoArrowBackCircle />
        </button>

        <input
          name="page"
          type="number"
          value={pageInput}
          className={`px-1 text-lg border-b py-0 border-stone-400
           font-mono text-sky-700 ${
             pageInput < 9 ? "w-5" : pageInput < 100 ? "w-8" : "w-10"
           }`}
          onChange={(e) => handlePageInput(e)}
          maxLength={3}
          min={1}
          max={Math.ceil(totalCount / itemsPerPage)}
        />
        <p className="cursor-default">
          of {Math.ceil(totalCount / itemsPerPage)}
        </p>
        <button className="text-2xl mx-3" onClick={() => handlePage(1)}>
          <IoArrowForwardCircle />
        </button>
      </div>

      <p>Total Count : {totalCount}</p>

      {/* ------------------------------------- Map Words  */}
      <div className="w-full mx-auto">
        <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-1">
          {isLoading && <p>loading</p>}
          {!isLoading && words.length === 0 ? (
            <p>list empty</p>
          ) : (
            words.map((item, index) => {
              return (
                <div key={item.id}>
                  <Word
                    item={item}
                    deleteItem={deleteItem}
                    FetchWords={FetchWords}
                  />
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
