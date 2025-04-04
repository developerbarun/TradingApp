import React, { useState, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const BuyActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const context = useContext(GeneralContext);

  const handleBuyClick = async () => {
    try {
      await axios.post("https://trading-app-backend-gilt.vercel.app/newOrder", {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: "BUY",
      });

      context.refreshOrders(); // ✅ Updates UI (like Orders)
      context.closeBuyWindow();
    } catch (error) {
      console.error("Buy request failed:", error.message);
      alert("Failed to place order. Server might be down.");
    }
  };

  return (
    <div className="container" id="buy-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              value={stockPrice}
              onChange={(e) => setStockPrice(e.target.value)}
            />
          </fieldset>
        </div>
      </div>
      <div className="buttons">
        <Link className="btn btn-blue" onClick={handleBuyClick}>
          Buy
        </Link>
        <Link className="btn btn-grey" onClick={context.closeBuyWindow}>
          Cancel
        </Link>
      </div>
    </div>
  );
};

export default BuyActionWindow;
