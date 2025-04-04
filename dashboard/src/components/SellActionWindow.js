import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import GeneralContext from "./GeneralContext";
import "./BuyActionWindow.css";

const SellActionWindow = ({ uid }) => {
  const [stockQuantity, setStockQuantity] = useState(1);
  const [stockPrice, setStockPrice] = useState(0.0);
  const [availableQty, setAvailableQty] = useState(0);
  const context = useContext(GeneralContext);

  useEffect(() => {
    axios.get("https://trading-app-backend-gilt.vercel.app/allHoldings").then((res) => {
      const holding = res.data.find((item) => item.name === uid);
      if (holding) {
        setAvailableQty(holding.qty);
        setStockPrice(holding.price);
      }
    });
  }, [uid]);

  const handleSellClick = async () => {
    if (stockQuantity > availableQty) {
      alert("Not enough shares to sell.");
      return;
    }

    try {
      await axios.post("https://trading-app-backend-gilt.vercel.app/newSellOrder", {
        name: uid,
        qty: stockQuantity,
        price: stockPrice,
        mode: "SELL",
      });

      context.refreshOrders();
      context.closeSellWindow();
    } catch (err) {
      console.error("Sell request failed:", err.message);
      alert("Sell failed. Please try again.");
    }
  };

  return (
    <div className="container" id="sell-window" draggable="true">
      <div className="regular-order">
        <div className="inputs">
          <fieldset>
            <legend>Qty.</legend>
            <input
              type="number"
              value={stockQuantity}
              onChange={(e) => setStockQuantity(Number(e.target.value))}
              max={availableQty}
            />
          </fieldset>
          <fieldset>
            <legend>Price</legend>
            <input
              type="number"
              value={stockPrice}
              onChange={(e) => setStockPrice(Number(e.target.value))}
            />
          </fieldset>
        </div>
      </div>
      <div className="buttons">
        <span>Available: {availableQty}</span>
        <div>
          <Link className="btn btn-blue" onClick={handleSellClick}>
            Sell
          </Link>
          <Link className="btn btn-grey" onClick={context.closeSellWindow}>
            Cancel
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
