import PatientNav from "@/navs/PatientNav";
import TitleHandler from "@/TitleHandler";
import { Outlet, useNavigate } from "react-router-dom";
import axios from "axios";
import { useEffect } from "react";

export default function PatientLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    console.log(localStorage.getItem("token"));
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_ENDPOINT}/users/auth`,
          {},
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            }
          }
        );
        const data = await response.data;

        if (data && data.user.TypeIs === 1) {
          navigate("/doctor");
        } else if (data && data.user.TypeIs === 2) {
          navigate("/patient");
        } else {
          console.log("Invalid User");
          navigate("/login");
        }
      } catch (error) {
        console.error(error);
        navigate("/login");
      }
    };

    checkAuth();
  }, [navigate]);
  return (
    <>
      <TitleHandler />
      <Outlet />
      <PatientNav />
    </>
  );
}
