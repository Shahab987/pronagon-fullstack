import React from "react";

function SubText({ wordObj, index, setSearchIndex, setHighlight }) {
  const requestData = () => {};
  const handleClick = () => {
    setSearchIndex(index);
    navigator.clipboard.writeText(wordObj.word);
  };

  return (
    <span
      onClick={(e) => setHighlight(index)}
      onDoubleClick={(e) => handleClick(e)}
      className={`cursor-pointer hover:text-red-800 hover:border-b-4 ${
        wordObj.highlight && "bg-amber-200"
      }`}
      style={{ userSelect: "none" }}
    >
      {wordObj.word}
    </span>
  );
}

export default SubText;
