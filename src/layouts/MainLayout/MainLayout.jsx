import { memo } from "react";
import { Outlet } from "react-router-dom";

import Footer from "src/components/Footer";
import NavHeader from "../../components/NavHeader/NavHeader";

function MainLayoutInner() {
  
  return (
    <div >
    <NavHeader/>
      {/* <Header /> */}
      {/* {children} */}
      <Outlet />
      <Footer />
    </div>
  );
}

const MainLayout = memo(MainLayoutInner);

export default MainLayout;
