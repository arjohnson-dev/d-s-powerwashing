import { Outlet } from "react-router-dom";
import Footer from "./Footer";
import HashScroller from "./HashScroller";
import Header from "./Header";

function SiteLayout() {
  return (
    <div className="site-shell">
      <HashScroller />
      <Header />
      <main className="site-main">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}

export default SiteLayout;
