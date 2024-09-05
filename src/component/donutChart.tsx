"use client"

// import React, { useRef, useEffect } from "react";

// const DonutChart = ({ data, colors }) => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");
//     const width = canvas.width;
//     const height = canvas.height;
//     const radius = Math.min(width, height) / 2;
//     const total = data.reduce((acc, val) => acc + val, 0);

//     context.clearRect(0, 0, width, height);

//     context.translate(width / 2, height / 2);

//     const drawSegment = (startAngle, endAngle, color) => {
//       context.beginPath();
//       context.arc(0, 0, radius, startAngle, endAngle);
//       context.lineTo(0, 0);
//       context.closePath();
//       context.fillStyle = color;
//       context.fill();
//     };

//     let startAngle = 0;
//     data.forEach((value, index) => {
//       const endAngle = startAngle + (value / total) * 2 * Math.PI;
//       drawSegment(startAngle, endAngle, colors[index]);
//       startAngle = endAngle;
//     });

//     // Draw inner circle to create the donut effect
//     context.beginPath();
//     context.arc(0, 0, radius * 0.6, 0, 2 * Math.PI);
//     context.closePath();
//     context.globalCompositeOperation = "destination-out";
//     context.fill();
//     context.globalCompositeOperation = "source-over";
//   }, [data, colors]);

//   return <canvas ref={canvasRef} width={400} height={400} />;
// };

// export default DonutChart;

// import React, { useState } from "react";

// const DonutChart = ({ data, colors, strokeWidth = 50 }) => {
//   const radius = 100 - strokeWidth / 2; // Adjust radius for stroke width
//   const circumference = 2 * Math.PI * radius;
//   const total = data.reduce((acc, val) => acc + val, 0);

//   const [hoveredIndex, setHoveredIndex] = useState(null);
//   const [tooltipContent, setTooltipContent] = useState("");
//   const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

//   let startAngle = 0;

//   const calculateArc = (value) => {
//     const endAngle = startAngle + (value / total) * 2 * Math.PI;
//     const largeArcFlag = endAngle - startAngle > Math.PI ? 1 : 0;

//     const x1 = radius * Math.cos(startAngle - Math.PI / 2);
//     const y1 = radius * Math.sin(startAngle - Math.PI / 2);
//     const x2 = radius * Math.cos(endAngle - Math.PI / 2);
//     const y2 = radius * Math.sin(endAngle - Math.PI / 2);

//     const path = [
//       `M ${x1} ${y1}`,
//       `A ${radius} ${radius} 0 ${largeArcFlag} 1 ${x2} ${y2}`,
//       `L 0 0`,
//       `Z`,
//     ].join(" ");

//     startAngle = endAngle;

//     return path;
//   };

//   const handleMouseEnter = (index, event) => {
//     setHoveredIndex(index);
//     setTooltipContent(`Value: ${data[index]}`);
//     setTooltipPosition({ x: event.clientX, y: event.clientY });
//   };

//   const handleMouseLeave = () => {
//     setHoveredIndex(null);
//     setTooltipContent("");
//   };

//   return (
//     <div style={{ position: "relative" }}>
//       <svg width="200" height="200" viewBox="-100 -100 200 200">
//         {data.map((value, index) => (
//           <path
//             key={index}
//             d={calculateArc(value)}
//             fill={colors[index]}
//             stroke={hoveredIndex === index ? "black" : "none"}
//             strokeWidth={hoveredIndex === index ? 2 : 0}
//             onMouseEnter={(e) => handleMouseEnter(index, e)}
//             onMouseLeave={handleMouseLeave}
//           />
//         ))}
//         <circle cx="0" cy="0" r={radius - strokeWidth / 2} fill="white" />
//       </svg>
//       {tooltipContent && (
//         <div
//           style={{
//             position: "absolute",
//             left: tooltipPosition.x - 70,
//             top: tooltipPosition.y - 40,
//             backgroundColor: "rgba(0, 0, 0, 0.75)",
//             color: "white",
//             padding: "5px 10px",
//             borderRadius: "4px",
//             pointerEvents: "none",
//           }}
//         >
//           {tooltipContent}
//         </div>
//       )}
//     </div>
//   );
// };

