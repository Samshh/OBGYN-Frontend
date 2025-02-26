import { Icon } from "@iconify/react";
import useDoctorStore from "@/folds/doctor-fold/store";
import { useShallow } from "zustand/react/shallow";
import { useNavigate } from "react-router-dom";
import cookies from "js-cookie";
import axios from "axios";

export default function DoctorNav() {
  const [currentTab, setCurrentTab] = useDoctorStore(
    useShallow((state) => [state.currentTab, state.setCurrentTab])
  );

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/users/logout`,
        {},
        {
          withCredentials: true,
        }
      );

      if (response.status === 200) {
        cookies.remove("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="innerNav">
      <div id="innerNavContainer">
        <button
          onClick={() => setCurrentTab(1)}
          className={`innerNavButton ${
            currentTab === 1 ? "bg-accent text-white pointer-events-none" : ""
          }`}
          title="home"
        >
          <Icon className="Icon" icon="heroicons:home" />
        </button>
        <button
          onClick={() => setCurrentTab(2)}
          className={`innerNavButton ${
            currentTab === 2 ? "bg-accent text-white pointer-events-none" : ""
          }`}
          title="home"
        >
          <Icon className="Icon" icon="heroicons:user" />
        </button>
        <button
          onClick={() => setCurrentTab(3)}
          className={`innerNavButton ${
            currentTab === 3 ? "bg-accent text-white pointer-events-none" : ""
          }`}
          title="home"
        >
          <Icon className="Icon" icon="si:clipboard-line" />
        </button>
        <button
          onClick={() => (navigate("/login"), handleLogout())}
          className={`innerNavButton ${
            currentTab === 4 ? "bg-accent text-white pointer-events-none" : ""
          }`}
          title="home"
        >
          <Icon
            className="Icon"
            icon="heroicons:arrow-right-on-rectangle-solid"
          />
        </button>
      </div>
    </nav>
  );
}
