import { Icon } from "@iconify/react";
import { useNavigate } from "react-router-dom";
import usePatientStore from "@/folds/patient-fold/store";
import { useShallow } from "zustand/react/shallow";
import cookies from "js-cookie";
import axios from "axios";
import Modal from "@/UI/Modal";
import { useState } from "react";

export default function PatientNav() {
  const [currentTab, setCurrentTab] = usePatientStore(
    useShallow((state) => [state.currentTab, state.setCurrentTab])
  );

  const [isModalOpen, setIsModalOpen] = useState(false);

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
    <>
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
            onClick={() => setIsModalOpen(true)}
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
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <div className="flex flex-col gap-[1rem]">
          <div className="flex items-center justify-between gap-[1rem]">
            <h3>Logout?</h3>
          </div>
          <Modal.Separator />
          <div className="flex gap-4">
            <button onClick={() => (navigate("/login"), handleLogout())}>
              Confirm
            </button>
            <Modal.Close
              isOpen={isModalOpen}
              onClose={() => setIsModalOpen(false)}
            >
              Cancel
            </Modal.Close>
          </div>
        </div>
      </Modal>
    </>
  );
}
