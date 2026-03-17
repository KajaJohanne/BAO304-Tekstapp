import { useEffect, useRef, useState } from "react";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import "./layoutAndHeader.css";
import type { Environment, User } from "../../../api";

export default function LayoutAndHeader() {
  const [isOpen, setIsOpen] = useState(false);
  const [showEnvironments, setShowEnvironments] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const location = useLocation();
  const navigate = useNavigate();

  const hideHeader =
    location.pathname === "/" || location.pathname === "/login";
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("currentUser");

    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    } else {
      setCurrentUser(null);
    }
  }, [location.pathname]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setShowEnvironments(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const formatEnviroment = (enviroment: Environment) => {
    switch (enviroment) {
      case "utv":
        return "Utv";
      case "test":
        return "Test";
      case "prod":
        return "Prod";
      default:
        return enviroment;
    }
  };

  const handleLogut = () => {
    localStorage.removeItem("currentUser");
    setCurrentUser(null);
    setIsOpen(false);
    setShowEnvironments(false);
    navigate("/login");
  };

  return (
    <div className="layout-container">
      {!hideHeader && (
        <header className="header">
          <div className="header-content">
            <Link to="/home" className="logo-link">
              <img
                src="images/statens-vegvesen-logo-header.svg"
                alt="Statens vegvesen"
                className="logoVegvesen"
              />
            </Link>

            <div className="profile-container" ref={dropdownRef}>
              <button
                className={`profile-button ${isOpen ? "active" : ""}`}
                onClick={() => {
                  setIsOpen(!isOpen);
                  if (isOpen) {
                    setShowEnvironments(false);
                  }
                }}
              >
                <img src="/images/user-icon.svg" className="profile-icon" />
                Din side
              </button>

              {isOpen && (
                <div className="dropdown-menu">
                  {currentUser && (
                    <div className="dropdown-item">{currentUser.name}</div>
                  )}
                  <button
                    className="dropdown-item dropdown-toggle"
                    onClick={() => setShowEnvironments(!showEnvironments)}
                  >
                    Utviklingsmiljø
                  </button>

                  {showEnvironments && currentUser && (
                    <div className="submenu">
                      {currentUser.allowedEnvironments.map((enviroment) => (
                        <button key={enviroment} className="submenu-item">
                          {formatEnviroment(enviroment)}
                        </button>
                      ))}
                    </div>
                  )}
                  <button
                    className="dropdown-item logout"
                    onClick={handleLogut}
                  >
                    Logg ut
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>
      )}
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  );
}
