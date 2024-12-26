import { memo } from "react";
import { Outlet } from "react-router-dom";

import Footer from "src/components/Footer";
import NavHeader from "../../components/NavHeader/NavHeader";
import Header from "../../components/Header/Header";

function MainLayoutInner() {
  
  return (
    <div className="bg-background">
    <NavHeader/>
      <Header />
      {/* {children} */}
      <Outlet />
      <Footer />
    </div>
  );
}

const MainLayout = memo(MainLayoutInner);

export default MainLayout;
