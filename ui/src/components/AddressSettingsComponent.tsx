import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import apiClient from "../utils/apiClient";
import "./AddressSettingsComponent.css";

interface Address {
  id: number;
  city: string;
  district: string;
}

const AddressSettingsComponent: React.FC = () => {
  const [allAddresses, setAllAddresses] = useState<Address[]>([]);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const { userId } = useContext(AuthContext);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const profileResponse = await apiClient.get(
          "/settings/profile/address"
        );
        setAddresses(profileResponse.data);

        const allAddressesResponse = await apiClient.get("/addresses");
        setAllAddresses(allAddressesResponse.data);
      } catch (error) {
        console.error("주소 데이터 로딩 오류:", error);
      }
    };

    fetchAddresses();
  }, []);

  const handleCityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCity(e.target.value);
    setSelectedDistrict(""); // Reset district when city changes
  };

  const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDistrict(e.target.value);
  };

  const handleAddAddress = async () => {
    if (addresses.length < 3) {
      const newAddress = `${selectedCity} ${selectedDistrict}`;
      try {
        await apiClient.post("/settings/profile/address", {
          addresses: newAddress,
        });
        const profileResponse = await apiClient.get(
          "/settings/profile/address"
        );
        setAddresses(profileResponse.data);
        setSelectedCity("");
        setSelectedDistrict("");
      } catch (error) {
        console.error("주소 추가 오류:", error);
      }
    } else {
      alert("최대 3개의 주소만 추가할 수 있습니다.");
    }
  };

  const handleUpdateAddress = async (index: number, addressId: number) => {
    const newAddress = `${selectedCity} ${selectedDistrict}`;
    try {
      await apiClient.patch(
        `/settings/profile/address?userId=${userId}&addressId=${addressId}`,
        { newAddress }
      );
      const profileResponse = await apiClient.get("/settings/profile/address");
      setAddresses(profileResponse.data);
    } catch (error) {
      console.error("주소 수정 오류:", error);
    }
  };

  const cities = allAddresses
    .map((address) => address.city)
    .filter((city, index, self) => self.indexOf(city) === index);

  const districts = allAddresses
    .filter((address) => address.city === selectedCity)
    .map((address) => address.district);

  return (
    <div className="address-settings">
      <h2>주소 설정</h2>
      <form onSubmit={(e) => e.preventDefault()}>
        {addresses.map((address, index) => (
          <div key={address.id} className="address-item">
            <div>
              <label htmlFor={`city-${address.id}`}>도시</label>
              <select
                id={`city-${address.id}`}
                value={selectedCity || address.city}
                onChange={handleCityChange}
              >
                <option value="">시/도 선택</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor={`district-${address.id}`}>구/군</label>
              <select
                id={`district-${address.id}`}
                value={selectedDistrict || address.district}
                onChange={handleDistrictChange}
              >
                <option value="">구/군 선택</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={() => handleUpdateAddress(index, address.id)}
              style={{
                padding: "5px 10px",
                backgroundColor: "#7DB26B",
                color: "white",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "600",
                marginTop: "10px",
              }}
            >
              주소 수정
            </button>
          </div>
        ))}
        {addresses.length < 3 && (
          <div className="new-address">
            <h3>새 주소 추가</h3>
            <div>
              <label htmlFor="new-city">도시</label>
              <select
                id="new-city"
                value={selectedCity}
                onChange={handleCityChange}
              >
                <option value="">시/도 선택</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="new-district">구/군</label>
              <select
                id="new-district"
                value={selectedDistrict}
                onChange={handleDistrictChange}
              >
                <option value="">구/군 선택</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
            <button
              type="button"
              onClick={handleAddAddress}
              style={{
                padding: "10px 20px",
                backgroundColor: "#7DB26B",
                color: "white",
                textDecoration: "none",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
                fontWeight: "600",
                marginTop: "10px",
              }}
            >
              주소 추가
            </button>
          </div>
        )}
        <button
          type="submit"
          style={{
            padding: "10px 20px",
            backgroundColor: "#7DB26B",
            color: "white",
            textDecoration: "none",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
            fontWeight: "600",
            marginTop: "20px",
          }}
        >
          주소 설정 완료
        </button>
      </form>
    </div>
  );
};

export default AddressSettingsComponent;
