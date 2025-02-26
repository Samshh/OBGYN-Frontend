import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TitleHandler = () => {
  const location = useLocation();

  useEffect(() => {
    switch (location.pathname) {
      case "/":
        document.title = "Dr. Juliet Coching OB/GYN Clinic";
        break;
      case "/login":
        document.title = "Login";
        break;
      case "/register":
        document.title = "Register";
        break;
      case "/doctor":
        document.title = "Doctor Dashboard";
        break;
      case "/patient":
        document.title = "Patient Dashboard";
        break;
      default:
        document.title = "Dr. Juliet Coching OB/GYN Clinic.";
    }
  }, [location]);

  return null;
};

export default TitleHandler;