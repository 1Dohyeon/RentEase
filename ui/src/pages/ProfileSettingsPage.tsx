import React from "react";
import Header from "../components/Header";
import ProfileSettingsComponent from "../components/ProfileSettingsComponent";

const ProfileSettingsPage: React.FC = () => {
  return (
    <div>
      <Header />
      <div style={{ width: "100%", height: "100px" }}></div>
      <div style={{ width: "840px", margin: "0 auto" }}>
        <ProfileSettingsComponent />
      </div>
    </div>
  );
};

export default ProfileSettingsPage;
