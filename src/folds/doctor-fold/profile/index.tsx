import ProfileCard from "@/folds/doctor-fold/profile/components/AdminProfileCard";
import DashCard from "@/UI/DashCard";
import axios from "axios";
import { useEffect, useState } from "react";

interface DoctorProfile {
  AdminID: number;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  BirthDate: string;
  SexID: number;
  UserName: string;
  UserPassword: string;
  ContactNumber: string;
  EmailAddress: string;
}

export default function Profile() {
  const [profileData, setProfileData] = useState<DoctorProfile | null>(null);

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_ENDPOINT}/users/getAdmin`,
          {}
        );
        const data = response.data;
        console.log("Fetched data: ", data);
        if (Array.isArray(data) && data.length > 0 && data[0].AdminID) {
          const profile: DoctorProfile = {
            AdminID: data[0].AdminID,
            FirstName: data[0].FirstName,
            MiddleName: data[0].MiddleName,
            LastName: data[0].LastName,
            BirthDate: data[0].BirthDate,
            SexID: data[0].SexID,
            UserName: data[0].UserName,
            UserPassword: data[0].UserPassword,
            ContactNumber: data[0].ContactNumber,
            EmailAddress: data[0].EmailAddress,
          };
          setProfileData(profile);
          console.log("Profile data: ", profile);
        } else {
          console.error("Profile data is incomplete or undefined", data);
        }
      } catch (error) {
        console.error("Profile fetch failed", error);
      }
    };
    getProfile();
  }, []);

  return (
    <div className="flex-grow flex flex-col h-auto">
      <div className="flex-col flex gap-[1rem]">
        <div className="flex flex-col justify-center items-start sticky top-0 bg-white py-[1rem]">
          <h1>
            Doctor Profile<em>.</em>
          </h1>
        </div>
        <div className="grid grid-cols-1 grid-rows-2 gap-[1rem] lg:grid-cols-2 lg:grid-rows-1">
          {profileData && <ProfileCard profile={profileData} />}
          <DashCard>
            <DashCard.Title className="flex items-center gap-[1rem] justify-between">
              Sched. <button type="button">Add leave +</button>
            </DashCard.Title>
            <DashCard.Content>Add a data table here for the</DashCard.Content>
          </DashCard>
        </div>
      </div>
    </div>
  );
}