// export default DonutChart;
import React, { useEffect, useRef, useState } from "react";

const DonutChart = ({
  data,
  size = 300,
  innerRadius = 60,
  outerRadius = 100,
  paddingAngle = 1,
}) => {
  const canvasRef = useRef(null);
  const [hoveredData, setHoveredData] = useState(null);
  const total = data.reduce((acc: any, item: { value: any; }) => acc + item.value, 0);

  // Convert degrees to radians
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;

  // Function to draw the chart
  const drawChart = () => {
    const ctx = canvasRef?.current?.getContext("2d");
    const centerX = size / 2;
    const centerY = size / 2;
    let startAngle = 0;
    const paddingRadians = toRadians(paddingAngle); // Convert padding angle to radians

    // Clear the canvas
    ctx.clearRect(0, 0, size, size);

    data.forEach((item: { value: number; color: string; }) => {
      const valuePercentage = item.value / total;
      const sliceAngle = valuePercentage * (2 * Math.PI) - paddingRadians;
      const endAngle = startAngle + sliceAngle;

      // Draw the arc
      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      // Set the color
      ctx.fillStyle = item.color;
      ctx.fill();

      startAngle = endAngle + paddingRadians; // Add padding angle in radians
    });
  };

  // Handle mouse move event for tooltips
  const handleMouseMove = (e: { clientX: number; clientY: number; }) => {
    const ctx = canvasRef?.current?.getContext("2d");
    const rect = canvasRef?.current?.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = size / 2;
    const centerY = size / 2;
    const distanceFromCenter = Math.sqrt(
      (x - centerX) ** 2 + (y - centerY) ** 2
    );
    let startAngle = 0;
    const paddingRadians = toRadians(paddingAngle);

    // Reset hovered data
    setHoveredData(null);

    // Check which segment is being hovered over
    data.forEach((item: { value: number; label: unknown; }, index: unknown) => {
      const valuePercentage = item.value / total;
      const sliceAngle = valuePercentage * (2 * Math.PI) - paddingRadians;
      const endAngle = startAngle + sliceAngle;

      ctx.beginPath();
      ctx.arc(centerX, centerY, outerRadius, startAngle, endAngle);
      ctx.arc(centerX, centerY, innerRadius, endAngle, startAngle, true);
      ctx.closePath();

      // Check if the mouse is inside the arc
      if (
        ctx.isPointInPath(x, y) &&
        distanceFromCenter <= outerRadius &&
        distanceFromCenter >= innerRadius
      ) {
        // Calculate the midpoint angle of the slice
        const midAngle = startAngle + sliceAngle / 2;
        // Calculate the position of the tooltip (use a slightly larger radius for better placement)
        const tooltipRadius = (outerRadius + innerRadius) / 2;
        const tooltipX = centerX + tooltipRadius * Math.cos(midAngle);
        const tooltipY = centerY + tooltipRadius * Math.sin(midAngle);

        // Set the tooltip data including the position
        setHoveredData({
          index,
          label: item.label,
          value: ((item.value / total) * 100).toFixed(2) + "%",
          x: tooltipX,
          y: tooltipY,
        });
      }

      startAngle = endAngle + paddingRadians;
    });
  };

  useEffect(() => {
    drawChart();
  }, [data, size, innerRadius, outerRadius, paddingAngle]);

  return (
    <div style={{ textAlign: "center", position: "relative" }}>
      <canvas
        ref={canvasRef}
        width={size}
        height={size}
        onMouseMove={handleMouseMove}
        style={{ display: "block", margin: "0 auto" }}
      />
      {hoveredData && (
        <div
          style={{
            position: "absolute",
            left: `${hoveredData?.x}px`, // Add some offset for better readability
            top: `${hoveredData?.y}px`,
            backgroundColor: "white",
            padding: "5px",
            border: "1px solid black",
            pointerEvents: "none",
          }}
        >
          {hoveredData?.label}: {hoveredData?.value}
        </div>
      )}
    </div>
  );
};
export default DonutChart;
