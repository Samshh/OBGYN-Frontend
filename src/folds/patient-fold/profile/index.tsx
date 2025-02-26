import ProfileCard from "./components/PatientProfileCard";
import axios from "axios";
import { useEffect, useState } from "react";
import Cookies from "js-cookie";

interface PatientProfile {
  PatientID: number;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  BirthDate: string;
  SexID: number;
  UserName: string;
  UserPassword: string;
  ContactNumber: string;
  EmailAddress: string;
  HomeAddress: string;
}

export default function Profile() {
  const [profileData, setProfileData] = useState<PatientProfile | null>(null);
  const [PatientID, setPatientId] = useState<number | null>(null);

  useEffect(() => {
    const patientIdCookie = Cookies.get("PatientID");
    console.log("PatientID cookie value: ", patientIdCookie);
    const id = parseInt(patientIdCookie || "0", 10);
    setPatientId(id);
    console.log("Parsed PatientID: ", id);
  }, []);

  useEffect(() => {
    const getProfile = async () => {
      if (PatientID) {
        try {
          const response = await axios.get(
            `http://localhost:3000/users/getPatient/${PatientID}`
          );
          const data = response.data;
          console.log("Fetched data: ", data);
          if (data && data.PatientID) {
            const profile: PatientProfile = {
              PatientID: data.PatientID,
              FirstName: data.FirstName,
              MiddleName: data.MiddleName,
              LastName: data.LastName,
              BirthDate: data.BirthDate,
              SexID: data.SexID,
              UserName: data.UserName,
              UserPassword: data.UserPassword,
              ContactNumber: data.ContactNumber,
              EmailAddress: data.EmailAddress,
              HomeAddress: data.HomeAddress,
            };
            setProfileData(profile);
            console.log("Profile data: ", profile);
          } else {
            console.error("Profile data is incomplete or undefined", data);
          }
        } catch (error) {
          console.error("Profile fetch failed", error);
        }
      }
    };
    getProfile();
  }, [PatientID]);

  return (
    <div className="flex-grow flex flex-col h-auto">
      <div className="flex-col flex gap-[1rem]">
        <div className="flex flex-col justify-center items-start sticky top-0 bg-white py-[1rem]">
          <h1>
            Patient Profile<em>.</em>
          </h1>
        </div>
        <div className="grid grid-cols-1 grid-rows-2 gap-[1rem] lg:grid-cols-2 lg:grid-rows-1">
          {profileData && <ProfileCard profile={profileData} />}
        </div>
      </div>
    </div>
  );
}