import React, { useEffect, useState } from "react";
import image1 from "../Assets/image1.jpg";
import image2 from "../Assets/image2.jpg";
import image3 from "../Assets/image3.jpg";
import image4 from "../Assets/image4.jpg";
import image5 from "../Assets/image5.jpg";
import image6 from "../Assets/image6.jpg";
import "./contents.css";

function Contents() {
  console.log("Contents");
  const [currentIndex, setCurrentIndex] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % 6);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="slider3-container3">
      <div
        className="slider3"
        style={{ transform: `translateX(${-currentIndex * 100}%)` }}
      >
        <div
          className="slide3"
          style={{ backgroundColor: "rgba(100, 251, 171, 1)" }}
        >
          <img
            src={image6}
            alt="banker"
            style={{
              display: "flex",
              overflow: "hidden",
              height: "100%",
              width: "100%",
            }}
          />
        </div>
        <div
          className="slide"
          style={{ backgroundColor: "rgba(231, 37, 37, 1)" }}
        >
          <img
            src={image2}
            alt="banker"
            style={{
              display: "flex",
              overflow: "hidden",
              height: "100%",
              width: "100%",
            }}
          />
        </div>
        <div className="slide3" style={{ backgroundColor: "red" }}>
          <img
            src={image5}
            alt="banker"
            style={{
              display: "flex",
              overflow: "hidden",
              height: "100%",
              width: "100%",
            }}
          />
        </div>
        <div className="slide3" style={{ backgroundColor: "black" }}>
          <img
            src={image1}
            alt="banker"
            style={{
              display: "flex",
              overflow: "hidden",
              height: "100%",
              width: "100%",
            }}
          />
        </div>
        <div className="slide3" style={{ backgroundColor: "orange" }}>
          <img
            src={image3}
            alt="banker"
            style={{
              display: "flex",
              overflow: "hidden",
              height: "100%",
              width: "100%",
            }}
          />
        </div>
        <div className="slide3" style={{ backgroundColor: "white" }}>
          <img
            src={image4}
            alt="banker"
            style={{
              display: "flex",
              overflow: "hidden",
              height: "100%",
              width: "100%",
            }}
          />
        </div>
      </div>

      <div
        className="ind"
        style={{ height: "20px", backgroundColor: "rgba(246, 216, 216, 0.92)" }}
      >
        <div className="indicator3">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="indicator3-dot3"
              style={{ backgroundColor: i === currentIndex ? "red" : "gray" }}
            ></div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Contents;
