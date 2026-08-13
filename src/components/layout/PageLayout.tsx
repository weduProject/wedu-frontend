import { Outlet, useLocation } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

const NO_FOOTER_PATHS = ['/onboarding/quiz'];

export default function PageLayout() {
  const { pathname } = useLocation();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-5 pt-[80px] md:p-8 md:pt-[96px]">
        <Outlet />
      </main>
      {!NO_FOOTER_PATHS.includes(pathname) && <Footer />}
    </div>
  );
}