import { useEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Footer from '../components/Footer.jsx';
import MobileBottomNav from '../components/MobileBottomNav.jsx';
import Navbar from '../components/Navbar.jsx';

export default function MainLayout() {
  const location = useLocation();
  const isChatPage = location.pathname === '/chat';

  useEffect(() => {
    const { body, documentElement } = document;
    const previousBodyOverflow = body.style.overflow;
    const previousHtmlOverflow = documentElement.style.overflow;

    if (isChatPage) {
      body.style.overflow = 'hidden';
      documentElement.style.overflow = 'hidden';
    }

    return () => {
      body.style.overflow = previousBodyOverflow;
      documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isChatPage]);

  return (
    <div className={`relative overflow-hidden text-white ${isChatPage ? 'h-dvh' : 'min-h-screen'}`}>
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute left-[-8rem] top-[-7rem] h-72 w-72 rounded-full bg-cyan-300/10 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute right-[-6rem] top-[18%] h-60 w-60 rounded-full bg-amber-200/10 blur-3xl sm:h-80 sm:w-80" />
        <div className="absolute bottom-[-10rem] left-[22%] h-72 w-72 rounded-full bg-sky-400/8 blur-3xl sm:h-[28rem] sm:w-[28rem]" />
      </div>

      <div className={`relative z-10 flex flex-col ${isChatPage ? 'h-full min-h-0' : 'min-h-screen'}`}>
        <Navbar />
        <main
          className={`mx-auto flex w-full max-w-7xl flex-1 ${
            isChatPage
              ? 'min-h-0 overflow-hidden px-0 py-0 sm:px-3 sm:py-3 md:px-5 md:py-4'
              : 'px-4 pb-28 pt-6 sm:px-5 sm:pt-8 md:px-6 md:pb-16 lg:px-8 lg:pt-10'
          }`}
        >
          <div className={`w-full ${isChatPage ? 'min-h-0' : ''}`}>
            <Outlet />
          </div>
        </main>
        {!isChatPage ? <Footer /> : null}
        {!isChatPage ? <MobileBottomNav /> : null}
      </div>
    </div>
  );
}
