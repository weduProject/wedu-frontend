import axios from 'axios';

// 환경 변수에서 API Base URL을 가져오거나, 없으면 기본값 사용
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://api.wedu.io.kr';

// Axios 인스턴스 생성
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10초 타임아웃
});

// Request 인터셉터: 로컬 스토리지에 토큰이 있다면 헤더에 자동으로 추가
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response 인터셉터: 응답 데이터만 깔끔하게 뽑아내고, 401 에러(인증 만료) 공통 처리
api.interceptors.response.use(
  (response) => response.data, 
  (error) => {
    if (error.response) {
      const { status } = error.response;
      if (status === 401) {
        console.error('인증 토큰이 만료되었습니다. 다시 로그인해주세요.');
        // 필요시 로그인 페이지로 리다이렉트 하는 로직 추가
      }
    } else {
      console.error('네트워크 오류가 발생했습니다.');
    }
    return Promise.reject(error);
  }
);

export default api;
