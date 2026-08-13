import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';

export default function OAuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    // URL 쿼리 스트링에서 토큰 추출 (백엔드가 보내주는 이름에 따라 'token' 또는 'accessToken' 등일 수 있습니다)
    const token = searchParams.get('token') || searchParams.get('accessToken');

    if (token) {
      // 1. 토큰을 로컬 스토리지에 저장
      localStorage.setItem('accessToken', token);
      alert('소셜 로그인에 성공했습니다!');
      // 2. 메인 또는 커뮤니티 페이지로 이동
      navigate('/community', { replace: true });
    } else {
      // 토큰이 없다면 로그인 실패 처리
      alert('로그인에 실패했습니다. 토큰을 찾을 수 없습니다.');
      navigate('/login', { replace: true });
    }
  }, [navigate, searchParams]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-12 h-12 border-4 border-[#F48171]/20 border-t-[#F48171] rounded-full animate-spin mb-4"></div>
      <p className="text-gray-600 font-medium text-sm">로그인 처리 중입니다. 잠시만 기다려주세요...</p>
    </div>
  );
}
