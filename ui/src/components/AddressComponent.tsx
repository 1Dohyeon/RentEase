import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../utils/apiClient";
import "./AddressComponent.css";

interface Address {
  id: number;
  city: string;
  district: string;
}

interface AddressComponentProps {
  address?: Address | null;
  allCities: Address[];
}

const AddressComponent: React.FC<AddressComponentProps> = ({
  address,
  allCities,
}) => {
  const [selectedCity, setSelectedCity] = useState(address?.city || "");
  const [selectedDistrict, setSelectedDistrict] = useState(
    address?.district || ""
  );
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    if (!address) {
      setSelectedCity("");
      setSelectedDistrict("");
    } else {
      setSelectedCity(address.city);
      setSelectedDistrict(address.district);
    }
  }, [address]);

  const handleAddAddress = async () => {
    if (!selectedCity || !selectedDistrict) {
      alert("시/도와 군/구를 선택해주세요.");
      return;
    }

    const newAddress = `${selectedCity} ${selectedDistrict}`;

    try {
      const response = await apiClient.post("/settings/profile/address", {
        address: newAddress,
      });

      if (response) {
        alert("주소가 추가되었습니다.");
        window.location.reload();
      }
    } catch (error: any) {
      console.error("주소 추가 중 오류 발생:", error);
      let errorMessage = "주소 추가 중 오류가 발생했습니다.";

      // 서버에서 전달한 에러 메시지를 확인하여 처리
      if (error.response && error.response.data) {
        const { success, path, error: serverError } = error.response.data;

        if (!success) {
          errorMessage = `${serverError}`;
        }
      }

      alert(errorMessage);
    }
  };

  const handleDeleteAddress = async () => {
    if (!address || !address.id) {
      alert("삭제할 주소 정보가 유효하지 않습니다.");
      return;
    }

    const confirmMessage = `주소 "${address.city} ${address.district}" 를 삭제하시겠습니까?`;
    const confirmed = window.confirm(confirmMessage);

    if (!confirmed) {
      return;
    }

    try {
      const response = await apiClient.delete(
        `/settings/profile/address?userId=${userId}&addressId=${address.id}`
      );
      if (response) window.location.reload();
    } catch (error) {
      console.error("주소 삭제 중 오류 발생:", error);
      alert("주소 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="address-component">
      <div>
        <label htmlFor="city">시/도</label>
        <select
          id="city"
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
        >
          <option value="">시/도 선택</option>
          {allCities
            .map((addr) => addr.city)
            .filter((value, index, self) => self.indexOf(value) === index) // 중복 제거
            .map((city, index) => (
              <option key={index} value={city}>
                {city}
              </option>
            ))}
        </select>
      </div>
      <div>
        <label htmlFor="district">군/구</label>
        <select
          id="district"
          value={selectedDistrict}
          onChange={(e) => setSelectedDistrict(e.target.value)}
          disabled={!selectedCity}
        >
          <option value="">군/구 선택</option>
          {allCities
            .filter((addr) => addr.city === selectedCity)
            .map((addr) => (
              <option key={addr.id} value={addr.district}>
                {addr.district}
              </option>
            ))}
        </select>
      </div>
      {address ? (
        <>
          <button className="edit-button">수정</button>
          <button className="delete-button" onClick={handleDeleteAddress}>
            삭제
          </button>
        </>
      ) : (
        <button className="add-button" onClick={handleAddAddress}>
          추가하기
        </button>
      )}
    </div>
  );
};

export default AddressComponent;
