import { Outlet } from 'react-router-dom';
import { Header } from './Header';

const RootLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-grow">
        <Outlet />
      </main>
    </div>
  );
};

export default RootLayout;