import { useEffect, useState, useCallback } from "react";
import DashCard from "@/UI/DashCard";
import DataTable from "@/UI/DataTable";
import Modal from "@/UI/Modal";
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
  const [appointmentData, setAppointmentData] = useState<
    AppointmentWithPatient[]
  >([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [isRebookModalOpen, setIsRebookModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithPatient | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rebookFormData, setRebookFormData] = useState({
    StartDateTime: "",
    Note: "",
  });

  const handleRebookChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setRebookFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleRebookSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const startDateTime = new Date(rebookFormData.StartDateTime);
    const endDateTime = new Date(startDateTime);
    endDateTime.setHours(endDateTime.getHours() + 1);

    const appointmentData = {
      ...rebookFormData,
      EndDateTime: endDateTime.toISOString(),
      StatusID: 1,
      PatientID: selectedAppointment?.PatientID,
    };

    try {
      const response = await axios.post(
        `${import.meta.env.VITE_ENDPOINT}/users/createAppointment/${
          selectedAppointment?.PatientID
        }`,
        appointmentData
      );
      if (response.status === 201) {
        alert("Appointment rebooked successfully!");
        setIsRebookModalOpen(false);
        getAppointemntData();
      } else {
        alert("Failed to rebook appointment.");
      }
    } catch {
      alert("Failed to rebook appointment.");
    }
  };

  const handleRebook = () => {
    setIsRebookModalOpen(true);
    setIsModalOpen(false);
  };

  const updateAppointment = async (
    AppointmentID: number,
    updatedData: Partial<AppointmentWithPatient>
  ) => {
    try {
      console.log("Sending request to update appointment:", AppointmentID);
      console.log("Update data:", updatedData);

      const response = await axios.post(
        `${
          import.meta.env.VITE_ENDPOINT
        }/users/updateAppointment/${AppointmentID}`,
        updatedData
      );
      console.log("Updated appointment:", response.data);
      getAppointemntData();
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const handleSave = () => {
    if (selectedAppointment) {
      updateAppointment(selectedAppointment.AppointmentID, {
        StatusID: selectedAppointment.StatusID,
        Note: selectedAppointment.Note,
      });
    }
    setIsModalOpen(false);
  };

  const appointmentColumns = [
    { header: "Patient Name", key: "PatientName" },
    {
      header: "Date",
      key: (row: AppointmentWithPatient) =>
        new Date(row.StartDateTime).toLocaleDateString(),
    },
    {
      header: "Time",
      key: (row: AppointmentWithPatient) =>
        new Date(row.StartDateTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
    },
    { header: "Status ID", key: "StatusID" },
    { header: "Note", key: "Note" },
  ];

  const patientColumns = [
    { header: "First Name", key: "FirstName" },
    { header: "Middle Name", key: "MiddleName" },
    { header: "Last Name", key: "LastName" },
    { header: "Birth Date", key: "BirthDate" },
    {
      header: "Sex",
      key: (row: Patient) => (row.SexID === 1 ? "Male" : "Female"),
    },
    { header: "Contact Number", key: "ContactNumber" },
    { header: "Email Address", key: "EmailAddress" },
  ];

  const getPatientByID = async (patientID: number) => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}/users/getPatient/${patientID}`
      );
      console.log("Fetched patient data: ", response.data); // Log fetched patient data
      return response.data;
    } catch (error) {
      console.error("Error fetching patient data: ", error);
    }
  };

  const getAppointemntData = useCallback(async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}/users/getAppointments`
      );
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
      const response = await axios.get(
        `${import.meta.env.VITE_ENDPOINT}/users/getPatients`
      );
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

  const handleRowClick = (row: AppointmentWithPatient) => {
    setSelectedAppointment(row);
    setIsModalOpen(true);
  };

  return (
    <>
      <div className="flex flex-col gap-[1rem]">
        <DashCard>
          <DashCard.Title>Appointments</DashCard.Title>
          <DashCard.Separator />
          <DashCard.Content className="overflow-x-auto">
            <DataTable<AppointmentWithPatient>
              className="w-full"
              data={appointmentData}
              columns={appointmentColumns}
              onRowClick={handleRowClick}
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
      {isModalOpen && selectedAppointment && (
        <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          <div className="flex flex-col gap-[1rem]">
            <div className="flex items-center justify-between gap-[1rem]">
              <h3>Details</h3>
              <Modal.Close
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
              >
                &times;
              </Modal.Close>
            </div>
            <Modal.Separator />
            <p>
              <strong>Patient Name:</strong> {selectedAppointment.PatientName}
            </p>
            <p>
              <strong>ETA:</strong>{" "}
              {new Date(selectedAppointment.StartDateTime).toLocaleTimeString(
                [],
                {
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                }
              )}
            </p>
            <div className="flex gap-[1rem] items-center justify-start">
              <label htmlFor="status">
                <strong>Status:</strong>
              </label>
              <select
                id="status"
                value={selectedAppointment.StatusID}
                onChange={(e) =>
                  setSelectedAppointment({
                    ...selectedAppointment,
                    StatusID: parseInt(e.target.value),
                  })
                }
              >
                <option value="1">Pending</option>
                <option value="2">Done</option>
                <option value="3">Cancelled</option>
              </select>
            </div>
            <p>
              <strong>Note:</strong> {selectedAppointment.Note}
            </p>
            <div className="flex gap-[1rem] justify-end">
              <button onClick={handleSave}>Save</button>
              <button className="specialButton" onClick={handleRebook}>
                Rebook
              </button>
            </div>
          </div>
        </Modal>
      )}
      {isRebookModalOpen && (
        <Modal
          isOpen={isRebookModalOpen}
          onClose={() => setIsRebookModalOpen(false)}
        >
          <h2>Rebook an Appointment</h2>
          <form
            onSubmit={handleRebookSubmit}
            className="flex flex-col gap-[1rem]"
          >
            <div className="flex flex-col gap-[0.5rem]">
              <label>Select date & time:</label>
              <input
                title="StartDateTime"
                type="datetime-local"
                name="StartDateTime"
                value={rebookFormData.StartDateTime}
                onChange={handleRebookChange}
                required
                min={new Date().toISOString().slice(0, 16)}
                max={new Date(
                  new Date().setFullYear(new Date().getFullYear() + 1)
                )
                  .toISOString()
                  .slice(0, 16)}
                className="cursor-pointer"
              />
            </div>
            <div className="flex flex-col gap-[0.5rem]">
              <label>Note:</label>
              <textarea
                title="Note"
                name="Note"
                value={rebookFormData.Note}
                onChange={handleRebookChange}
                className="border border-border rounded-lg p-[0.5rem]"
              />
            </div>
            <div className="grid grid-cols-2 gap-[1rem]">
              <button className="specialButton" type="submit">
                Rebook Appointment
              </button>
              <button type="button" onClick={() => setIsRebookModalOpen(false)}>
                Close
              </button>
            </div>
          </form>
        </Modal>
      )}
    </>
  );
}
