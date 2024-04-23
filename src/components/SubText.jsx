import React from "react";

function SubText({ wordObj, index, setSearchIndex, setHighlight }) {
  const requestData = () => {};
  const handleClick = () => {
    setSearchIndex(index);
    navigator.clipboard.writeText(wordObj.word);
  };
  console.log(wordObj.searchContent);

  return (
    <span
      onClick={(e) => setHighlight(index)}
      onDoubleClick={(e) => handleClick(e)}
      className={`cursor-pointer hover:text-red-800 hover:border-b-4 ${
        wordObj.highlight && "bg-amber-200"
      } ${wordObj.searchContent && "underline underline-offset-4"}`}
      style={{ userSelect: "none" }}
    >
      {wordObj.word}
    </span>
  );
}

export default SubText;
