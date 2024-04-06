import React, { useEffect, useRef, useState } from "react";
import FetchTransactionHistory from "./FetchedTransactionHistory";
import "./SavingsLayout.css";

const SavingsLayout = ({ slides }) => {
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

  const savingsTransactions = transactionHistory.filter(
    (transaction) =>
      transaction.customer_id === "uc12" && // Replace "your_customer_id" with the actual customer ID
      transaction.accountType === "Savings"
  );
  const getSavingsOptions = (transactions) => {
    const uniqueSavingsMap = new Map();
    transactions.forEach((transaction) => {
      const { accountNumber, balance } = transaction;
      if (
        transaction.accountType === "Savings" &&
        !uniqueSavingsMap.has(accountNumber)
      ) {
        uniqueSavingsMap.set(accountNumber, { balance });
      }
    });

    const options = [];
    uniqueSavingsMap.forEach((data, accountNumber) => {
      const { balance } = data;
      options.push({
        label: (
          <div
            style={{
              width: "130px",
              height: "100px",
              marginLeft: "10px",
            }}
          >
            <div style={{ marginTop: "20px" }}>
              Savings: NAIRA <br />
            </div>
            <div style={{ marginTop: "20px", backgroundColor: "transparent" }}>
              <span style={{ fontSize: "15px" }}>
                {" "}
                {showBalance && (
                  <p style={{ marginTop: "20px" }}>
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

                fontSize: "12px",
                marginTop: "30px",
                height: "40px",
                width: "130px",
                marginLeft: "10px",
              }}
            >
              {" "}
              {showBalance ? "Account Number" : ""}{" "}
              {showBalance ? accountNumber : ""}
            </button>
          </div>
        ),
        value: accountNumber,
      });
    });
    return options;
  };

  const savingsOptions = getSavingsOptions(savingsTransactions);
  const slideCount = savingsOptions.length;

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
      className="slider-container-saving"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setStartIndex(null)}
    >
      <div
        className="slider-saving"
        ref={sliderRef}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {savingsOptions.map((option, index) => (
          <ul
            className={`slide-saving ${
              selected === index ? "selected-saving" : ""
            }`}
            onClick={() => handleSlideClick(index)}
            key={option.index}
          >
            <li key={option.value}>
              <input
                style={{
                  marginTop: "9px",
                  cursor: "pointer",
                  marginLeft: "15px",
                }}
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
      <button className="prev-saving button-saving" onClick={prevSlide}>
        Prev
      </button>
      <button className="next-saving button-saving" onClick={nextSlide}>
        Next
      </button>
      <div className="indicators-saving">
        {savingsOptions.map((option, index) => (
          <div
            key={option.index}
            className={`dot-saving ${
              index === currentIndex ? "active-saving" : ""
            } ${selected === index ? "selected-saving" : ""}`}
            onClick={() => setCurrentIndex(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default SavingsLayout;
