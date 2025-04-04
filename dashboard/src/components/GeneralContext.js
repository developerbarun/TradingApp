import React, { useState } from "react";
import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

const GeneralContext = React.createContext({
  openBuyWindow: () => {},
  closeBuyWindow: () => {},
  openSellWindow: () => {},
  closeSellWindow: () => {},
  refreshOrders: () => {},
  refreshHoldings: () => {},
});

export const GeneralContextProvider = (props) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");

  const [refreshOrdersCallback, setRefreshOrdersCallback] = useState(
    () => () => {}
  );
  const [refreshHoldingsCallback, setRefreshHoldingsCallback] = useState(
    () => () => {}
  );

  const openBuyWindow = (uid, onRefreshOrders, onRefreshHoldings) => {
    setSelectedStockUID(uid);
    if (onRefreshOrders) setRefreshOrdersCallback(() => onRefreshOrders);
    if (onRefreshHoldings) setRefreshHoldingsCallback(() => onRefreshHoldings);
    setIsBuyWindowOpen(true);
  };

  const closeBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
  };

  const openSellWindow = (uid, onRefreshOrders, onRefreshHoldings) => {
    setSelectedStockUID(uid);
    if (onRefreshOrders) setRefreshOrdersCallback(() => onRefreshOrders);
    if (onRefreshHoldings) setRefreshHoldingsCallback(() => onRefreshHoldings);
    setIsSellWindowOpen(true);
  };

  const closeSellWindow = () => {
    setIsSellWindowOpen(false);
    setSelectedStockUID("");
  };

  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow,
        closeBuyWindow,
        openSellWindow,
        closeSellWindow,
        refreshOrders: refreshOrdersCallback,
        refreshHoldings: refreshHoldingsCallback,
      }}
    >
      {props.children}
      {isBuyWindowOpen && <BuyActionWindow uid={selectedStockUID} />}
      {isSellWindowOpen && <SellActionWindow uid={selectedStockUID} />}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
