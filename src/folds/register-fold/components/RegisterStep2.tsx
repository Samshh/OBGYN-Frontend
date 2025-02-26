import { ChangeEvent, useState } from "react";
import useRegisterStore from "../store";
import { useShallow } from "zustand/react/shallow";
import { Icon } from "@iconify/react";

interface RegisterStep2Props {
  validateUsername: (username: string | null) => boolean;
  validatePassword: (password: string | null) => boolean;
  validateEmail: (emailAddress: string | null) => boolean;
}

export default function RegisterStep2({
  validateUsername,
  validatePassword,
  validateEmail,
}: RegisterStep2Props) {
  const [
    username,
    password,
    contactNumber,
    emailAddress,
    setUsername,
    setPassword,
    setContactNumber,
    setEmailAddress,
  ] = useRegisterStore(
    useShallow((state) => [
      state.username,
      state.password,
      state.contactNumber,
      state.emailAddress,
      state.setUsername,
      state.setPassword,
      state.setContactNumber,
      state.setEmailAddress,
    ])
  );

  const [showPassword, setShowPassword] = useState(false);

  const handleChange =
    (setter: (value: string) => void) => (e: ChangeEvent<HTMLInputElement>) => {
      setter(e.target.value);
    };

  const isUsernameValid = validateUsername(username);
  const isPasswordValid = validatePassword(password);
  const isEmailValid = validateEmail(emailAddress);

  return (
    <>
      <div className="flex flex-col gap-[0.5rem]">
        <label htmlFor="username">
          Username
          {!isUsernameValid && <span className="text-red-500"> *</span>}
        </label>
        <input
          type="text"
          value={username || ""}
          onChange={handleChange(setUsername)}
          placeholder="samshh"
        />
      </div>
      <div className="flex flex-col gap-[0.5rem]">
        <label htmlFor="password">
          Password
          {!isPasswordValid && <span className="text-red-500"> *</span>}
        </label>
        <div className="flex items-center justify-center gap-[0.5rem]">
          <div className="flex items-center justify-start w-full">
            <input
              type={showPassword ? "text" : "password"}
              value={password || ""}
              onChange={handleChange(setPassword)}
              placeholder="8 Chars, Ab, 123, !#*"
              className="w-full"
            />
          </div>
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="h-full">
            {showPassword ? (
              <Icon icon="mdi:eye-outline" />
            ) : (
              <Icon icon="mdi:eye-off-outline" />
            )}
          </button>
        </div>
      </div>
      <div className="flex flex-col gap-[0.5rem]">
        <label htmlFor="contactNumber">
          Contact Number
          {!contactNumber && <span className="text-red-500"> *</span>}
        </label>
        <input
          type="text"
          value={contactNumber || ""}
          onChange={handleChange(setContactNumber)}
          placeholder="0969696969"
        />
      </div>
      <div className="flex flex-col gap-[0.5rem]">
        <label htmlFor="emailAddress">
          Email
          {!isEmailValid && <span className="text-red-500"> *</span>}
        </label>
        <input
          type="email"
          value={emailAddress || ""}
          onChange={handleChange(setEmailAddress)}
          placeholder="sam@samshh.me"
        />
      </div>
    </>
  );
}
