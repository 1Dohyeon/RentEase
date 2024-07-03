import axios from "axios";

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
});

// 요청 인터셉터 설정: 헤더에 JWT 추가
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwt");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 응답 인터셉터 설정: 401 오류 처리
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      console.error("인증 오류: 세션이 만료되었습니다. 다시 로그인해주세요.");
      // 401 Unauthorized 오류 처리
    } else {
      console.error("오류 발생:", error.message);
      // 다른 오류 처리
    }
    return Promise.reject(error);
  }
);

export default apiClient;
