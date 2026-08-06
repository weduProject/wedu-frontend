import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';

export default function PageLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="flex-1 p-5 pt-[80px] md:p-8 md:pt-[96px]">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}