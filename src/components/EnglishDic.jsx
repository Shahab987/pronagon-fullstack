import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import { BASE_URL } from "../api/config";
import Word from "./Word";
import { IoArrowBackCircle, IoArrowForwardCircle } from "react-icons/io5";
import { LoaderIcon, toast } from "react-hot-toast";
import {
  BsBookmarkFill,
  BsSlashLg,
  BsToggleOff,
  BsToggleOn,
} from "react-icons/bs";
import {
  FaSearch,
  FaSortAlphaDown,
  FaSortAlphaDownAlt,
  FaSortAmountDown,
  FaSortAmountDownAlt,
} from "react-icons/fa";
import { FcClearFilters, FcViewDetails } from "react-icons/fc";
import { VscWholeWord } from "react-icons/vsc";
import { useLocation, useSearchParams } from "react-router-dom";
import axiosApi from "../api/axiosApi";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "../features/auth/authActions";
import { BiToggleLeft, BiToggleRight } from "react-icons/bi";

function EnglishDic() {
  const storedUserSituation = JSON.parse(localStorage.getItem("userSituation"));

  const [words, setWords] = useState([]);
  const [newWords, setNewWords] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [page, setPage] = useState(storedUserSituation?.page || 1);
  const [pageInput, setPageInput] = useState(
    parseInt(storedUserSituation?.page) || 1
  );
  const [itemsPerPage, setItemsPerPage] = useState(
    storedUserSituation?.itemsPerPage || 5
  );
  const [isLoading, setIsLoading] = useState(false);
  const [counter, setCounter] = useState(0);
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [underlinePos, setUnderlinePos] = useState("opacity-0");
  const [sortlinePos, setSortlinePos] = useState("opacity-0");
  const [exactMatch, setExactMatch] = useState(false);
  const [letsAdd, setLetsAdd] = useState(false);
  const [currentExpand, setCurrentExpand] = useState(-1);
  const [expandAll, setExpandAll] = useState(false);
  const [urlParams, setUrlParams] = useState(
    storedUserSituation?.urlParams ||
      Object.fromEntries(new URLSearchParams(location?.search)) ||
      {}
  );

  const { loading, success, error, userToken, user } = useSelector(
    (state) => state.auth
  );

  const dispatch = useDispatch();

  const handleShortcuts = (event) => {
    if (event.ctrlKey && event.key === "h") {
      // Handle CTRL+H key combination
      console.log("CTRL+H pressed");
    }
    if (event.code === "ArrowLeft") {
      handlePage("backward");
    }
    if (event.code === "ArrowRight") {
      handlePage("forward");
    }
  };

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
          if (urlParams.search || urlParams.exact) {
          }
        } else {
          setTotalCount(res.data.pagination.totalCount);
          setWords(res.data.data);
          setLetsAdd(true);
        }
      })
      .catch((err) => {
        console.log(err.response.data.message, err.response);
        if (err.response.status === 401) {
          dispatch(logout());
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handlePage = (go) => {
    const maxPage = Math.ceil(totalCount / itemsPerPage);
    if (go === "forward" && page <= totalCount / itemsPerPage) {
      setPage((p) => {
        setPageInput(p + 1);
        return p + 1;
      });
    } else if (go === "backward" && page > 1) {
      setPage((p) => {
        setPageInput(p - 1);
        return p - 1;
      });
    } else if (go > maxPage && maxPage !== 0) {
      setPage(maxPage);
      setPageInput(maxPage);
    } else if (go < 1) {
      setPage(1);
      setPageInput(1);
    }
  };

  const handleAddAll = async () => {
    setIsLoading(true);
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
              // await axios
              //   .get(`${BASE_URL}/openai`, {
              //     params: {
              //       word: item,
              //     },
              //   })
              //   .then((response) => {
              //     console.log(response.data.choices[0].message.content);
              //     openAiResponse = JSON.parse(
              //       response.data.choices[0].message.content
              //     );
              //     tmpNewWord = {
              //       ...tmpNewWord,
              //       meaning: openAiResponse.meaning,
              //       pronunciation: openAiResponse.pronunciation,
              //       example: openAiResponse.example,
              //     };
              //     console.log(tmpNewWord);
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
    const maxPage = Math.ceil(totalCount / itemsPerPage);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    if (e.target.value) {
      if (e.target.value > maxPage && maxPage > 0) {
        setPage(maxPage);
        setPageInput(maxPage);
      } else if (e.target.value < 1) {
        setPage(1);
        setPageInput(1);
      } else {
        setPage(+e.target.value);
      }
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
        setUnderlinePos("bg-stone-300 translate-x-0");
        break;
      case "1":
        setUnderlinePos("bg-lime-600 translate-x-7");
        break;
      case "2":
        setUnderlinePos("bg-purple-600 translate-x-14");
        break;
      case "3":
        setUnderlinePos("bg-yellow-500 translate-x-21");
        break;
      case "4":
        setUnderlinePos("bg-red-600 translate-x-28");
        break;

      default:
        setUnderlinePos("translate-x-0 opacity-0");
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
        setSortlinePos("-translate-x-1 opacity-0");
        break;
    }
  };

  useEffect(() => {
    setUrlParams(Object.fromEntries(new URLSearchParams(location?.search)));
  }, [location]);

  useEffect(() => {
    if (success && user.id) {
      FetchWords();
    }
    handleUnderlinePos();
    const userSituation = {
      page: page,
      itemsPerPage: itemsPerPage,
      urlParams: urlParams,
    };
    if (!urlParams.search && !urlParams.exact) {
      localStorage.setItem("userSituation", JSON.stringify(userSituation));
    }
  }, [page, urlParams, success, itemsPerPage]);

  useEffect(() => {
    if (page > 1) {
      handlePage(page);
    }
  }, [itemsPerPage, totalCount]);

  useEffect(() => {
    handleSearch();
  }, []);

  useEffect(() => {
    handleSearch();
  }, [exactMatch]);

  if (!success && !user.id) {
    if (loading) {
      return (
        <div className="flex text-xl justify-center items-center gap-3">
          <div className="scale-150 mt-1">
            <LoaderIcon />
          </div>
          Loading...
        </div>
      );
    } else {
      return (
        <div className="text-center pt-4 text-2xl text-red-900">
          <p>Please login first.</p>
        </div>
      );
    }
  } else if (!user.isActive) {
    return (
      <div className="text-center pt-4 text-2xl text-red-900">
        <p>Please Activate your account first.</p>
      </div>
    );
  }

  return (
    <div
      className=" w-full  px-3 outline-none"
      onKeyDown={(e) => handleShortcuts(e)}
      tabIndex="0"
    >
      {/* ------------------------------------- Add new words  */}
      {user.role === "ADMIN" && (
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
      )}
      <div className="flex flex-col lg:flex-row lg:gap-1 mt-2">
        {/* ------------------------------------- Filter & Sort  */}
        <div className="lg:w-1/2 flex p-2 border gap-4 h-11">
          <div className="flex gap-2">
            <p className="hidden xs:block">Filter:</p>
            <div className="flex gap-2 text-xl relative">
              <div
                className={`absolute h-1 w-5 -top-2 left-0 rounded-b-full  
                transition-all transform-gpu duration-500    ${underlinePos}`}
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
                transition-all transform-gpu duration-500 bg-sky-700 ${sortlinePos}`}
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
                  setSearchInput("");
                }
              }}
            >
              <FcClearFilters />
            </button>
          </div>
        </div>
        <div className="flex flex-col gap-1 mt-1 lg:mt-0 md:flex-row md:gap-1  lg:w-1/2 ">
          {/* ------------------------------------- Search  */}
          <div className="relative flex items-center w-full md:w-1/2 border h-11 lg:mt-0  ">
            <input
              type="text"
              name="search"
              placeholder="Search"
              className=" p-2 w-full pe-20 h-full"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyUp={(e) => {
                if (e.key === "Enter") {
                  handleSearch();
                }
              }}
            />
            <button
              onClick={() => handleSearch()}
              className="absolute right-11"
            >
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
          {/* ---------------------------------- Expand & Focus */}
          <div className="relative flex items-center w-full md:w-1/2  lg:mt-0  border h-11 px-2 ">
            <p>Expand</p>
            <button
              className="text-3xl text-lime-800 ms-1 transition-all pt-1"
              onClick={() => {
                setExpandAll((p) => !p);
              }}
            >
              {expandAll ? <BiToggleRight /> : <BiToggleLeft />}
            </button>
            <p className="ms-5">Focus</p>
            <button
              className="text-3xl text-lime-800 ms-1 transition-all pt-1"
              onClick={() => {
                setItemsPerPage((p) => (p === 1 ? 5 : 1));
              }}
            >
              {itemsPerPage === 1 ? <BiToggleRight /> : <BiToggleLeft />}
            </button>
          </div>
        </div>
      </div>
      <div className="border p-2 mt-2 w-full">
        {/* ------------------------------------- pagination  */}
        <div className="flex w-full items-center justify-center mt-1 mb-3">
          {/* Pagination Controls */}

          <div className="pagination flex items-center">
            <button
              disabled={page === 1}
              className="text-2xl mx-3"
              style={{ color: page === 1 ? "gray" : "" }}
              onClick={() => handlePage("backward")}
            >
              <IoArrowBackCircle />
            </button>
            <p className="hidden xs:block">Page </p>
            <input
              name="page"
              type="number"
              value={pageInput}
              className={`px-1 text-lg font-bold border-b py-0 border-stone-400 font-mono text-red-700 ${
                pageInput < 9
                  ? "w-5"
                  : pageInput < 100
                  ? "w-8"
                  : pageInput < 1000
                  ? "w-10"
                  : "w-13"
              }`}
              onChange={(e) => handlePageInput(e)}
              maxLength={3}
              min={1}
              max={Math.ceil(totalCount / itemsPerPage)}
            />
            <p className="cursor-default">
              of {Math.ceil(totalCount / itemsPerPage)}
            </p>
            <button
              className="text-2xl mx-3"
              onClick={() => handlePage("forward")}
            >
              <IoArrowForwardCircle />
            </button>
          </div>

          {/* Items Per Page Selector */}
          <div className="flex items-center">
            <p className="hidden sm:block">Showing </p>
            <select
              className="w-10"
              name="items"
              id="items"
              onChange={(e) => setItemsPerPage(e.target.value)}
              value={itemsPerPage}
            >
              {[1, 5, 10, 15, 20].map((value) => (
                <option key={value} value={value}>
                  {value}
                </option>
              ))}
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
            <div className={`flex flex-col  gap-2`}>
              {!isLoading && words?.length === 0 ? (
                <div>
                  <div>
                    No item to show
                    {urlParams.level && (
                      <span>
                        <span className="font-bold">
                          {" "}
                          with current Filters ...!
                        </span>
                        <p
                          onClick={() => {
                            if (searchParams.toString() !== "") {
                              setSearchParams((prev) => {
                                const temp = new URLSearchParams(
                                  prev.toString()
                                );
                                temp.delete("level");
                                return temp;
                              });
                            }
                          }}
                          className="cursor-pointer underline font-bold text-lime-600"
                        >
                          Clear Filters
                        </p>
                        to search among all words
                      </span>
                    )}
                  </div>
                  {!urlParams.level && letsAdd && searchInput && (
                    <button
                      className="p-2 m-2 border"
                      onClick={() => {
                        setNewWords(searchInput);
                        if (newWords) {
                          handleAddAll();
                        }
                      }}
                    >
                      Double click to Feed Phonegon with :{" "}
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
                        itemsPerPage={itemsPerPage}
                        currentExpand={currentExpand}
                        setCurrentExpand={setCurrentExpand}
                        item={item}
                        deleteItem={deleteItem}
                        FetchWords={FetchWords}
                        user={user}
                        expandAll={expandAll}
                      />
                    </div>
                  );
                })
              )}
            </div>
          </div>
        )}
        {/* -------------------- Single Pagination  */}

        {itemsPerPage < 5 && (
          <div className=" flex w-full items-center justify-center mt-4">
            <button
              disabled={page === 1}
              className="text-9xl mx-3 text-lime-300"
              style={{ color: page === 1 ? "gray" : "" }}
              onClick={() => handlePage("backward")}
            >
              <IoArrowBackCircle />
            </button>

            <button
              className="text-9xl mx-3 text-lime-300"
              onClick={() => handlePage("forward")}
            >
              <IoArrowForwardCircle />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default EnglishDic;
