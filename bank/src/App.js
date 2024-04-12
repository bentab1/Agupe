import { React, useEffect, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import "./App.css";
import AboutUs from "./components/AboutUs/AboutUs";
import AdMoneyMethod from "./components/AdMoneyMethod/AdMoneyMethod";
import AddMoneyBankMenu from "./components/AddMoneyBankMenu/AddMoneyBankMenu";
import AgupePay from "./components/AgupePay/AgupePay";
import Banking from "./components/Banking/Banking";
import Business from "./components/Business/Business";
import BusinessAccount from "./components/BusinessAccount/BusinessAccount";
import ContactUs from "./components/ContactUs/ContactUs";
import UnsupportedCountrySelectionMessage from "./components/CountrySelectionSelected/UnsupportedCountrySelected";
import Features from "./components/Features/Features";
import fetchFetchCustomerHistory from "./components/FetchCustomerHistory.js";
import FetchMasterPOSAcoountHistory from "./components/FetchMasterPOSAcoountHistory.js";
import FetchSavingsAccountHistory from "./components/FetchSavingsAccountHistory.js";
import {
  default as FetchBusinessAccountHistory,
  default as FetchSubPOSAccountHistory,
} from "./components/FetchSubPOSAccountHistory.js";
import fetchTransactionHistory from "./components/FetchedTransactionHistory.js";
import Filtered from "./components/FinalWork/MainAccounts/MainAccounts.js";
import Footer from "./components/Footer/Footer";
import Header from "./components/Header/Header";
import Help from "./components/Help/Help";
import LiveChat from "./components/LiveChat/LiveChat";
import LoginPage from "./components/Login/LoginPage";
import Menu from "./components/Menu/Menu";
import NavBar from "./components/NavBar/NavBar";
import Notification from "./components/Notification/Notification";
import PageNotFound from "./components/PageNotFound.js";
import Personal from "./components/Personal/Personal";
import PersonalAccount from "./components/PersonalAccount/PersonalAccount";
import Review from "./components/Review/Review";
import SignUpRedirect from "./components/SignUpRedirect/SignUpRedirect";
import Welcome from "./components/Welcome/Welcome";
import SubPOSFiltered from "./components/FinalWork/SubPOSFiltered/SubPOSFiltered.js";

function groupTransactionsByMonth(transactions) {
  const groupedTransactions = {};
  transactions.forEach((transaction) => {
    const date = new Date(transaction.date);
    const monthYear = `${date.toLocaleString("en-US", {
      month: "long",
    })} ${date.getFullYear()}`;
    if (!groupedTransactions[monthYear]) {
      groupedTransactions[monthYear] = [];
    }
    groupedTransactions[monthYear].push(transaction);
  });
  return groupedTransactions;
}

export default function App() {
  const [activeButton, setActiveButton] = useState(null);
  const [transactionHistory, setTransactionHistory] = useState([]);
  const [customerHistory, setCustomerHistory] = useState([]);
  const [savingsAccountHistory, setSavingsAccountHistory] = useState([]);
  const [businessAccountHistory, setBusinessAccountHistory] = useState([]);
  const [masterPOSAccountHistory, setMasterPOSAccountHistory] = useState([]);
  const [subPOSAccountHistory, setSubPOSAccountHistory] = useState([]);
  const [uniqueAccountTypes, setUniqueAccountTypes] = useState([]);
  const [allAccounts, setAllAccounts] = useState([]);
  const [groupedTransactions, setGroupedTransactions] = useState({});
  const [showTransactions, setShowTransactions] = useState(false);
  const [options, setOptions] = useState([]);
  const [options2, setOptions2] = useState([]);
  const [selected, setSelected] = useState(0);
  const [showBalance, setShowBalance] = useState(false);
  const [error, setError] = useState("");
  const authenticatedCustomerId = "uc12";
  const CURRENCY_SYMBOL = "₦";
  const handleClick = (buttonId) => {
    setActiveButton(buttonId);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch transaction history for the authenticated customer
        const transactionData = fetchTransactionHistory();

        // Fetch customer data for the authenticated customer
        const customerData = fetchFetchCustomerHistory();

        // Fetch savings account history for the authenticated customer
        const savingsAccountData = FetchSavingsAccountHistory();

        // Fetch business account history for the authenticated customer
        const businessAccountData = FetchBusinessAccountHistory();

        // Fetch Master POS account history for the authenticated customer
        const masterPOSAccountData = FetchMasterPOSAcoountHistory();

        // Fetch Sub POS account history for the authenticated customer
        const subPOSAccountData = FetchSubPOSAccountHistory();

        const authenticatedTransactionData = transactionData.filter(
          (data) => data.customer_id === authenticatedCustomerId
        );

        // Filter each data array to include only entries relevant to the authenticated customer
        const authenticatedCustomerData = customerData.filter(
          (data) => data.customer_id === authenticatedCustomerId
        );

        const authenticatedSavingsAccountData = savingsAccountData.filter(
          (savingsdata) => savingsdata.customer_id === authenticatedCustomerId
        );

        const authenticatedCustomerBusinessAccountData =
          businessAccountData.filter(
            (data) => data.customer_id === authenticatedCustomerId
          );

        const authenticatedCustomerMasterPOSAccountData =
          masterPOSAccountData.filter(
            (data) => data.customer_id === authenticatedCustomerId
          );

        const authenticatedCustomerSubPOSAccountData = subPOSAccountData.filter(
          (data) => data.customer_id === authenticatedCustomerId
        );

        // Merge all authenticated customer account histories into one array
        const allAccounts = [
          ...authenticatedSavingsAccountData.map((account) => ({
            accountType: "Savings",
            accountNumber: account.accountNumber,
            balance: account.balance,
          })),
          ...authenticatedCustomerBusinessAccountData.map((account) => ({
            accountType: "Business",
            accountNumber: account.accountNumber,
            balance: account.balance,
          })),
          ...authenticatedCustomerMasterPOSAccountData.map((account) => ({
            accountType: "Master_POS",
            accountNumber: account.accountNumber,
            balance: account.balance,
          })),
          ...authenticatedCustomerSubPOSAccountData.map((account) => ({
            accountType: "Sub_POS",
            accountNumber: account.accountNumber,
            balance: account.balance,
          })),
        ];

        // Convert the Set back to an array
        const uniqueAccountTypes = Array.from(
          new Set(allAccounts.map((account) => account.accountType))
        );

        // Set transaction history for the authenticated customer
        setTransactionHistory(authenticatedTransactionData);
        setUniqueAccountTypes(uniqueAccountTypes);
        setAllAccounts(allAccounts);
        // Set each account history individually for the authenticated customer
        setCustomerHistory(authenticatedCustomerData);
        setSavingsAccountHistory(authenticatedSavingsAccountData);
        setBusinessAccountHistory(authenticatedCustomerBusinessAccountData);
        setMasterPOSAccountHistory(authenticatedCustomerMasterPOSAccountData);
        setSubPOSAccountHistory(authenticatedCustomerSubPOSAccountData);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    // Filter accounts for each account type
    const getOptions = (accounts) => {
      const uniqueMap = new Map();
      accounts.forEach((account) => {
        const { accountType, balance, accountNumber } = account; // Corrected line
        let updatedAccountType = accountType;

        if (account.customer_id && !account.business_id) {
          updatedAccountType = "Savings";
        } else if (
          account.accountType === "Business" &&
          account.customer_id &&
          (!account.master_POS_id || !account.sub_POS_id)
        ) {
          updatedAccountType = "Business";
        } else if (
          account.accountType === "Master_POS" &&
          account.business_id &&
          account.master_POS_id
        ) {
          updatedAccountType = "Master_POS";
        }

        if (
          accountType === "Savings" ||
          accountType === "Business" ||
          accountType === "Master_POS"
        ) {
          // Only map unique Sub_POS accounts based on their account numbers
          if (!uniqueMap.has(accountType)) {
            uniqueMap.set(accountType, {
              balance,
              accountNumber,
              accountType: updatedAccountType,
            });
          }
        }
      });
      const options = [];
      uniqueMap.forEach((data, accountType) => {
        const { balance } = data;
        options.push({
          label: (
            <div
              className="Label-option-push-container"
              style={{
                backgroundColor:
                  accountType === "Business"
                    ? "wheat"
                    : accountType === "Savings"
                    ? "lightblue"
                    : accountType === "Master_POS"
                    ? "lightgray"
                    : "lightgray",
              }}
            >
              <p className="naira-paragraph-option"> {accountType}: NAIRA</p>

              {showBalance ? (
                <p className="Label-business-option-balance">
                  {" "}
                  {CURRENCY_SYMBOL}
                  {parseFloat(balance).toLocaleString("en")}
                </p>
              ) : (
                <p className="labe-showbanle-option-x"> {"xxxxxx>"}</p>
              )}

              {accountType === "Business" ? (
                <div className="accountType-business-show-option">
                  <div className="business-label-div">
                    <button className="button-label-business-show"></button>{" "}
                    <p className="label-text-option"> Add Money</p>
                  </div>
                  <div className="business-label-div">
                    <button className="button-label-business-show"></button>
                    <p className="label-text-option">Sub POS</p>{" "}
                  </div>
                  <div className="business-label-div">
                    <button className="button-label-business-show"></button>
                    <p className="label-text-option">Details</p>
                  </div>
                  <div className="business-label-div">
                    <button className="button-label-business-show"></button>
                    <p className="label-text-option">More</p>
                  </div>
                </div>
              ) : (
                ""
              )}
              {accountType === "Savings" ? (
                <div className="accountType-savings-show-option">
                  <div className="savings-label-div">
                    <button className="button-label-savings-show"></button>{" "}
                    <p className="label-savings-text-option"> Add Money</p>
                  </div>
                  <div className="savings-label-div">
                    <button className="button-label-savings-show"></button>
                    <p className="label-savings-text-option">Details</p>
                  </div>
                  <div className="savings-label-div">
                    <button className="button-label-savings-show"></button>
                    <p className="label-savings-text-option">More</p>
                  </div>
                </div>
              ) : (
                ""
              )}
              {accountType === "Master_POS" ? (
                <div className="accountType-master-show-option">
                  <div className="master-label-div">
                    <button className="button-label-master-show"></button>{" "}
                    <p className="label-master-text-option"> Add Money</p>
                  </div>
                  <div className="master-label-div">
                    <button className="button-label-business-show"></button>
                    <p className="label-master-text-option">Details</p>
                  </div>
                  <div className="master-label-div">
                    <button className="button-label-master-show"></button>
                    <p className="label-master-text-option">More</p>
                  </div>
                </div>
              ) : (
                ""
              )}
            </div>
          ),
          value: accountType,
        });
      });
      return options;
    };

    const options = uniqueAccountTypes.flatMap((type) =>
      getOptions(allAccounts.filter((account) => account.accountType === type))
    );
    setOptions(options);
  }, [uniqueAccountTypes, allAccounts, showBalance]);

  const handleToggleBalance = () => {
    setShowBalance(!showBalance);
  };

  ////
  //This useEffect set timeout for all the navBar buttonclick and hover animation
  useEffect(() => {
    let timeoutId;

    const resetActiveButton = () => {
      setActiveButton(null);
    };
    timeoutId = setTimeout(resetActiveButton, 10000); // Set timeout for 10 seconds
    return () => {
      clearTimeout(timeoutId); // Clear timeout on component unmount or when activeButton changes
    };
  }, [activeButton]);

  useEffect(() => {
    const grouped = groupTransactionsByMonth(transactionHistory);
    setGroupedTransactions(grouped);
  }, [transactionHistory]);
  /////
  /////

  //from Here , subPOS was mapped
  useEffect(() => {
    const getOptions2 = (accounts) => {
      const uniqueMap = new Map();
      accounts.forEach((account) => {
        const { accountType, balance, accountNumber } = account;
        let updatedAccountType = accountType;

        // Ensure that only Sub_POS accounts are considered
        if (accountType === "Sub_POS") {
          // Only map unique Sub_POS accounts based on their account numbers
          if (!uniqueMap.has(accountNumber)) {
            uniqueMap.set(accountNumber, {
              balance,
              accountNumber,
              accountType: updatedAccountType,
            });
          }
        }
      });
      const options2 = [];
      uniqueMap.forEach((data, accountNumber) => {
        // Change forEach to account for accountNumber
        const { balance, accountType } = data;
        options2.push({
          label: (
            <div style={{ width: "130px", height: "80px", marginLeft: "10px" }}>
              <div style={{ marginTop: "20px" }}>
                <p style={{ fontSize: "14px" }}> {accountType}: NAIRA</p>
              </div>
              <div
                style={{ marginTop: "10px", backgroundColor: "transparent" }}
              >
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
              <p
                style={{
                  backgroundColor: showBalance ? "royalblue" : "transparent",
                  fontSize: "11px",
                  with: "30px",
                  paddingLeft: "25px",
                  marginTop: "10px",
                  height: "29px",
                  borderRadius: "20px",
                }}
              >
                {" "}
                {showBalance ? "Account Number" : ""}{" "}
                {showBalance ? accountNumber : "xxxxxx>"}
              </p>
            </div>
          ),
          value: accountNumber, // Set the value to accountNumber
        });
      });
      return options2;
    };

    const options2 = uniqueAccountTypes.flatMap((type) =>
      getOptions2(allAccounts.filter((account) => account.accountType === type))
    );

    // Set options2 in the state
    setOptions2(options2);
    console.log(options2);
  }, [uniqueAccountTypes, allAccounts, showBalance]);

  return (
    <div className="app">
      <Router>
        <Header handleClick={handleClick} activeButton={activeButton} />
        <NavBar handleClick={handleClick} activeButton={activeButton} />
        <div className="content-container">
          <Routes>
            <Route path="/account/login" element={<LoginPage />} />
            <Route path="/personalAccount" element={<PersonalAccount />} />
            <Route path="/addmoney" element={<AdMoneyMethod />} />
            <Route path="/addthrough/bank" element={<AddMoneyBankMenu />} />
          </Routes>
          <Routes>
            <Route path="/businessAccount" element={<BusinessAccount />} />
          </Routes>
          <Routes>
            <Route path="/aboutUs" element={<AboutUs />} />
            <Route path="/menu" element={<Menu />} />
            <Route path="/liveChat" element={<LiveChat />} />
            <Route path="/help" element={<Help />} />
            <Route path="/business" element={<Business />} />
            <Route path="/agupepay" element={<AgupePay />} />
            <Route path="/banking" element={<Banking />} />
            <Route path="/personal" element={<Personal />} />
            <Route path="/contactus" element={<ContactUs />} />
            <Route path="/account/signup" element={<SignUpRedirect />} />
            <Route
              path="/unSupportedCountrySelected"
              element={<UnsupportedCountrySelectionMessage />}
            />
          </Routes>
          <Routes>
            <Route
              path="/subPOS/account"
              element={
                <SubPOSFiltered
                  options2={options2}
                  transactionHistory={transactionHistory}
                  groupTransactionsByMonth={groupTransactionsByMonth}
                  setShowTransactions={setShowTransactions}
                  setGroupedTransactions={setGroupedTransactions}
                  groupedTransactions={groupedTransactions}
                  showTransactions={showTransactions}
                  showBalance={showBalance}
                  handleToggleBalance={handleToggleBalance}
                  setTransactionHistory={setTransactionHistory}
                />
              }
            />
          </Routes>

          <Filtered
            options={options}
            selected={selected}
            transactionHistory={transactionHistory}
            groupTransactionsByMonth={groupTransactionsByMonth}
            setShowTransactions={setShowTransactions}
            setGroupedTransactions={setGroupedTransactions}
            groupedTransactions={groupedTransactions}
            setSelected={setSelected}
            showTransactions={showTransactions}
            showBalance={showBalance}
            handleToggleBalance={handleToggleBalance}
            setTransactionHistory={setTransactionHistory}
          />

          {/* <Contents /> */}
          <Features />
          <Review />
          {/* <RecentTransaction
           
          /> */}
          <Notification />
          <PageNotFound transactionHistory={transactionHistory} />
        </div>
        <Footer />
        <Welcome />
      </Router>
    </div>
  );
}
