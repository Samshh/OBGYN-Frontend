import { createBrowserRouter, Navigate } from "react-router-dom";
import DoctorFold from "./folds/doctor-fold";
import HomeFold from "./folds/home-fold";
import LoginFold from "./folds/login-fold";
import PatientFold from "./folds/patient-fold";
import RegisterFold from "./folds/register-fold";
import HomeLayout from "./layout/HomeLayout";
import DoctorLayout from "./layout/DoctorLayout";
import PatientLayout from "./layout/PatientLayout";

const Router = createBrowserRouter([
  {
    element: <HomeLayout />,
    children: [
      {
        path: "/",
        element: <HomeFold />,
      },
      {
        path: "/login",
        element: <LoginFold />,
      },
      {
        path: "/register",
        element: <RegisterFold />,
      },
    ],
  },
  {
    element: <DoctorLayout />,
    children: [
      {
        path: "/doctor",
        element: <DoctorFold />,
      },
    ],
  },
  {
    element: <PatientLayout />,
    children: [
      {
        path: "/patient",
        element: <PatientFold />,
      },
    ],
  },
  {
    path: "*",
    element: <Navigate to="/" replace />,
  },
]);

export default Router;
  