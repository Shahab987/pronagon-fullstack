import React from "react";

function SubText({ subText, index, setSearchIndex }) {
  const requestData = () => {};
  const handleClick = () => {
    setSearchIndex(index);
  };

  return (
    <span
      onClick={(e) => handleClick(e)}
      className="cursor-pointer hover:text-red-800 hover:border-b-4"
    >
      {subText}
    </span>
  );
}

export default SubText;
