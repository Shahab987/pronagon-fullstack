import React, { useState } from "react";

export default function FarsiKeyboard() {
  const farsiLetters = [
    [
      ["ا", "ب"],
      ["پ", "ت"],
      ["ث", "ج"],
      ["چ", "ح"],
    ],
    [
      ["خ", "د"],
      ["ذ", "ر"],
      ["ز", "ژ"],
      ["س", "ش"],
    ],
    [
      ["ص", "ض"],
      ["ط", "ظ"],
      ["ع", "غ"],
      ["ف", "ق"],
    ],
    [
      ["ک", "گ"],
      ["ل", "م"],
      ["ن", "و"],
      ["ه", "ی"],
    ],
  ];

  const [step, setStep] = useState(1); // 1: groups, 2: pairs, 3: individual letters
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedPair, setSelectedPair] = useState(null);
  const [inputText, setInputText] = useState("");

  const handleGroupClick = (groupIndex) => {
    setSelectedGroup(groupIndex);
    setStep(2);
  };

  const handlePairClick = (pairIndex) => {
    setSelectedPair(pairIndex);
    setStep(3);
  };

  const handleLetterClick = (letter) => {
    setInputText(inputText + letter);
    // Reset to step 1
    setStep(1);
    setSelectedGroup(null);
    setSelectedPair(null);
  };

  const handleSpace = () => {
    setInputText(inputText + " ");
  };

  const handleBackspace = () => {
    setInputText(inputText.slice(0, -1));
  };

  const handleClear = () => {
    setInputText("");
  };

  // Helper function to display all letters in a group
  const displayGroupLetters = (groupIndex) => {
    const letterBox =
      "border border-gray-500 rounded-md flex items-center justify-center \
   aspect-square w-full  max-w-25 \
   text-[6vw] lg:text-[4vw] font-bold font-VazirMatn \
   select-none text-gray-300 p-2";

    return (
      <div className="grid gap-4">
        {/* Row 1 */}
        <div className="grid grid-cols-2 ">
          <div className="grid grid-cols-2 ">
            <div className={letterBox}>{farsiLetters[groupIndex][0][0]}</div>
            <div className={letterBox}>{farsiLetters[groupIndex][0][1]}</div>
          </div>
          <div className="grid grid-cols-2 ">
            <div className={letterBox}>{farsiLetters[groupIndex][1][0]}</div>
            <div className={letterBox}>{farsiLetters[groupIndex][1][1]}</div>
          </div>
        </div>

        {/* Row 2 */}
        <div className="grid grid-cols-2 ">
          <div className="grid grid-cols-2 ">
            <div className={letterBox}>{farsiLetters[groupIndex][2][0]}</div>
            <div className={letterBox}>{farsiLetters[groupIndex][2][1]}</div>
          </div>
          <div className="grid grid-cols-2 ">
            <div className={letterBox}>{farsiLetters[groupIndex][3][0]}</div>
            <div className={letterBox}>{farsiLetters[groupIndex][3][1]}</div>
          </div>
        </div>

        {/* Row 3 */}
      </div>
    );
  };

  return (
    <div className="h-dvh  flex flex-col  bg-gray-900 text-gray-100" dir="rtl">
      {/* Input area at top */}
      <div className=" bg-gray-800 flex items-center justify-between font-VazirMatn p-2">
        <div className="w-full">
          <input
            type="text"
            value={inputText}
            readOnly
            className="p-2 text-2xl bg-gray-700 rounded text-right font-bold w-full"
            placeholder="متن شما..."
          />
        </div>
        <div className="flex  bg-gray-700 rounded text-right font-bold ">
          <button
            onClick={handleSpace}
            className="px-4 py-3 w-17 bg-blue-600/40 hover:bg-blue-700 rounded font-bold "
          >
            فاصله
          </button>
          <button
            onClick={handleBackspace}
            className="px-4 py-3 w-17 bg-yellow-600/40 hover:bg-yellow-700 rounded font-bold rotate-180"
          >
            ←
          </button>
          <button
            onClick={handleClear}
            className="px-4 py-3 w-17 bg-red-600/40 hover:bg-red-700 rounded font-bold "
          >
            پاک
          </button>
        </div>
      </div>

      {/* Main keyboard area */}
      <div className="">
        {step === 1 && (
          <div className="h-[85dvh] p-5 flex flex-col justify-between gap-10 font-bold font-VazirMatn ">
            {/* Row 1: Group 0 (center) */}
            <div className="grid grid-cols-2 gap-15">
              <button
                onClick={() => handleGroupClick(0)}
                className="  bg-slate-600/50 hover:bg-slate-800 rounded-md transition-colors"
              >
                {displayGroupLetters(0)}
              </button>
              <button
                onClick={() => handleGroupClick(1)}
                className=" bg-blue-900/50 hover:bg-blue-900/20 rounded-md transition-colors"
              >
                {displayGroupLetters(1)}
              </button>
            </div>

            {/* Row 2: Groups 1 and 2 (justify-between) */}
            <div className=" grid grid-cols-2 gap-15">
              <button
                onClick={() => handleGroupClick(2)}
                className=" bg-green-800/40 hover:bg-green-900/30 rounded-md transition-colors"
              >
                {displayGroupLetters(2)}
              </button>
              <button
                onClick={() => handleGroupClick(3)}
                className=" bg-violet-800/30 hover:bg-violet-900/20 rounded-md transition-colors"
              >
                {displayGroupLetters(3)}
              </button>
            </div>
          </div>
        )}

        {step === 2 && selectedGroup !== null && (
          <div className="h-[85dvh] p-5 flex flex-col justify-between font-bold font-VazirMatn">
            <div className="grid grid-cols-2 gap-10">
              {/* Top position - Pair 0 */}
              <button
                onClick={() => handlePairClick(0)}
                className="  bg-pink-600/50 hover:bg-pink-700 h-30  text-5xl font-bold transition-colors items-center flex justify-evenly"
              >
                <div>{farsiLetters[selectedGroup][0][0]}</div>
                <div>{farsiLetters[selectedGroup][0][1]}</div>
              </button>

              {/* Left position - Pair 1 */}
              <button
                onClick={() => handlePairClick(1)}
                className="  bg-cyan-600/50 hover:bg-cyan-700 h-30  text-5xl font-bold transition-colors items-center flex justify-evenly"
              >
                <div>{farsiLetters[selectedGroup][1][0]}</div>
                <div>{farsiLetters[selectedGroup][1][1]}</div>
              </button>
            </div>
            <div className="grid grid-cols-2 gap-10">
              {/* Right position - Pair 2 */}
              <div
                onClick={() => handlePairClick(2)}
                className="  bg-teal-600/50 hover:bg-teal-700 h-30  text-5xl font-bold transition-colors items-center flex justify-evenly"
              >
                <div>{farsiLetters[selectedGroup][2][0]}</div>
                <div>{farsiLetters[selectedGroup][2][1]}</div>
              </div>

              {/* Bottom position - Pair 3 */}
              <button
                onClick={() => handlePairClick(3)}
                className="  bg-indigo-600/50 hover:bg-indigo-700 h-30  text-5xl font-bold transition-colors items-center flex justify-evenly"
              >
                <div>{farsiLetters[selectedGroup][3][0]}</div>
                <div>{farsiLetters[selectedGroup][3][1]}</div>
              </button>
            </div>
          </div>
        )}

        {step === 3 && selectedGroup !== null && selectedPair !== null && (
          <div className="grid grid-cols-2 gap-30 px-12 py-20 font-VazirMatn">
            {/* Left letter */}
            <button
              onClick={() =>
                handleLetterClick(farsiLetters[selectedGroup][selectedPair][0])
              }
              className="  bg-rose-600/50 hover:bg-rose-700  text-[15vw] font-bold transition-colors"
            >
              {farsiLetters[selectedGroup][selectedPair][0]}
            </button>

            {/* Right letter */}
            <button
              onClick={() =>
                handleLetterClick(farsiLetters[selectedGroup][selectedPair][1])
              }
              className="  bg-emerald-600 hover:bg-emerald-700  text-[15vw] font-bold transition-colors"
            >
              {farsiLetters[selectedGroup][selectedPair][1]}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
