import { useNavigate } from "react-router-dom";

export default function Sidebar({ isMenuOpen, setIsMenuOpen }) {
  const navigate = useNavigate();

  const handleNavigation = (path) => {
    navigate(path);
    setIsMenuOpen(false);
  };

  return (
    <aside className={`sidebar ${isMenuOpen ? "open" : ""}`}>
      <button className="close-btn" onClick={() => setIsMenuOpen(false)}>
        ✕
      </button>
      <ul>
        <li onClick={() => handleNavigation("/home")}>Home</li>
        <li onClick={() => handleNavigation("/profile")}>Profile</li>
        <li onClick={() => handleNavigation("/saved")}>Saved Jobs</li>
        <li onClick={() => handleNavigation("/settings")}>Settings</li>
        <li onClick={() => handleNavigation("/all-users")}>All Users</li>
        <li onClick={() => handleNavigation("/signup")}>Logout</li>
      </ul>
    </aside>
  );
}
