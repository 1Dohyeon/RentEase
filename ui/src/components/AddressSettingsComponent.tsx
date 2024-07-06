import React, { useEffect, useState } from "react";
import apiClient from "../utils/apiClient";
import AddressComponent from "./AddressComponent";

interface Address {
  id: number;
  city: string;
  district: string;
}

const AddressSettingsComponent: React.FC = () => {
  const [userAddresses, setUserAddresses] = useState<Address[]>([]);
  const [allCities, setAllCities] = useState<Address[]>([]); // 모든 주소 목록

  useEffect(() => {
    const fetchUserAddresses = async () => {
      try {
        const response = await apiClient.get("/settings/profile/address");
        setUserAddresses(response.data);
      } catch (error) {
        console.error("주소 정보를 불러오는 중 오류 발생:", error);
      }
    };

    const fetchAllAddresses = async () => {
      try {
        const response = await apiClient.get("/addresses");
        setAllCities(response.data);
      } catch (error) {
        console.error("모든 주소 정보를 불러오는 중 오류 발생:", error);
      }
    };

    fetchUserAddresses();
    fetchAllAddresses();
  }, []);

  // 최대 3개의 AddressComponent를 유지하며 사용자의 주소 수에 따라 빈 공간을 추가
  const renderAddressComponents = () => {
    const addressComponents = [];
    for (let i = 0; i < 3; i++) {
      const address = userAddresses[i] || null; // 사용자 주소가 없으면 null로 처리
      addressComponents.push(
        <AddressComponent key={i} address={address} allCities={allCities} />
      );
    }
    return addressComponents;
  };

  return (
    <div className="profile-settings">
      <h2>주소 설정</h2>
      {renderAddressComponents()}
    </div>
  );
};

export default AddressSettingsComponent;
