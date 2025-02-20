import React, { useState } from 'react';

const Spinner = () => {
  const [rotation, setRotation] = useState(0);
  const [rotation2, setRotation2] = useState(0);
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);
  const [result2, setResult2] = useState(null);
  const [totalPlayers, setTotalPlayers] = useState(5);
  const [isChallenge, setIsChallenge] = useState(false)

  const handleStart = () => {
    if (spinning) return;

    // Calculate target position
    const anglePerPlayer = 360 / totalPlayers;
    const targetNumber = Math.floor(Math.random() * totalPlayers) + 1;
    let targetNumber2 = Math.floor(Math.random() * totalPlayers) + 1;
    console.log(targetNumber,targetNumber2);
    
    if (targetNumber === targetNumber2){
      console.log("equal");
      
      targetNumber2 = Math.floor(Math.random() * totalPlayers) + 1;
      if (targetNumber === targetNumber2){
        console.log("equal 2");
        
        targetNumber2 = Math.floor(Math.random() * totalPlayers) + 1;
        
      }
    }
    const targetAngle = (targetNumber - 1) * anglePerPlayer;
    const targetAngle2 = (targetNumber2 - 1) * anglePerPlayer;
    
    // Calculate rotation needed
    const currentRotation = rotation % 360;
    const currentRotation2 = rotation2 % 360;

    const delta = (targetAngle - currentRotation + 360) % 360;
    const delta2 = (targetAngle2 - currentRotation2 + 360) % 360;
    const spins = 5;
    const totalRotation = rotation + 360 * spins + delta;
    const totalRotation2 = rotation2 + 360 * spins + delta2;

    // Start animation
    setSpinning(true);
    setRotation(totalRotation);
    setRotation2(totalRotation2);

    // Stop after animation completes
    setTimeout(() => {
      setSpinning(false);
      setResult(targetNumber);
      setResult2(targetNumber2);
    }, 2000);
  };

  const handleInput=(e)=>{
    setTotalPlayers(p=>e.target.value)
  }

  return (
    <div className="flex flex-col items-center  gap-5 p-5">
      {/* Circle Container */}
      <button 
      onClick={handleStart}
      disabled={spinning}
      className="relative w-72 h-72 rounded-full border-2 border-gray-700 bg-white">
        {/* Numbers around the circle */}
        {Array.from({ length: totalPlayers }).map((_, index) => {
          const angle = (360 / totalPlayers) * index;
          return (
            <div
              key={index}
              className="origin-center absolute text-xl font-bold  left-34 top-32  "
              style={{
                transform: ` rotate(${angle}deg) translateY(-126px) rotate(-${angle}deg)`,
              }}
            >
              {index + 1}
            </div>
          );
        })}

        {/* Arrow */}
        <div
          className="absolute left-1/2 top-1/2 w-2 h-24 bg-blue-800 origin-bottom rounded-full transition-transform duration-[200ms] ease-out"
          style={{ transform: `translate(-50%, -100%) rotate(${rotation}deg)` }}
        >
          {/* Arrowhead */}
          <div className="absolute -bottom-2 -left-1.5 w-5 h-5 bg-blue-800 rounded-full" />
        </div>

        {/* Arrow 2 */}
        {isChallenge && <div
          className="absolute left-1/2 top-1/2 w-2 h-24 bg-orange-500 origin-bottom rounded-full transition-transform duration-[2500ms] ease-out"
          style={{ transform: `translate(-50%, -100%) rotate(${rotation2}deg)` }}
        >
          {/* Arrowhead */}
          <div className="absolute -bottom-2 -left-1.5 w-5 h-5 bg-blue-800 rounded-full" />
        </div>}
      </button>

      {/* Number of Players Input */}
      <div className='flex justify-center items-center border rounded-md p-2'>
        <p>
          
          Total Players:
          </p>
      <input className=' px-2 ms-2 border rounded-sm w-10' type="number" value={totalPlayers} onChange={(e)=>handleInput(e)} />
      <div className='flex gap-2 items-center'>

      <p className='ms-6'>
        Challenge
      </p>
      <input type="checkbox" name="challange" value={isChallenge} onChange={()=>setIsChallenge(!isChallenge)}/>
      </div>
      </div>
      {/* Result Display */}
      {result && (
        <div className='flex gap-2 text-2xl font-bold text-gray-800'>

        <div className="text-blue-700">Player {result}  </div>
        
        { isChallenge && <>
         <p> challenges </p>
        <div className="text-orange-500"> Player {result2} </div>
        </>
        }
        
        </div>
      )}
    </div>
  );
};

export default Spinner;
