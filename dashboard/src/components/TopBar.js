import React, { useContext } from "react";
import { UserContext } from "../context/UserContext";
import Menu from "./Menu";

const TopBar = () => {
  const { user } = useContext(UserContext);
  console.log("User from context:", user);

  return (
    <div className="topbar-container d-flex justify-content-between align-items-center">
      <div className="indices-container d-flex">
        <div className="nifty me-4">
          <p className="index">NIFTY 50</p>
          <p className="index-points">{100.2}</p>
        </div>
        <div className="sensex">
          <p className="index">SENSEX</p>
          <p className="index-points">{100.2}</p>
        </div>
      </div>

      <div className="user-info me-4">
        {user && <p className="mb-0 fw-semibold">Hi, {user.name}</p>}
      </div>

      <Menu />
    </div>
  );
};

export default TopBar;
