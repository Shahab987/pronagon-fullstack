import React from "react";

function BarChart({ data = [100, 80, 50, 60, 35, 10, 15, 90] }) {
  const max = Math.max(...data);

  return (
    <div
      className="bar-chart"
      style={{
        display: "flex",
        height: "300px",
        width: "400px",
        alignItems: "flex-end",
      }}
    >
      {data.map((value, index) => {
        let a = Math.floor((value / max) * 100);
        let color = Math.floor(a / 20) * 2;
        return (
          <div
            key={index}
            className="bar"
            style={{
              height: `${a}%`,
              width: "10px",
              backgroundColor: `#${color}${color}${color}`,
              transition: "0.5s",
            }}
          >
            {a}
          </div>
        );
      })}
    </div>
  );
}

export default BarChart;
