import React from "react";
import { NavLink } from "react-router-dom";
import { useDispatch } from "react-redux";
import "./Header.css";
import { useNavigate } from "react-router-dom";
import { logOut } from "../firebase/auth.ts";
import { Link } from "react-router-dom";

interface HeaderProps {
  user: {
    displayName: string;
    photoURL: string;
  } | null;
}

const Header: React.FC<HeaderProps> = ({ user }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleButtonClick = () => {
    navigate("/create-task");
  };

  const handleLogout = () => {
    logOut(dispatch);
  };

  return (
    <header>
      {/* Top Section */}
      <div className="header-top">
        <h1>Task Buddy</h1>
        {user && (
          <div className="header-user-info">
            <img
              src={
                user.photoURL ||
                "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png"
              }
              alt="User"
              className="profile-pic"
            />
            <Link to="/profile" className="profile-link">
              {user.displayName}
            </Link>
          </div>
        )}
      </div>

      {/* Navigation Section */}
      <div className="header-navigation">
        <div className="nav-buttons">
          <NavLink
            to="/"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            List View
          </NavLink>
          <NavLink
            to="/board-view"
            className={({ isActive }) =>
              isActive ? "nav-link active" : "nav-link"
            }
          >
            Board View
          </NavLink>
        </div>
        {user && (
          <button className="logout-button" onClick={handleLogout}>
            Logout
          </button>
        )}
      </div>

      {/* Filter and Action Section */}
      <div className="header-actions">
        <span className="filter-text">Filter By</span>
        <div className="dropdown-buttons">
          <div className="dropdown">
            <button className="dropdown-button">Category</button>
            <div className="dropdown-content">
              <Link to="/k">Work</Link>
              <Link to="/">Personal</Link>
              <Link to="/">Other</Link>
            </div>
          </div>
          <div className="dropdown">
            <button className="dropdown-button">Due Date</button>
            <div className="dropdown-content">
              <Link to="/">Ascending</a>
              <Link to="/">Descending</a>
            </div>
          </div>
        </div>
        {user && (
          <div className="search-and-add">
            <input type="text" placeholder="Search tasks..." />
            <button className="add-task-button" onClick={handleButtonClick}>
              Add Task
            </button>
          </div>
        )}
      </div>

      {/* Divider */}
      <div className="header-divider"></div>
    </header>
  );
};

export default Header;
