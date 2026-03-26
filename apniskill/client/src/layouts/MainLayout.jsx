import { Outlet } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import MobileBottomNav from '../components/MobileBottomNav.jsx';
import Navbar from '../components/Navbar.jsx';

export default function MainLayout() {
  return (
    <div className="relative min-h-screen overflow-hidden text-white">
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-8rem] top-[-7rem] h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute right-[-6rem] top-[18%] h-60 w-60 rounded-full bg-amber-200/10 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute bottom-[-10rem] left-[22%] h-72 w-72 rounded-full bg-sky-400/8 blur-3xl sm:h-[28rem] sm:w-[28rem]" />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />
        <main className="mx-auto flex w-full max-w-7xl flex-1 px-4 pb-28 pt-6 sm:px-5 sm:pt-8 md:px-6 md:pb-16 lg:px-8 lg:pt-10">
          <div className="w-full">
            <Outlet />
          </div>
        </main>
        <Footer />
        <MobileBottomNav />
      </div>
    </div>
  );
}
