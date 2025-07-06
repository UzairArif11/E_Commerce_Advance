// src/components/Layout.jsx
import Navbar from './Navbar';
import Footer from './Footer';

const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      {/* Add top padding to account for fixed navbar */}
      <main className="flex-grow pt-16 lg:pt-20">{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;
