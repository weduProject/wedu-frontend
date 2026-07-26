import { Outlet } from 'react-router-dom';
import Header from './Header';
import SideNav from './SideNav';

export default function PageLayout() {
  return (
    <div className="flex flex-col md:flex-row min-h-screen">
      <SideNav />
      <div className="flex flex-col flex-1 min-w-0 order-1 md:order-none">
        <Header />
        <main className="flex-1 overflow-y-auto p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
