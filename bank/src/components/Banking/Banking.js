import { React } from "react";
import Footer from "../Footer/Footer";
import Notification from "../Notification/Notification";

import "./banking.css";
function Banking() {
  return (
    <div
      style={{ justifyContent: "space-evenly", backgroundColor: "white" }}
      className="banking_headpage"
    >
      <div style={{ display: "flex" }}>
        <h2
          style={{
            paddingLeft: "10px",
            color: "rgb(10, 10, 100)",
            marginTop: "70px",
            marginLeft: "123px",
          }}
        >
          Welcome to Agupe digital banking, the best so far in the system.
        </h2>
      </div>

      <div style={{ display: "grid" }}>
        <div>
          <p style={{ marginTop: "5px", padding: "50px" }}>
            Agupe digital banking came at the right time to make payment very
            easy and seamless. With our mobile contactless card you can make
            payment anytime anywhere just by tapping your mobile phone. Is that
            not awesome? Signup below!
          </p>
        </div>
      </div>

      <div className="personal_1"></div>
      <Notification />
      <Footer />
    </div>
  );
}

export default Banking;
