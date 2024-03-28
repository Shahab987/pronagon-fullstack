import React, { useState } from "react";
import { useEffect } from "react";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import axiosApi from "../../api/axiosApi";
import { BASE_URL } from "../../api/config";

import LoaderButton from "../ui/LoaderButton";
import ActiveParaghraph from "./ActiveParaghraph";

function AddEssay() {
  const [text, setText] = useState("");
  const [title, setTitle] = useState("");
  const [explodedText, setExplodedText] = useState([]);

  const [saveLoading, setSaveLoading] = useState(false);

  const { loading, success, error, userToken, user } = useSelector(
    (state) => state.auth
  );

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

  function arrToStr(expTextArr) {
    return expTextArr
      .filter((obj) => obj.word !== "")
      .map((wordObj) =>
        wordObj.highlight ? "@**" + wordObj.word : wordObj.word
      )
      .join(" ");
  }

  const handleChange = (event) => {
    setText(event.target.value);
    let tempText = event.target.value;
    let splitText = strToArr(tempText);
    setExplodedText(splitText);
  };

  const handleChangeTitle = (e) => {
    setTitle(e.target.value);
  };

  const handleSaveEssay = (e) => {
    e.preventDefault();
    setSaveLoading(true);
    if (title && text && explodedText.length > 0) {
      const unifiedText = arrToStr(explodedText);

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

        {/* ---------------------- paragraph box  */}
        <ActiveParaghraph
          explodedText={explodedText}
          setExplodedText={setExplodedText}
          title={title}
          setIsEditing={() => {}}
        />
      </div>
    </div>
  );
}

export default AddEssay;
