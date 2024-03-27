import React from "react";
import SubText from "../SubText";

function ActiveParaghraph({ explodedText, setSearchIndex, setHighlight }) {
  return (
    <div>
      <div className="mt-5 p-3 bg-gray-50">
        <p className="text-lg font-bold text-lime-800">Active Text :</p>
        <p className="w-full  font-semibold text-stone-700">
          {explodedText.map((wordObj, index) => (
            <span key={index}>
              <SubText
                wordObj={wordObj}
                index={index}
                setSearchIndex={setSearchIndex}
                setHighlight={setHighlight}
              />{" "}
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

export default ActiveParaghraph;
