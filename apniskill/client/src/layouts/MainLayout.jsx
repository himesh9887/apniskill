import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <Navbar />
      <main className="pt-20 pb-12 px-4 md:px-8 lg:px-16">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;

