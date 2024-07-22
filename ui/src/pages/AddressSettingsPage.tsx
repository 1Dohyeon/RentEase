import React from "react";
import AddressSettingsComponent from "../components/AddressSettingsComponent";
import Header from "../components/Header";

const AddressSettingsPage: React.FC = () => {
  return (
    <div>
      <Header />
      <div style={{ width: "100%", height: "100px" }}></div>
      <div style={{ width: "840px", margin: "0 auto" }}>
        <AddressSettingsComponent />
      </div>
    </div>
  );
};

export default AddressSettingsPage;
