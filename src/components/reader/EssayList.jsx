import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import axiosApi from "../../api/axiosApi";
import { BASE_URL } from "../../api/config";
import ActiveParaghraph from "./ActiveParaghraph";

function EssayList() {
  const [essays, setEssays] = useState([]);
  const [explodedText, setExplodedText] = useState([]);
  const [title, setTitle] = useState("");

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
      .replace(/([.,?!'"'])/g, " $1 ")
      .split(" ")
      .map((item) => ({
        word: item.slice(0, 3) === "@**" ? item.substring(3) : item,
        highlight: item.slice(0, 3) === "@**" ? true : false,
      }));
  }

  const handleSelectEssay = (essay) => {
    console.log(essay);
    setTitle(essay.title);
    setExplodedText(strToArr(essay.content));
  };

  if (essays.length === 0) {
    return <p className="p-3">List is Empty...</p>;
  }

  return (
    <div className="mt-2">
      <div>
        {essays.map((essay, index) => {
          return (
            <div
              key={essay._id}
              onClick={() => handleSelectEssay(essay)}
              className="cursor-pointer flex gap-2 font-semibold hover:text-lime-700 hover:bg-lime-50 w-full border-b p-1 ps-2"
            >
              <p>{index + 1}-</p>
              <p className="">{essay.title}</p>
            </div>
          );
        })}
      </div>

      <div>
        <ActiveParaghraph
          explodedText={explodedText}
          setExplodedText={setExplodedText}
          title={title}
        />
      </div>
    </div>
  );
}

export default EssayList;
