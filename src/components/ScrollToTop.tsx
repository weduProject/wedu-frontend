import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// 페이지(경로) 이동 시 스크롤 위치를 맨 위로 초기화.
// react-router는 기본적으로 스크롤 위치를 유지하기 때문에, 앱 최상단에서 한 번만 마운트하면 됨.
export default function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}