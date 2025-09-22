import { useState } from "react";
import Sidebar from "./Sidebar";
import "../Styling/Layout.css";

export default function Layout({ children }) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="app-layout">
      {/* HEADER */}
      <header className="home-header">
        <div
          className="hamburger"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          &#9776;
        </div>

        <h1 className="home-title">FIND JOBS</h1>

        <div className="profile-picture">
          <img src="https://picsum.photos/150" alt="Profile" />
        </div>
      </header>

      {/* SIDEBAR */}
      <Sidebar isMenuOpen={isMenuOpen} setIsMenuOpen={setIsMenuOpen} />

      {/* PAGE CONTENT */}
      <main className={`page-content ${isMenuOpen ? "overlay" : ""}`}>
        {children}
      </main>
    </div>
  );
}
