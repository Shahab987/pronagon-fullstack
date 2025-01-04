import React, { useState } from "react";

const Letter = ({ letter, selectGroup }) => (
  <div
    onClick={() => selectGroup(letter)}
    className=" p-1 w-10 xs:w-12 sm:w-18 sm:py-1 md:w-20  border
  text-center text-2xl  xs:text-3xl sm:text-4xl md:text-5xl
   font-bold font-VazirMatn select-none hover:border-red-400"
  >
    {letter}
  </div>
);

const Group = ({ arr, selectGroup }) => {
  return (
    <div className="">
      <div className="flex justify-center border- ">
        <SubGroup
          selectGroup={selectGroup}
          arr={arr[0]}
          borderColor={"border-2 border-red-600"}
        />
      </div>
      <div className="flex flex-row-reverse justify-center">
        <SubGroup
          selectGroup={selectGroup}
          arr={arr[1]}
          borderColor={"border-2 border-lime-600"}
        />
        <SubGroup
          selectGroup={selectGroup}
          arr={arr[2]}
          borderColor={"border-2 border-amber-400"}
        />
      </div>
      <div className="flex justify-center ">
        <SubGroup
          selectGroup={selectGroup}
          arr={arr[3]}
          borderColor={"border-2 border-sky-500"}
        />
      </div>
    </div>
  );
};

const SubGroup = ({ arr, borderColor, selectGroup }) => {
  return (
    <div className={`border ${borderColor} m-[2px]`}>
      <div className="flex justify-center ">
        <Pair selectGroup={selectGroup} arr={arr[0]} bgColor={"bg-lime-50"} />
      </div>
      <div className="flex flex-row-reverse justify-center">
        <Pair selectGroup={selectGroup} arr={arr[1]} bgColor={"bg-blue-50"} />
        <Pair selectGroup={selectGroup} arr={arr[2]} bgColor={"bg-purple-50"} />
      </div>
      <div className="flex justify-center ">
        <Pair selectGroup={selectGroup} arr={arr[3]} bgColor={"bg-orange-50"} />
      </div>
    </div>
  );
};

const Pair = ({ arr, bgColor, selectGroup }) => {
  return (
    <div
      className={`flex flex-row-reverse justify-center ${bgColor} border-2 border-gray-200  m-[1px]`}
    >
      <Letter selectGroup={selectGroup} letter={arr[0]} />
      <Letter selectGroup={selectGroup} letter={arr[1]} />
    </div>
  );
};

const DirectionType = () => {
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

  const [currentGroup, setCurrentGroup] = useState(farsiLetters);
  const [level, setLevel] = useState(1);
const [finalWord, setFinalWord] = useState("")

  const selectGroup = (letter) => {
    if (level === 1) {
      let a = farsiLetters.filter((group) => {
        return (
          group.filter((pair) => pair.findIndex((i) => i === letter) !== -1)
            .length && group
        );
      })[0];

      setCurrentGroup(a);
      setLevel(2);
    }

    if (level === 2) {
    //   let b = currentGroup.filter(
    //     (pair) => pair.findIndex((i) => i === letter) !== -1
    //   )[0];

    //   setCurrentGroup(b);
    //   setLevel(3);
        setCurrentGroup(farsiLetters)
        setLevel(1)
        setFinalWord(p=>p+letter)
    }
    if (level === 3) {
        setCurrentGroup(farsiLetters)
        setLevel(1)
        setFinalWord(p=>p+letter)
    }
  };

  return (
    <div className="">
      <div className="flex flex-row-reverse">
      <p className="text-2xl text-right my-1 p-1 pe-4 border border-gray-800 font-VazirMatn h-11 w-10/12 rounded-r-md">{finalWord}</p>
        <button onClick={()=>{setFinalWord(p=>p+" ")}} className="text-center w-2/12 text-2xl font-VazirMatn border-y border-gray-800 h-11 mt-1 bg-blue-50 ">فاصله</button>
        <button onClick={()=>{setFinalWord("")}} className="text-center w-2/12 text-2xl font-VazirMatn border border-gray-800 h-11 mt-1 bg-red-50 rounded-l-lg">پاک</button>
      </div>
      {level === 1 && <Group selectGroup={selectGroup} arr={currentGroup} />}

      {level === 2 && <SubGroup selectGroup={selectGroup} arr={currentGroup} />}

      {level === 3 && <Pair selectGroup={selectGroup} arr={currentGroup} />}

    </div>
  );
};

export default DirectionType;
