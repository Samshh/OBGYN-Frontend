import RegisterStep1 from "./components/RegisterStep1";
import RegisterStep2 from "./components/RegisterStep2";
import { useEffect } from "react";
import useRegisterStore from "./store";
import { useShallow } from "zustand/react/shallow";
import { Navigate, useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterFold() {
  const [
    step,
    goToPrevStep,
    goToNextStep,
    resetValues,

    // step 1
    firstName,
    middleName,
    lastName,
    birthDate,
    seggs,
    homeAddress,

    // step 2
    username,
    password,
    contactNumber,
    emailAddress,
  ] = useRegisterStore(
    useShallow((state) => [
      state.step,
      state.goToPrevStep,
      state.goToNextStep,
      state.resetValues,

      // step 1
      state.firstName,
      state.middleName,
      state.lastName,
      state.birthDate,
      state.seggs,
      state.homeAddress,

      // step 2
      state.username,
      state.password,
      state.contactNumber,
      state.emailAddress,
    ])
  );

  const navigate = useNavigate();

  useEffect(() => {
    resetValues();
  }, [resetValues]);

  const validateUsername = (username: string | null) => {
    const usernameRegex = /^[a-zA-Z0-9]{3,15}$/;
    return usernameRegex.test(username ?? "");
  };

  const validatePassword = (password: string | null) => {
    const passwordRegex =
      /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password ?? "");
  };

  const validateEmail = (emailAddress: string | null) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(emailAddress ?? "");
  };

  const isStep1Valid = () => {
    return (
      firstName && middleName && lastName && birthDate && seggs && homeAddress
    );
  };

  const isStep2Valid = () => {
    return (
      validateUsername(username) &&
      validatePassword(password) &&
      validateEmail(emailAddress) &&
      contactNumber
    );
  };

  const handleData = async () => {
    const patientData = {
      FirstName: firstName,
      MiddleName: middleName,
      LastName: lastName,
      BirthDate: birthDate,
      SexID: seggs,
      HomeAddress: homeAddress,
      UserName: username,
      UserPassword: password,
      ContactNumber: contactNumber,
      EmailAddress: emailAddress,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/users/createPatient`,
        patientData
      );
      console.log(response);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section>
      <div className="flex flex-col flex-grow justify-center items-center">
        <form id="homeForm">
          <div className="flex justify-between items-end">
            <h1>
              Register<em>.</em>
            </h1>
            <p>Step {step} of 2</p>
          </div>
          <div className="overflow-y-scroll">
            <div className="flex flex-col gap-[1rem] h-[320px] md:h-[480px]">
              {step === 1 ? (
                <RegisterStep1 />
              ) : step === 2 ? (
                <RegisterStep2
                  validateUsername={validateUsername}
                  validatePassword={validatePassword}
                  validateEmail={validateEmail}
                />
              ) : (
                <Navigate to="/register" />
              )}
            </div>
          </div>
          <div className="flex justify-end items-center gap-[1rem] sticky bottom-0 p-[1rem]">
            {step === 2 && (
              <button type="button" onClick={() => goToPrevStep()}>
                Back
              </button>
            )}
            {step === 2 ? (
              <button
                type="button"
                onClick={() => (handleData(), navigate("/login"))}
                className="specialButton"
                disabled={!isStep2Valid()}
              >
                Finish
              </button>
            ) : (
              <button
                type="button"
                onClick={() => goToNextStep()}
                className="specialButton"
                disabled={!isStep1Valid()}
              >
                Next
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
