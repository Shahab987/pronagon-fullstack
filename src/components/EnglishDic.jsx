import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { BASE_URL } from "../api/config";
import Word from "./Word";
import { IoArrowBackCircle, IoArrowForwardCircle } from "react-icons/io5";
import { LoaderIcon, toast } from "react-hot-toast";
import { BsBookmarkFill, BsSlashLg } from "react-icons/bs";
import {
  FaSearch,
  FaSortAlphaDown,
  FaSortAlphaDownAlt,
  FaSortAmountDown,
  FaSortAmountDownAlt,
} from "react-icons/fa";
import { FcClearFilters } from "react-icons/fc";
import { VscWholeWord } from "react-icons/vsc";

import { useLocation, useSearchParams } from "react-router-dom";
import axiosApi from "../api/axiosApi";

function EnglishDic() {
  const [words, setWords] = useState([]);
  const [newWords, setNewWords] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(1);
  const [pageInput, setPageInput] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [isLoading, setIsLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [underlinePos, setUnderlinePos] = useState("opacity-0");
  const [sortlinePos, setSortlinePos] = useState("opacity-0");
  const [exactMatch, setExactMatch] = useState(false);
  const [letsAdd, setLetsAdd] = useState(false);
  const [urlParams, setUrlParams] = useState(
    Object.fromEntries(new URLSearchParams(location?.search)) || {}
  );

  const FetchWords = async () => {
    setIsLoading(true);

    axiosApi
      .get(`${BASE_URL}/words`, {
        params: {
          _page: page,
          _limit: itemsPerPage,
          ...urlParams,
        },
      })
      .then((res) => {
        if (res.data.pagination.totalCount > 0) {
          setTotalCount(res.data.pagination.totalCount);
          setWords(res.data.data);
        } else {
          setTotalCount(res.data.pagination.totalCount);
          setWords(res.data.data);
          setLetsAdd(true);
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
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
      toast.error("empty");
      return;
    }
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
        if (item.length > 4) {
          const itemExist = await axios
            .get(`${BASE_URL}/words?exact=${item}`)
            .then((res) => res?.data?.data?.length);
          if (itemExist === 0) {
            const tmpNewWord = {
              name: item,
              meaning: "",
              audio_us: "",
              level: 0,
              length: item.length,
            };
            axios
              .post(`${BASE_URL}/words`, tmpNewWord)
              .then((res) =>
                res.statusText === "Created" ? console.log("Added") : ""
              );
            // Log the response message after each item is successfully added
            setCounter((p) => p + 1);
            wordCount = wordCount + 1;
            // Add a 0.5 second delay between requests
            await new Promise((resolve) => setTimeout(resolve, 100));
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

  const handleSearch = () => {
    if (searchInput) {
      if (exactMatch) {
        searchParams.delete("search");
        delete urlParams.search;
        setSearchParams({ ...urlParams, exact: searchInput.trim() });
      } else {
        searchParams.delete("exact");
        delete urlParams.exact;
        setSearchParams({ ...urlParams, search: searchInput.trim() });
      }
    } else {
      if (searchParams.has("search")) {
        searchParams.delete("search");
        setSearchParams(searchParams);
      }
      if (searchParams.has("exact")) {
        searchParams.delete("exact");
        setSearchParams(searchParams);
      }
    }
  };

  const handleLevel = (val) => {
    if (urlParams.level !== val.toString()) {
      setSearchParams({ ...urlParams, level: val });
    } else {
      delete urlParams.level;
      setSearchParams({ ...urlParams });
    }
  };

  //locate the current filter and sort
  const handleUnderlinePos = () => {
    switch (urlParams?.level) {
      case "0":
        setUnderlinePos("translate-x-0");
        break;
      case "1":
        setUnderlinePos("translate-x-7");
        break;
      case "2":
        setUnderlinePos("translate-x-14");
        break;
      case "3":
        setUnderlinePos("translate-x-21");
        break;
      case "4":
        setUnderlinePos("translate-x-28");
        break;

      default:
        setUnderlinePos((p) => p + " opacity-0");
        break;
    }

    switch (urlParams.sortBy + " " + urlParams.sortOrder) {
      case "name asce":
        setSortlinePos("-translate-x-1");
        break;
      case "name desc":
        setSortlinePos("translate-x-6");
        break;
      case "length asce":
        setSortlinePos("translate-x-13");
        break;
      case "length desc":
        setSortlinePos("translate-x-20");
        break;

      default:
        setSortlinePos((p) => p + " opacity-0");
        break;
    }
  };

  useEffect(() => {
    setUrlParams(Object.fromEntries(new URLSearchParams(location?.search)));
  }, [location]);

  useEffect(() => {
    FetchWords();
    handleUnderlinePos();
    setPageInput(page);
  }, [page, urlParams, itemsPerPage]);

  useEffect(() => {
    if (Math.ceil(totalCount / itemsPerPage) < page) {
      setPage(1);
    }
  }, [totalCount]);

  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [exactMatch]);

  return (
    <div className="w-full  px-3 md:px-10">
      {/* ------------------------------------- Header  */}
      <div className="bg-lime-300 pb-3 pt-2 text-center rounded-b-2xl mb-3">
        <h1 className="text-3xl font-mono">Pronagon</h1>
      </div>
      {/* ------------------------------------- Add new words  */}
      <div className="flex items-center my-1">
        <input
          value={newWords}
          onChange={(e) => setNewWords(e.target.value)}
          onKeyUp={(e) => {
            if (e.key === "Enter") {
              handleAddAll();
            }
          }}
          type="text"
          name="newWords"
          id="newWords"
          className="border p-2 w-full  "
          placeholder="Feed me a Word or a Paragraph!"
        />{" "}
        <button
          className="p-2 border w-32  bg-stone-100 text-gray-900 hover:bg-slate-950 hover:text-slate-300 font-semibold transition-all"
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
            "Yum!"
          )}
        </button>
      </div>
      <div className="flex flex-col lg:flex-row">
        {/* ------------------------------------- Filter & Sort  */}
        <div className="lg:w-1/2 flex p-2 border gap-4 ">
          <div className="flex gap-2">
            <p className="hidden xs:block">Filter:</p>
            <div className="flex gap-2 text-xl relative">
              <div
                className={`absolute h-1 w-5 -top-2 left-0 rounded-b-full  
                transition-all transform-gpu duration-500  bg-zinc-400  ${underlinePos}`}
              />
              <button onClick={() => handleLevel(0)}>
                <BsBookmarkFill className="text-stone-300" />
              </button>
              <button onClick={() => handleLevel(1)}>
                <BsBookmarkFill className="text-lime-600" />
              </button>
              <button onClick={() => handleLevel(2)}>
                <BsBookmarkFill className="text-purple-600" />
              </button>
              <button onClick={() => handleLevel(3)}>
                <BsBookmarkFill className="text-yellow-500" />
              </button>
              <button onClick={() => handleLevel(4)}>
                <BsBookmarkFill className="text-red-600" />
              </button>
            </div>
          </div>
          <div className="flex items-center  gap-3">
            <p className="hidden xs:block">Sort:</p>
            <div className="relative flex items-center  gap-3">
              <div
                className={`absolute h-1 w-6 -top-3 rounded-b-full  
                transition-all transform-gpu duration-500 bg-red-500 ${sortlinePos}`}
              />
              <button
                onClick={() => {
                  setSearchParams({
                    ...urlParams,
                    sortBy: "name",
                    sortOrder: "asce",
                  });
                }}
              >
                <FaSortAlphaDown />
              </button>
              <button
                onClick={() => {
                  setSearchParams({
                    ...urlParams,
                    sortBy: "name",
                    sortOrder: "desc",
                  });
                }}
              >
                <FaSortAlphaDownAlt />
              </button>

              <button
                onClick={() => {
                  setSearchParams({
                    ...urlParams,
                    sortBy: "length",
                    sortOrder: "asce",
                  });
                }}
              >
                <FaSortAmountDownAlt />
              </button>
              <button
                onClick={() => {
                  setSearchParams({
                    ...urlParams,
                    sortBy: "length",
                    sortOrder: "desc",
                  });
                }}
              >
                <FaSortAmountDown />
              </button>
            </div>
            <button
              className="text-xl"
              onClick={() => {
                if (searchParams.toString() !== "") {
                  setSearchParams({});
                }
              }}
            >
              <FcClearFilters />
            </button>
          </div>
        </div>

        {/* ------------------------------------- Search  */}
        <div className="relative flex items-center w-full lg:w-1/2 mt-1 lg:mt-0  ">
          <input
            type="text"
            name="search"
            placeholder="Search"
            className="border p-2 w-full pe-20"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyUp={(e) => {
              if (e.key === "Enter") {
                handleSearch();
              }
            }}
          />
          <button onClick={() => handleSearch()} className="absolute right-11">
            <FaSearch />
          </button>
          <button
            onClick={() => setExactMatch(!exactMatch)}
            className={`absolute transition-all duration-300 text-2xl right-3 top-2 `}
          >
            <VscWholeWord
              className={` transition-all duration-300 ${
                !exactMatch ? "text-stone-300" : "text-red-700"
              }`}
            />
            <BsSlashLg
              className={`absolute transition-all duration-300 text-stone-300 right-0 top-0 ${
                !exactMatch ? "opacity-75" : "opacity-0"
              }`}
            />
          </button>
        </div>
      </div>
      <div className="border p-2 mt-2 w-full">
        {/* ------------------------------------- pagination  */}
        <div className="flex w-full items-center justify-center mt-1 mb-3">
          <div className="pagination flex  items-center">
            <button
              disabled={page === 1}
              className="text-2xl mx-3"
              style={{ color: page === 1 ? "gray" : "" }}
              onClick={() => handlePage(-1)}
            >
              <IoArrowBackCircle />
            </button>
            <p className="hidden xs:block ">Page </p>
            <input
              name="page"
              type="number"
              value={pageInput}
              className={`px-1 text-lg font-bold border-b py-0 border-stone-400
           font-mono text-red-700 ${
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

          <div className="flex items-center">
            <p className="hidden 2xs:block ">Showing </p>
            <select
              className="w-10"
              name="items"
              id="items"
              onChange={(e) => setItemsPerPage(e.target.value)}
            >
              <option value="5">5</option>
              <option value="10">10</option>
              <option value="15">15</option>
              <option value="20">20</option>
            </select>
            <p>of {totalCount}</p>
          </div>
        </div>

        {/* ------------------------------------- Map Words  */}
        {isLoading ? (
          <div className="flex items-center gap-3">
            <LoaderIcon /> loading...
          </div>
        ) : (
          <div className="w-full ">
            <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-1 ">
              {!isLoading && words?.length === 0 ? (
                <div>
                  <p>
                    No item to show
                    {urlParams.level && (
                      <span className="font-bold"> with current Filters</span>
                    )}
                    ...!
                  </p>
                  {letsAdd && searchInput && (
                    <button
                      className="p-2 m-2 border"
                      onClick={() => {
                        setNewWords(searchInput);
                        if (newWords) {
                          handleAddAll();
                        }
                      }}
                    >
                      Double click to Feed Pronagon with :{" "}
                      <span className="font-bold text-lime-600">
                        "{searchInput}"
                      </span>{" "}
                      ...!
                    </button>
                  )}
                </div>
              ) : (
                words.map((item, index) => {
                  return (
                    <div key={item._id}>
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
        )}
      </div>
    </div>
  );
}

export default EnglishDic;
