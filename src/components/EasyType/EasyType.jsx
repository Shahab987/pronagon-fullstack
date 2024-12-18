import React, { useRef, useState, useEffect } from "react";

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

const predictionDatabase = [
"سلام","خوبه","آره","نه"
];
// const predictionDatabase = [
//   "مسعود",
//   "فاطمه",
//   "سارا",
//   "امین",
//   "شهاب",
//   "زری",
//   "زهرا",
//   "بابا",
//   "آیس",
//   "ارنج",
//   "احساس",
//   "ادرار",
//   "انگشتم",
//   "اورژانس",
//   "اکسیژن",
//   "ایس",
//   "باز",
//   "باسن",
//   "بالا",
//   "بالشت",
//   "بزن",
//   "بمال",
//   "بگو",
//   "گوش",
//   "ببر",
//   "ببر جلو",
//   "ببر عقب",
//   "بده",
//   "بزرگ",
//   "بسته",
//   "بکش",
//   "بیار",
//   "بیا",
//   "بیاد",
//   "بینی",
//   "تخت",
//   "تشنه",
//   "تعویض",
//   "تغییر",
//   "تماس",
//   "حالت",
//   "حسین",
//   "خارش",
//   "خسته",
//   "خواب",
//   "خون",
//   "خونه",
//   "دارو",
//   "درد",
//   "دبلیو",
//   "دستشویی",
//   "دستم",
//   "دست",
//   "دستمال",
//   "دستگاه",
//   "دهان",
//   "دوربین",
//   "راست",
//   "ران",
//   "رو",
//   "روده",
//   "ریه",
//   "زانو",
//   "زیر",
//   "زیر دست",
//   "زیر سر",
//   "زیر پا",
//   "ساعت",
//   "ساق",
//   "ساکشن",
//   "سر",
//   "سرده",
//   "سریال",
//   "سفت",
//   "سلام",
//   "سوزش",
//   "سَرَم",
//   "سِرُم",
//   "شانه",
//   "صاف",
//   "صدا بزن",
//   "عمودی",
//   "غذا",
//   "فشار",
//   "فیلم",
//   "قرص",
//   "قلب",
//   "لباس",
//   "لپتاپ",
//   "ماساژ",
//   "مخرج",
//   "مدفوع",
//   "مسکن",
//   "معده",
//   "ملافه",
//   "ملحفه",
//   "مو",
//   "مچ",
//   "میخاره",
//   "میخوام",
//   "میسوزه",
//   "ناجور",
//   "ناهموار",
//   "نرم",
//   "نظافت",
//   "نمیخوام",
//   "پایم",
//   "پایین",
//   "پتو",
//   "پرده",
//   "پرستار",
//   "پماد",
//   "پنجره",
//   "پهلو",
//   "چرا؟",
//   "چراغ",
//   "چشمم",
//   "چپ",
//   "کتف",
//   "کج",
//   "کجا؟",
//   "کلافه",
//   "کمرم",
//   "کوچک",
//   "گاز",
//   "گردن",
//   "گرسنه",
//   "گرمه",
//   "گلاب",
//   "گوشی",
//   "هستم",
//   "نیستم",
//   "سینه",
//   "ناخن",
//   "کف",
//   "خاموش",
//   "روشن",
//   "شستشو",
//   "شستن",
//   "شست",
//   "ناصاف",
//   "شیاف",
//   "میکنه",
//   "میگیره",
//   "نکن",
//   "دارم",
//   "ندارم",
//   "محکم",
//   "آرام",
// ];

