import React, { useState, useEffect } from "react";
import shuffleMedia from "./shuffle.mp3";

const SlotMachine = ({ numCards = 5, duration = 3, start, target }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isSpinning, setIsSpinning] = useState(false);
  const [finalIndex, setFinalIndex] = useState(null);

  const playShuffle = () => {
    const audioShuffle = new Audio(shuffleMedia);
    audioShuffle.play();
  };
  const imagePaths = Array.from(
    { length: numCards },
    (_, i) => `/img/questions/card-${i + 1}.png`
  );
  const imageBackPaths = Array.from(
    { length: numCards },
    (_, i) => `/img/questions/cardback-${i + 1}.png`
  );

  useEffect(() => {
    if (!isSpinning) return;

    const totalFrames = 10; // number of card swaps during the spin
    const startTime = Date.now();

    const spinStep = (frame) => {
      playShuffle();
      if (frame >= totalFrames) {
        // Stop spinning

        //targetCard(target);
        setFinalIndex(target);
        setCurrentIndex(target);
        setIsSpinning(false);
        return;
      }

      setCurrentIndex((prev) => (prev + 1) % numCards);

      // Calculate progressive delay: starts fast, slows down
      const progress = frame / totalFrames; // 0 to 1
      const minDelay = 50;
      const maxDelay = 400;
      const delay = minDelay + (maxDelay - minDelay) * progress;

      setTimeout(() => spinStep(frame + 1), delay);
    };

    spinStep(0);
  }, [isSpinning, numCards]);

  const startSpin = () => {
    if (isSpinning) return;
    setFinalIndex(null);
    setIsSpinning(true);
  };

  useEffect(() => {
    if (start) {
      startSpin();
    }
  }, [start]);

  return (
    <div className=" ">
      <div className="w-11/12 mx-auto  rounded-3xl shadow-xl overflow-hidden flex items-center justify-center bg-white">
        {finalIndex === null && (
          <img
            src={imagePaths[currentIndex]}
            alt={`Card ${currentIndex + 1}`}
            className="object-contain w-full h-full"
          />
        )}
        {finalIndex !== null && (
          <img
            src={imageBackPaths[currentIndex]}
            alt={`Card back ${currentIndex + 1}`}
            className="object-contain w-full h-full"
          />
        )}
      </div>
    </div>
  );
};

export default SlotMachine;
