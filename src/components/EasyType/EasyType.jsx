import React, { useRef, useState } from "react";

// Farsi alphabet array
const farsiLetters = [
  "ا",
  "ب",
  "پ",
  "ت",
  "ث",
  "ج",
  "چ",
  "ح",
  "خ",
  "د",
  "ذ",
  "ر",
  "ز",
  "ژ",
  "س",
  "ش",
  " ",
  "ص",
  "ض",
  "ط",
  "ظ",
  "ع",
  "غ",
  "ف",
  "ق",
  "ک",
  "گ",
  "ل",
  "م",
  "ن",
  "و",
  "ه",
  "ی",
];

const EasyType = () => {
  const [text, setText] = useState("");
  const [hoveredLetter, setHoveredLetter] = useState(null);
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    setPosition({ x, y });
  };
  // Handle letter click to append letter to text
  const handleLetterClick = (letter) => {
    setText((prevText) => prevText + letter);
  };

  // Handle right-click to backspace
  const handleRightClick = (event) => {
    event.preventDefault(); // Prevent default right-click menu
    setText((prevText) => prevText.slice(0, -1));
  };

  return (
    <div
      ref={divRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPosition({ x: -200, y: -200 })}
      className="flex flex-col h-125 cursor-none"
    >
      <div
        className="bg-lime-500 absolute w-7 h-7 cursor-none z-9  drop-shadow-md border-2 border-lime-800"
        style={{
          top: position.y,
          left: position.x,
          borderRadius: "10% 50% 50% 50%",
          pointerEvents: "none", // So it doesn't interfere with the cursor movement
        }}
      ></div>
      {/* Upper section with text field */}
      <div className="flex items-center justify-center border border-gray-300">
        <textarea
          value={text}
          readOnly
          onClick={() => setText("")}
          className="font-VazirMatn font-bold text-8xl p-3 w-full text-right h-44 cursor-none text-lime-800"
          placeholder="---"
        />
      </div>

      {/* Lower section with Farsi letters */}
      <div className="flex flex-nowrap flex-row-reverse h-full border mt-5 relative cursor-none">
        {farsiLetters.map((letter, index) => (
          <div
            key={index}
            onClick={() => handleLetterClick(letter)}
            onContextMenu={handleRightClick}
            onMouseEnter={() => setHoveredLetter(letter)}
            onMouseLeave={() => setHoveredLetter(null)}
            className={`relative font-IRYekan text-2xl text-center cursor-none p-2 
                border border-gray-400 min-w-9 rounded grow hover:border-black hover:bg-slate-400 h-100
                ${index % 2 === 0 ? "bg-slate-50" : "bg-slate-200"}`}
          >
            {letter}
            
              <div
                className={` z-1 absolute top-26 flex justify-center items-center pointer-events-none ${
                  index > 28 ? "left-14" : "right-14"
                } ${hoveredLetter === letter ? "opacity-100" : "opacity-0"} text-8xl font-VazirMatn font-bold text-pink-900 p-1 border-2 border-pink-800 shadow-6 rounded-xl bg-gray-100 w-30 h-30 duration-100 `}
              >
                {hoveredLetter === " " ? <p className="text-5xl">فاصله</p>  : hoveredLetter}
              </div>
           
          </div>
        ))}
      </div>
    </div>
  );
};

export default EasyType;
