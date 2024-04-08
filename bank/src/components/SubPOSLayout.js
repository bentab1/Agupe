import React, { useEffect, useRef, useState } from "react";
import FetchTransactionHistory from "./FetchedTransactionHistory";
import "./SubPOSLayout.css";

const SubPOSLayout = ({ slides }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [startIndex, setStartIndex] = useState(null);
  const sliderRef = useRef(null);
  const [showBalance, setShowBalance] = useState(false);
  const [transactionHistory, setTransactionHistory] = useState([]);
  //////
  ///////
  const CURRENCY_SYMBOL = "₦";
  ////
  useEffect(() => {
    // Fetch transaction history when the component mounts
    const fetchData = async () => {
      const transactionData = FetchTransactionHistory();
      setTransactionHistory(transactionData);
    };
    fetchData();
  }, []);

  const handleToggleBalance = () => {
    setShowBalance(!showBalance);
  };

  // Filter transactions for each account type
  const subPOSTransactions = transactionHistory.filter(
    (transaction) =>
      transaction.customer_id === "uc12" && // Replace "your_customer_id" with the actual customer ID
      transaction.accountType === "Sub_POS" &&
      transaction.business_id === "ubmc123"
  );

  const getSubPOSOptions = (transactions) => {
    const uniqueSubPOSMap = new Map();
    transactions.forEach((transaction) => {
      const { accountNumber, serialNumber, balance } = transaction;
      if (!uniqueSubPOSMap.has(accountNumber)) {
        uniqueSubPOSMap.set(accountNumber, { serialNumber, balance });
      }
    });

    const options = [];
    uniqueSubPOSMap.forEach((data, accountNumber) => {
      const { serialNumber, balance } = data;
      options.push({
        label: (
          <div style={{ width: "130px", height: "80px", marginLeft: "10px" }}>
            <div style={{ marginTop: "10px" }}>
              Sub-POS: NAIRA <br />
            </div>
            <div style={{ marginTop: "10px", backgroundColor: "transparent" }}>
              <span style={{ fontSize: "13px" }}>
                {" "}
                {showBalance && (
                  <p>
                    {" "}
                    {CURRENCY_SYMBOL}
                    {parseFloat(balance).toLocaleString("en")}
                  </p>
                )}
              </span>
            </div>
            <button
              style={{
                borderRadius: "20px",
                backgroundColor: showBalance ? "royalblue" : "transparent",
                fontSize: "12px",
                marginTop: "80px",
                marginLeft: "4px",
                height: "40px",
              }}
            >
              {" "}
              {showBalance ? "Account Number" : ""}{" "}
              {showBalance ? accountNumber : ""}
            </button>
            <p style={{ fontSize: "11px", marginTop: "15px" }}>
              {" "}
              S/N: {serialNumber}
            </p>
          </div>
        ),
        value: accountNumber,
      });
    });
    return options;
  };

  const subPOSOptions = getSubPOSOptions(subPOSTransactions);
  const slideCount = subPOSOptions.length;

  const nextSlide = () => {
    if (currentIndex === slideCount - 1) {
      setCurrentIndex(0);
    } else {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const prevSlide = () => {
    if (currentIndex === 0) {
      setCurrentIndex(slideCount - 1);
    } else {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleTouchStart = (e) => {
    setStartIndex(e.touches[0].clientX);
  };

  const handleTouchMove = (e) => {
    if (startIndex === null) return;
    const currentIndex = e.touches[0].clientX;
    if (Math.abs(startIndex - currentIndex) > 50) {
      if (currentIndex < startIndex) {
        nextSlide();
      } else {
        prevSlide();
      }
      setStartIndex(null);
    }
  };

  const handleSlideClick = (index) => {
    setSelected(index);
    setCurrentIndex(index);
  };

  return (
    <div
      className="slider-container-subPos"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setStartIndex(null)}
    >
      <div
        className="slider-subPos"
        ref={sliderRef}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {subPOSOptions.map((option, index) => (
          <ul
            className={`slide-subPos ${
              selected === index ? "selected-subPos" : ""
            }`}
            onClick={() => handleSlideClick(index)}
            key={option.index}
          >
            <li
              key={option.value}
              style={{
                position: "absolute",
                cursor: "pointer",
                marginLeft: "10px",
              }}
            >
              <input
                style={{ marginTop: "9px", marginLeft: "15px" }}
                type="checkbox"
                checked={showBalance}
                onChange={handleToggleBalance}
              />{" "}
              <span style={{ fontSize: "12px" }}>
                {showBalance ? "Hide Balance" : "Show Balance"}
              </span>
              {option.label}
            </li>
          </ul>
        ))}
      </div>
      <button className="prev-subPos button-subPos" onClick={prevSlide}>
        Prev
      </button>
      <button className="next-subPos button-subPos" onClick={nextSlide}>
        Next
      </button>
      <div className="indicators-subPos">
        {subPOSOptions.map((option, index) => (
          <div
            key={option.index}
            className={`dot-subPos ${
              index === currentIndex ? "active-subPos" : ""
            } ${selected === index ? "selected-subPos" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default SubPOSLayout;