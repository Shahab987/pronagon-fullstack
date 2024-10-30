import React, { useState } from 'react';

// Farsi alphabet array
const farsiLetters = ["ا", "ب", "پ", "ت", "ث", "ج", "چ", "ح", "خ", "د", "ذ", "ر", "ز", "ژ", "س", "ش" ," ", "ص", "ض", "ط", "ظ", "ع", "غ", "ف", "ق", "ک", "گ", "ل", "م", "ن", "و", "ه", "ی"];

const EasyType = () => {
  const [text, setText] = useState("");
  const [hoveredLetter, setHoveredLetter] = useState(null);

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
    <div className='flex flex-col h-125'>
      
      {/* Upper section with text field */}
      <div className='flex items-center justify-center border border-gray-300'>
        <textarea
          value={text}
          readOnly
          onClick={() => setText("")}
          className='font-VazirMatn text-9xl p-3 w-full text-right h-44'
          placeholder="---"
        />
      </div>

      {/* Lower section with Farsi letters */}
      <div className='flex flex-nowrap flex-row-reverse h-full border pt-32'>
        {farsiLetters.map((letter, index) => (
          <div
            key={index}
            onClick={() => handleLetterClick(letter)}
            onContextMenu={handleRightClick}
            onMouseEnter={() => setHoveredLetter(letter)}
            onMouseLeave={() => setHoveredLetter(null)}
            className={`relative font-IRYekan text-2xl text-center cursor-pointer p-2 
                border border-gray-400 min-w-9 rounded grow hover:border-black hover:bg-slate-400 h-64
                ${index % 2 === 0 ? "bg-slate-50" : "bg-slate-200"}`}
          >
            {letter}
            {hoveredLetter === letter && (
              <div className={`absolute -top-32 flex justify-center items-center ${index > 16 ? "left-0" : index === 16 ? "-left-16" : "right-0"} text-8xl font-VazirMatn p-1 border rounded bg-gray-100 w-40 h-30`}>
                {hoveredLetter}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default EasyType;
