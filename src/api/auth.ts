import api from './axios';

export const authApi = {
  // 이메일 로그인
  login: (data: { email: string; password: string }) => 
    api.post('/api/auth/login', data),
    
  // 이메일 회원가입
  signup: (data: any) => 
    api.post('/api/auth/signup', data),
};