const EasyType = () => {
  const [text, setText] = useState("");
  const [hoveredLetter, setHoveredLetter] = useState(null);
  const divRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [menuVisible, setMenuVisible] = useState(false);
  const [menuWidth, setMenuWidth] = useState(312);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [predictions, setPredictions] = useState([]);
  const [keyboardType, setKeyboardType] = useState(0)

  const handleMouseMove = (e) => {
    const x = e.clientX;
    const y = e.clientY;
    setPosition({ x, y });
  };

  const handleLetterClick = (letter) => {
    if (!menuVisible) {
      setText((prevText) => prevText + letter);
    }
  };

  const handleRightClick = (event) => {
    event.preventDefault(); // Prevent default right-click menu
    
    setMenuVisible((p) => !p);
  };

  const handleMenuOptionClick = (option) => {
    switch (option) {
      case "backspace":
        setText((prevText) => prevText.slice(0, -1));
        break;
      case "space":
        setText((prevText) => prevText + " ");
        break;
      case "clear":
        setText("");
        break;
      default:
        // Assume the option is a prediction word
        setText((p) => {
          const wordArr = p.split(" ");
          wordArr.pop();
          wordArr.push(option + " ");
          return wordArr.join(" ");
        });
        break;
    }
    setMenuVisible(false); // Hide the menu after selecting an option
  };

  const generatePredictions = (inputText) => {
    // Placeholder predictions; replace with real logic if available
    const tempArr = text.split(" ");
    const lastWord = tempArr[tempArr.length - 1] || "-";
    const results = predictionDatabase.filter((word) =>
      word.startsWith(lastWord)
    );
    setPredictions(results.slice(0, 9)); // Limit to 10 predictions
  };

  useEffect(() => {
    setMenuWidth(divRef.current ? divRef.current.offsetWidth : 1);
    
  }, [predictions]);

  useEffect(() => {
    generatePredictions(text);
  }, [text]);

  useEffect(() => {
    const screenWidth = window.innerWidth;
    const menuX = (screenWidth - menuWidth) / 2;
    const menuY = 330;
    setMenuPosition({ x: menuX, y: menuY });
  }, [menuWidth]);

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setPosition({ x: -200, y: -200 })}
      className="flex flex-col h-125 cursor-none"
      onClick={() => setMenuVisible(false)} // Close menu on outside click
    >
      {/* ------------------------- Green Cursor -------------------------- */}
      <div
        className="bg-lime-500 absolute w-7 h-7 cursor-none z-40 drop-shadow-md border-2 border-lime-800"
        style={{
          top: position.y,
          left: position.x,
          borderRadius: "10% 50% 50% 50%",
          pointerEvents: "none", 
        }}
      ></div>
      {/* ------------------------ Text area ----------------------------- */}
      <div className="flex items-center justify-center border border-gray-300">
        <textarea
          value={text}
          readOnly
          onClick={() => setText("")}
          className={`font-VazirMatn font-bold ${
            text.length < 25
              ? "text-8xl"
              : text.length < 30
              ? "text-7xl"
              : "text-6xl"
          }  p-3 w-full text-right h-40 cursor-none text-lime-800`}
          placeholder="---"
        />
      </div>
      {/* ----------------------- predictions ---------------------- */}
      <div className="min-h-12" style={keyboardType === 1 ? {display:"block"} : {display:"none"}}>
        
        <div className="flex flex-row-reverse text-3xl font-VazirMatn gap-5 mt-1">
        {predictions.map((word, index) => (
          <button
            key={index}
            onClick={() => handleMenuOptionClick(word)}
            className="px-3 py-1 text-gray-700 hover:bg-gray-200 rounded border cursor-none"
          >
            {word}
          </button>
        ))}
        </div>
        <button
          onClick={() => setKeyboardType(p=>p===1?0:1)}
          className="px-3 py-2 text-gray-700 bg-green-100 hover:bg-gray-200 rounded border cursor-none w-1/6"
        >
          مدل {keyboardType ? "جدید" : "قدیم"}
        </button>
      </div>
      {/* ----------------------- Long Space and back space ---------------------- */}
      <div className="min-h-16" style={keyboardType === 0 ? {display:"block"} : {display:"none"}}>
        <div className="flex flex-row-reverse text-4xl font-IRYekan gap-2 mt-1 ">
        <button
          onClick={() => handleMenuOptionClick("backspace")}
          className="px-3 py-2 text-gray-700 bg-yellow-100 hover:bg-gray-200 rounded border cursor-none w-1/3"
        >
          حذف
        </button>
        <button
          onClick={() => handleMenuOptionClick("space")}
          className="px-3 py-2 text-gray-700 bg-blue-100 hover:bg-gray-200 rounded border cursor-none w-1/3"
        >
          فاصله
        </button>
        <button
          onClick={() => handleMenuOptionClick("clear")}
          className="px-3 py-2 text-gray-700 bg-red-100 hover:bg-gray-200 rounded border cursor-none w-1/3"
        >
          پاک
        </button>
        <button
          onClick={() => setKeyboardType(p=>p===1?0:1)}
          className="px-3 py-2 text-xl text-gray-700 bg-green-100 hover:bg-gray-200 rounded border cursor-none w-1/6"
        >
           مدل {keyboardType ? "جدید" : "قدیم"}
        </button>
        
        </div>
      </div>

      {/* -------------- horizontal keyboard -----------------  */}
      <div
        onContextMenu={handleRightClick}
        className="flex flex-nowrap flex-row-reverse h-full border mt-1 relative cursor-none"
        style={keyboardType === 1 ? {display:"flex"} : {display:"none"}}
      >
        {farsiLetters.map((letter, index) => (
          <div
            key={index}
            onClick={() => handleLetterClick(letter)}
            onMouseEnter={() => setHoveredLetter(letter)}
            onMouseLeave={() => setHoveredLetter(null)}
            className={`relative font-IRYekan text-2xl text-center cursor-none p-2 
              border border-gray-400 min-w-9 rounded grow hover:border-black hover:bg-slate-400 h-90
              ${index % 2 === 0 ? "bg-slate-50" : "bg-slate-200"}`}
          >
            {letter}

            <div
              className={`z-1 absolute top-26 flex justify-center items-center pointer-events-none ${
                index > 28 ? "left-14" : "right-14"
              } ${
                hoveredLetter === letter ? "opacity-100" : "opacity-0"
              } text-8xl font-VazirMatn font-bold text-pink-900 p-1 border-2 border-pink-800 shadow-6 rounded-xl bg-gray-100 w-30 h-30 duration-100`}
            >
              {hoveredLetter === " " ? (
                <p className="text-5xl">فاصله</p>
              ) : (
                hoveredLetter
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* -------------- Complex keyboard -----------------  */}
      <div
        onContextMenu={handleRightClick}
        className="flex flex-wrap flex-row-reverse border mt-1 relative cursor-none"
        style={keyboardType === 0 ? {display:"flex"} : {display:"none"}}
      >
        {farsiLetters.map((letter, index) => (
          <div
            key={index}
            onClick={() => handleLetterClick(letter)}
            onMouseEnter={() => setHoveredLetter(letter)}
            onMouseLeave={() => setHoveredLetter(null)}
            className={`relative font-IRYekan text-xl xl:text-5xl lg:text-3xl text-center cursor-none p-2
              border border-gray-400 w-[6.25%] h-45 rounded  hover:border-black hover:bg-slate-400 
              ${index % 2 === 0 ? "bg-slate-50" : "bg-slate-200"}`}
          >
            {letter}

            <div
              className={`z-1 absolute top-26 flex justify-center items-center pointer-events-none ${
                index > 28 ? "left-14" : "right-14"
              } ${
                hoveredLetter === letter ? "opacity-100" : "opacity-0"
              } text-8xl font-VazirMatn font-bold text-pink-900 p-1 border-2 border-pink-800 shadow-6 rounded-xl bg-gray-100 w-30 h-30 duration-100`}
            >
              {hoveredLetter === " " ? (
                <p className="text-5xl">فاصله</p>
              ) : (
                hoveredLetter
              )}
            </div>
          </div>
        ))}
      </div>

        {/* --------------------- Rightclick menu --------------------- */}
      <div
        onContextMenu={(e) => {
          e.preventDefault();
          setMenuVisible(false);
        }}
        ref={divRef}
        className="absolute font-VazirMatn text-4xl font-bold z-30 h-60 flex flex-row-reverse bg-white border border-gray-300 rounded-lg shadow-lg p-2 cursor-none"
        style={{
          top: 330,
          left: menuPosition.x,
          opacity: menuVisible ? "1" : "0",
          pointerEvents: menuVisible ? "auto" : "none",
        }}
      >
        <button
          onClick={() => handleMenuOptionClick("backspace")}
          className="px-3 py-1 text-gray-700 bg-yellow-100 hover:bg-gray-200 rounded border cursor-none"
        >
          حذف
        </button>
        <button
          onClick={() => handleMenuOptionClick("space")}
          className="px-3 py-1 text-gray-700 bg-blue-100 hover:bg-gray-200 rounded border cursor-none"
        >
          فاصله
        </button>
        <button
          onClick={() => handleMenuOptionClick("clear")}
          className="px-3 py-1 text-gray-700 bg-red-100 hover:bg-gray-200 rounded border cursor-none"
        >
          پاک
        </button>
        {predictions.map((word, index) => (
          <button
            key={index}
            onClick={() => handleMenuOptionClick(word)}
            className="px-3 py-1 text-gray-700 hover:bg-gray-200 rounded border cursor-none"
          >
            {word}
          </button>
        ))}
      </div>
    </div>
  );
};

export default EasyType;
