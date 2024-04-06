import React, { useEffect, useRef, useState } from "react";
import FetchTransactionHistory from "./FetchedTransactionHistory";
import "./MasterPOSLayout.css";

const MasterPOSLayout = ({ slides }) => {
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
  const masterPOSTransactions = transactionHistory.filter(
    (transaction) =>
      transaction.customer_id === "uc12" && // Replace "your_customer_id" with the actual customer ID
      transaction.accountType === "Master_POS" &&
      transaction.business_id === "ubmc123"
  );

  const getMasterPOSOptions = (transactions) => {
    const uniqueMasterPOSMap = new Map();
    transactions.forEach((transaction) => {
      const { accountNumber, serialNumber, balance } = transaction;
      if (
        transaction.accountType === "Master_POS" &&
        !uniqueMasterPOSMap.has(accountNumber)
      ) {
        uniqueMasterPOSMap.set(accountNumber, { serialNumber, balance });
      }
    });

    const options = [];
    uniqueMasterPOSMap.forEach((data, accountNumber) => {
      const { serialNumber, balance } = data;
      options.push({
        label: (
          <div style={{ width: "130px", height: "80px", marginLeft: "10px" }}>
            <div style={{ marginTop: "20px" }}>
              Master-POS: NAIRA <br />
            </div>
            <div style={{ marginTop: "20px", backgroundColor: "transparent" }}>
              <span style={{ fontSize: "15px" }}>
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
            <button style={{ borderRadius: "20px" }}>
              {" "}
              Account: Number {accountNumber}
            </button>
            <span style={{ fontSize: "11px" }}> S/N: {serialNumber}</span>
          </div>
        ),
        value: accountNumber,
      });
    });
    return options;
  };

  // Create options for each account type
  const masterPOSOptions = getMasterPOSOptions(masterPOSTransactions);

  const slideCount = masterPOSOptions.length;

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
      className="slider-container1"
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={() => setStartIndex(null)}
    >
      <div
        className="slider1"
        ref={sliderRef}
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {masterPOSOptions.map((option, index) => (
          <ul
            className={`slide1 ${selected === index ? "selected1" : ""}`}
            onClick={() => handleSlideClick(index)}
            key={option.index}
          >
            <li key={option.value}>
              <input
                style={{ marginTop: "9px", marginLeft: "15px" }}
                type="checkbox"
                checked={showBalance}
                onChange={handleToggleBalance}
              />{" "}
              <span style={{ fontSize: "10px" }}>Show Balance</span>
              {option.label}
            </li>
          </ul>
        ))}
      </div>
      <button className="prev1 button" onClick={prevSlide}>
        Prev
      </button>
      <button className="next1 button" onClick={nextSlide}>
        Next
      </button>
      <div className="indicators1">
        {masterPOSOptions.map((option, index) => (
          <div
            key={option.index}
            className={`dot1 ${index === currentIndex ? "active1" : ""} ${
              selected === index ? "selected1" : ""
            }`}
            onClick={() => setCurrentIndex(index)}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default MasterPOSLayout;
