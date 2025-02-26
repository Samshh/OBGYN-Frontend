import { useEffect, useState, useCallback } from "react";
import DashCard from "@/UI/DashCard";
import DataTable from "@/UI/DataTable";
import axios from "axios";

interface Appointment {
  AppointmentID: number;
  PatientID: number;
  StartDateTime: string;
  EndDateTime: string;
  StatusID: number;
  Note: string;
}

interface AppointmentWithPatient extends Appointment {
  PatientName: string;
}

interface Patient {
  PatientID: number;
  FirstName: string;
  MiddleName: string;
  LastName: string;
  BirthDate: string;
  SexID: number;
  ContactNumber: string;
  EmailAddress: string;
}

export default function Userdata() {
  const [appointmentData, setAppointmentData] = useState<AppointmentWithPatient[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);

  const appointmentColumns = [
    { header: "Patient Name", key: "PatientName" },
    { header: "Date", key: (row: AppointmentWithPatient) => new Date(row.StartDateTime).toLocaleDateString() },
    { header: "Time", key: (row: AppointmentWithPatient) => new Date(row.StartDateTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }) },
    { header: "Status ID", key: "StatusID" },
    { header: "Note", key: "Note" },
  ];

  const patientColumns = [
    { header: "First Name", key: "FirstName" },
    { header: "Middle Name", key: "MiddleName" },
    { header: "Last Name", key: "LastName" },
    { header: "Birth Date", key: "BirthDate" },
    { header: "Sex", key: (row: Patient) => (row.SexID === 1 ? "Male" : "Female") },
    { header: "Contact Number", key: "ContactNumber" },
    { header: "Email Address", key: "EmailAddress" },
  ];

  const getPatientByID = async (patientID: number) => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_ENDPOINT}/users/getPatient/${patientID}`);
      console.log("Fetched patient data: ", response.data); // Log fetched patient data
      return response.data;
    } catch (error) {
      console.error("Error fetching patient data: ", error);
    }
  };

  const getAppointemntData = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_ENDPOINT}/users/getAppointments`);
      console.log("Fetched appointment data: ", response.data); // Log fetched appointment data
      const appointments: Appointment[] = response.data;

      const appointmentsWithPatient = await Promise.all(
        appointments.map(async (appointment) => {
          const patient = await getPatientByID(appointment.PatientID);
          return {
            ...appointment,
            PatientName: `${patient.FirstName} ${patient.LastName}`,
          };
        })
      );

      // Sort appointments by AppointmentID in descending order
      appointmentsWithPatient.sort((a, b) => b.AppointmentID - a.AppointmentID);

      console.log("Appointments with patient data: ", appointmentsWithPatient); // Log appointments with patient data
      setAppointmentData(appointmentsWithPatient);
    } catch (error) {
      console.error("Error fetching appointment data: ", error);
    }
  }, []);

  const getPatients = useCallback(async () => {
    try {
      const response = await axios.get(`${import.meta.env.VITE_ENDPOINT}/users/getPatients`);
      console.log("Fetched patients data: ", response.data); // Log fetched patients data
      setPatients(response.data);
    } catch (error) {
      console.error("Error fetching patients: ", error);
    }
  }, []);

  useEffect(() => {
    getAppointemntData();
    getPatients();
  }, [getAppointemntData, getPatients]);

  return (
    <div className="flex flex-col gap-[1rem]">
      <DashCard>
        <DashCard.Title>Appointments</DashCard.Title>
        <DashCard.Separator />
        <DashCard.Content className="overflow-x-auto">
          <DataTable<AppointmentWithPatient>
            className="w-full"
            data={appointmentData}
            columns={appointmentColumns}
          />
        </DashCard.Content>
      </DashCard>

      <DashCard>
        <DashCard.Title>Patients</DashCard.Title>
        <DashCard.Separator />
        <DashCard.Content className="overflow-x-auto">
          <DataTable<Patient>
            className="w-full"
            data={patients}
            columns={patientColumns}
          />
        </DashCard.Content>
      </DashCard>
    </div>
  );
}