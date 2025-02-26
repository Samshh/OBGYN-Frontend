import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import usePatientStore from "@/folds/patient-fold/store";
import { useShallow } from "zustand/react/shallow";
import cookies from "js-cookie";
import axios from "axios";

export default function PatientNav() {
  const [currentTab, setCurrentTab] = usePatientStore(
    useShallow((state) => [state.currentTab, state.setCurrentTab])
  );

  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await axios.post(
        "http://localhost:3000/users/logout",
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
          title="profile"
        >
          <Icon className="Icon" icon="heroicons:user" />
        </button>
        <button
          onClick={() => handleLogout()}
          className="innerNavButton"
          title="logout"
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
