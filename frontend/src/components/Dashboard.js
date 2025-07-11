import React from "react";
import "../components/style.css";
import SideNav from "./SideNav";
import { Outlet } from "react-router-dom";

const Dashboard = () => {
  return (
    <div className="dashboard-main-container">
      <div className="dashboard-container">
     <SideNav/>
        <div className="main-container">
          <div className="top-bar">
            <div className="logo-container">
              <img src={require("../assets/logo192.png")} />
            </div>
            <div>
              <h1>
              Infinity learninig Institute
              </h1>
              <button>logout</button>
            </div>
          </div>
        <Outlet/>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
