import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import CareerNavbar from "./CareerNavbar";
import Footer from "./Footer";

const CareerLayout = () => {
  return (
    <>
      <Navbar />
      <CareerNavbar />
      <div style={{ minHeight: "60vh" }}>
        <Outlet />
      </div>
      <Footer />
    </>
  );
};

export default CareerLayout;
