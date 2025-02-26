import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";

export default function HomeNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(false);
  const [isRegister, setIsRegister] = useState(false);

  useEffect(() => {
    if (location.pathname === "/login") {
      setIsLogin(true);
      setIsRegister(false);
    } else if (location.pathname === "/register") {
      setIsRegister(true);
      setIsLogin(false);
    } else {
      setIsLogin(false);
      setIsRegister(false);
    }
  }, [location.pathname]);

  const handleLoginClick = () => {
    navigate("/login");
    setIsLogin(true);
    setIsRegister(false);
  };

  const handleRegisterClick = () => {
    navigate("/register");
    setIsRegister(true);
    setIsLogin(false);
  };

  const handleLogoClick = () => {
    navigate("/");
    setIsLogin(false);
    setIsRegister(false);
  };

  return (
    <nav className="homeNav">
      <div id="nav">
        <img
          onClick={handleLogoClick}
          className="h-[44px] md:h-[55px] hover:cursor-pointer hover:scale-110 transition-transform duration-200 ease-in-out"
          src="logo.svg"
          alt=""
        />
        <div className="flex gap-[1rem]">
          <button disabled={isLogin} onClick={handleLoginClick}>
            Login
          </button>
          <button disabled={isRegister} onClick={handleRegisterClick}>
            Register
          </button>
        </div>
      </div>
    </nav>
  );
}