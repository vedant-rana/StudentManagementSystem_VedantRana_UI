import { Link, useNavigate } from "react-router-dom";
import { removeToken } from "../utils/auth";

function Layout({ children }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    removeToken();
    navigate("/login");
  };

  return (
    <div className="layout">
      <nav className="navbar">
        <div className="navbar-brand">
          <span>Student Management System</span>
        </div>
        <ul className="navbar-links">
          <li>
            <Link to="/students">Students</Link>
          </li>
          <li>
            <Link to="/classes">Classes</Link>
          </li>
          <li>
            <button className="btn btn-logout" onClick={handleLogout}>
              Logout
            </button>
          </li>
        </ul>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
}

export default Layout;
