import React, { useState, useEffect, useRef } from "react";

function HeartBeat() {
  const [taps, setTaps] = useState([]);
  const [heartRate, setHeartRate] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [lastTapTime, setLastTapTime] = useState(null);
  const [animationPosition, setAnimationPosition] = useState(0);
  const buttonRef = useRef(null);
  const animationRef = useRef(null);
  const heartbeatRef = useRef(null);

  // Calculate heart rate based on tap intervals
  const calculateHeartRate = (tapTimes) => {
    if (tapTimes.length < 2) return 0;

    const intervals = [];
    for (let i = 1; i < tapTimes.length; i++) {
      intervals.push(tapTimes[i] - tapTimes[i - 1]);
    }

    // Calculate average interval in milliseconds
    const averageInterval =
      intervals.reduce((sum, interval) => sum + interval, 0) / intervals.length;

    // Convert to beats per minute (60 seconds * 1000 ms / average interval)
    const bpm = Math.round((60 * 1000) / averageInterval);

    return Math.min(Math.max(bpm, 40), 200); // Clamp between 40-200 BPM
  };

  // Handle button tap
  const handleTap = () => {
    const currentTime = Date.now();
    const newTaps = [...taps, currentTime];

    setTaps(newTaps);
    setLastTapTime(currentTime);
    setIsActive(true);

    // Calculate heart rate
    const newHeartRate = calculateHeartRate(newTaps);
    setHeartRate(newHeartRate);

    // Reset animation
    if (buttonRef.current) {
      buttonRef.current.style.transform = "scale(1.1)";
      setTimeout(() => {
        if (buttonRef.current) {
          buttonRef.current.style.transform = "scale(1)";
        }
      }, 150);
    }
  };

  // Reset function
  const handleReset = () => {
    setTaps([]);
    setHeartRate(0);
    setIsActive(false);
    setLastTapTime(null);
    setAnimationPosition(0);
  };

  // Auto-update heart rate display when taps are recent
  useEffect(() => {
    if (lastTapTime && isActive) {
      const interval = setInterval(() => {
        const timeSinceLastTap = Date.now() - lastTapTime;
        if (timeSinceLastTap > 5000) {
          // 5 seconds timeout
          setIsActive(false);
          clearInterval(interval);
        }
      }, 100);

      return () => clearInterval(interval);
    }
  }, [lastTapTime, isActive]);

  // Moving line animation
  useEffect(() => {
    if (isActive) {
      const animate = () => {
        setAnimationPosition((prev) => (prev + 2) % 1000);
        animationRef.current = requestAnimationFrame(animate);
      };
      animate();

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } else {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    }
  }, [isActive]);

  // Generate heartbeat pattern visualization
  const generateHeartbeatPattern = () => {
    if (taps.length === 0) return [];

    const pattern = [];
    const maxWidth = 800; // SVG width
    const baseY = 50; // Base line position

    // Calculate time span
    const firstTap = taps[0];
    const lastTap = taps[taps.length - 1];
    const totalTime = lastTap - firstTap;

    if (totalTime === 0) return [];

    // Position each tap
    taps.forEach((tap, index) => {
      const relativeTime = tap - firstTap;
      const x = (relativeTime / totalTime) * maxWidth;

      pattern.push({
        type: "peak",
        x: x,
        y: baseY - 20, // Peak height
        timestamp: tap,
      });

      // Add connecting line to next tap (except for last tap)
      if (index < taps.length - 1) {
        const nextTap = taps[index + 1];
        const nextRelativeTime = nextTap - firstTap;
        const nextX = (nextRelativeTime / totalTime) * maxWidth;

        pattern.push({
          type: "line",
          x1: x,
          y1: baseY,
          x2: nextX,
          y2: baseY,
          timestamp: tap,
        });
      }
    });

    return pattern;
  };

  const heartbeatPattern = generateHeartbeatPattern();

  // Get status message based on heart rate
  const getStatusMessage = (bpm) => {
    if (bpm === 0) return "Tap the button to start measuring";
    if (bpm < 60) return "Resting heart rate";
    if (bpm < 100) return "Normal heart rate";
    if (bpm < 120) return "Light activity";
    return "High activity";
  };

  // Get status color based on heart rate
  const getStatusColor = (bpm) => {
    if (bpm === 0) return "text-gray-500";
    if (bpm < 60) return "text-blue-500";
    if (bpm < 100) return "text-green-500";
    if (bpm < 120) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-red-50 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            Heart Rate Monitor
          </h1>
          <p className="text-gray-600">
            Tap the button to the rhythm of your heartbeat
          </p>
        </div>

        {/* Main Heart Rate Display */}
        <div className="text-center mb-8">
          <div className="inline-block relative">
            <div className="text-8xl font-bold text-red-500 mb-4">
              {heartRate || "--"}
            </div>
            <div className="text-xl text-gray-600 mb-4">BPM</div>
            <div className={`text-lg font-medium ${getStatusColor(heartRate)}`}>
              {getStatusMessage(heartRate)}
            </div>
          </div>
        </div>

        {/* Tap Button */}
        <div className="flex justify-center mb-8">
          <button
            ref={buttonRef}
            onClick={handleTap}
            className={`
              w-48 h-48 rounded-full transition-all duration-150 ease-in-out
              ${
                isActive
                  ? "bg-red-500 shadow-2xl shadow-red-500/50"
                  : "bg-red-400 hover:bg-red-500 shadow-xl shadow-red-400/30"
              }
              transform active:scale-95
              flex items-center justify-center
            `}
            style={{
              background: isActive
                ? "radial-gradient(circle, #ef4444 0%, #dc2626 100%)"
                : "radial-gradient(circle, #f87171 0%, #ef4444 100%)",
            }}
          >
            <div className="text-white text-center">
              <div className="text-4xl mb-2">❤️</div>
              <div className="text-lg font-semibold">TAP</div>
              <div className="text-sm opacity-90">Heart Beat</div>
            </div>
          </button>
        </div>

        {/* Tap Counter */}
        <div className="text-center mb-6">
          <div className="text-2xl font-semibold text-gray-700">
            Taps: {taps.length}
          </div>
          {taps.length >= 2 && (
            <div className="text-sm text-gray-500 mt-1">
              Keep tapping for more accurate reading
            </div>
          )}
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mb-8">
          <button
            onClick={handleReset}
            className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-colors duration-200"
          >
            Reset
          </button>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-lg p-6 mb-8 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            How to use:
          </h3>
          <ul className="space-y-2 text-gray-600">
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              Place your finger on your pulse point (wrist or neck)
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              Tap the red button each time you feel your heartbeat
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              The app will calculate your heart rate after 2+ taps
            </li>
            <li className="flex items-start">
              <span className="text-red-500 mr-2">•</span>
              More taps provide more accurate readings
            </li>
          </ul>
        </div>

        {/* Heartbeat Pattern Visualization */}
        {taps.length > 0 && (
          <div className="bg-white rounded-lg p-6 shadow-lg">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Heartbeat Pattern
            </h3>
            <div className="relative">
              <svg
                width="100%"
                height="100"
                viewBox="0 0 800 100"
                className="border rounded-lg bg-gray-50"
                ref={heartbeatRef}
              >
                {/* Base line */}
                <line
                  x1="0"
                  y1="50"
                  x2="800"
                  y2="50"
                  stroke="#e5e7eb"
                  strokeWidth="2"
                />

                {/* Heartbeat pattern */}
                {heartbeatPattern.map((element, index) => {
                  if (element.type === "peak") {
                    return (
                      <g key={`peak-${index}`}>
                        {/* Peak triangle */}
                        <polygon
                          points={`${element.x},${element.y + 20} ${
                            element.x - 8
                          },${element.y + 20} ${element.x},${element.y} ${
                            element.x + 8
                          },${element.y + 20}`}
                          fill="#ef4444"
                          stroke="#dc2626"
                          strokeWidth="1"
                        />
                        {/* Peak line */}
                        <line
                          x1={element.x}
                          y1={element.y + 20}
                          x2={element.x}
                          y2="50"
                          stroke="#ef4444"
                          strokeWidth="2"
                        />
                      </g>
                    );
                  } else if (element.type === "line") {
                    return (
                      <line
                        key={`line-${index}`}
                        x1={element.x1}
                        y1={element.y1}
                        x2={element.x2}
                        y2={element.y2}
                        stroke="#ef4444"
                        strokeWidth="2"
                      />
                    );
                  }
                  return null;
                })}

                {/* Moving line indicator */}
                {isActive && (
                  <line
                    x1={animationPosition}
                    y1="40"
                    x2={animationPosition}
                    y2="60"
                    stroke="#3b82f6"
                    strokeWidth="3"
                    opacity="0.7"
                  >
                    <animate
                      attributeName="x1"
                      values={`${animationPosition};${
                        animationPosition + 50
                      };${animationPosition}`}
                      dur="1s"
                      repeatCount="indefinite"
                    />
                    <animate
                      attributeName="x2"
                      values={`${animationPosition};${
                        animationPosition + 50
                      };${animationPosition}`}
                      dur="1s"
                      repeatCount="indefinite"
                    />
                  </line>
                )}
              </svg>

              {/* Pattern description */}
              <div className="mt-4 text-sm text-gray-600">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 bg-red-500 transform rotate-45"></div>
                    <span>Heartbeat peaks (^)</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-0.5 bg-red-500"></div>
                    <span>Time intervals</span>
                  </div>
                  {isActive && (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 bg-blue-500"></div>
                      <span>Moving indicator</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Heart Rate Zones */}
        <div className="mt-8 bg-white rounded-lg p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Heart Rate Zones
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center p-3 bg-blue-50 rounded-lg">
              <div className="w-4 h-4 bg-blue-500 rounded-full mr-3"></div>
              <div>
                <div className="font-semibold text-blue-700">
                  Resting (40-59 BPM)
                </div>
                <div className="text-sm text-blue-600">Relaxed, sleeping</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-green-50 rounded-lg">
              <div className="w-4 h-4 bg-green-500 rounded-full mr-3"></div>
              <div>
                <div className="font-semibold text-green-700">
                  Normal (60-99 BPM)
                </div>
                <div className="text-sm text-green-600">Resting, relaxed</div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-yellow-50 rounded-lg">
              <div className="w-4 h-4 bg-yellow-500 rounded-full mr-3"></div>
              <div>
                <div className="font-semibold text-yellow-700">
                  Light Activity (100-119 BPM)
                </div>
                <div className="text-sm text-yellow-600">
                  Walking, light exercise
                </div>
              </div>
            </div>
            <div className="flex items-center p-3 bg-red-50 rounded-lg">
              <div className="w-4 h-4 bg-red-500 rounded-full mr-3"></div>
              <div>
                <div className="font-semibold text-red-700">
                  High Activity (120+ BPM)
                </div>
                <div className="text-sm text-red-600">Exercise, stress</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HeartBeat;
