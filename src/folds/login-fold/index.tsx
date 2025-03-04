import axios from "axios";
import { useState, useEffect, ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";

export default function LoginFold() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleChange =
    (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const loginAPI = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Logging in");

    const loginData = {
      EmailAddress: email,
      UserPassword: password,
    };

    const doctorEndpoint = `${import.meta.env.VITE_ENDPOINT}/users/loginAdmin`;
    const patientEndpoint = `${
      import.meta.env.VITE_ENDPOINT
    }/users/loginPatient`;

    try {
      // Attempt Doctor login
      const doctorResponse = await axios.post(doctorEndpoint, loginData, {
        withCredentials: true,
      });

      if (doctorResponse.data.status === 1) {
        console.log("Login successful as Doctor:", doctorResponse.data);
        checkAuth();
        return doctorResponse.data;
      }
    } catch (error) {
      console.error("Doctor login error:", error);
    }

    try {
      // Attempt Patient login
      const patientResponse = await axios.post(patientEndpoint, loginData, {
        withCredentials: true,
      });

      if (patientResponse.data.status === 1) {
        console.log("Login successful as Patient:", patientResponse.data);
        checkAuth();
        return patientResponse.data;
      }

      throw new Error(
        patientResponse.data.message || "Login failed for Patient"
      );
    } catch (error) {
      console.error("Patient login error:", error);
      throw new Error("Login failed for both Doctor and Patient");
    }
  };

  const checkAuth = async () => {

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/users/auth`,
        {},
        {
          withCredentials: true,
        }
      );
      const data = response.data;

      if (data && data.user.TypeIs === 1) {
        navigate("/doctor");
      } else if (data && data.user.TypeIs === 2) {
        navigate("/patient");
      } else {
        console.log("Invalid User");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await axios.post(
          `${import.meta.env.VITE_ENDPOINT}/users/auth`,
          {},
          {
            withCredentials: true,
          }
        );
        const data = await response.data;

        if (data && data.user.TypeIs === 1) {
          navigate("/doctor");
        } else if (data && data.user.TypeIs === 2) {
          navigate("/patient");
        } else {
          console.log("Invalid User");
        }
      } catch (error) {
        console.error(error);
      }
    };

    checkAuth();
  }, [navigate]);

  return (
    <section>
      <div className="flex flex-grow flex-col justify-center gap-[2rem] items-center">
        <form id="homeForm" onSubmit={loginAPI}>
          <h1>
            Login<em className="font-normal text-accent">.</em>
          </h1>
          <div className="flex flex-col gap-[1rem]">
            <div className="flex flex-col gap-[0.5rem]">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                name="email"
                id="email"
                placeholder="sam@email.com"
                value={email}
                onChange={handleChange(setEmail)}
              />
            </div>
            <div className="flex flex-col gap-[0.5rem]">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                name="password"
                id="password"
                placeholder="8 Chars, Ab, 123, !#*"
                value={password}
                onChange={handleChange(setPassword)}
              />
            </div>
          </div>
          <button type="submit" className="specialButton">
            Login
          </button>
        </form>
      </div>
    </section>
  );
}
