import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    if (!address) {
      setSelectedCity("");
      setSelectedDistrict("");
    } else {
      setSelectedCity(address.city);
      setSelectedDistrict(address.district);
    }
  }, [address]);

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
          {allCities.map((addr) => (
            <option key={addr.id} value={addr.city}>
              {addr.city}
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
          <button className="delete-button">삭제</button>
        </>
      ) : (
        <button className="add-button">추가하기</button>
      )}
    </div>
  );
};

export default AddressComponent;
