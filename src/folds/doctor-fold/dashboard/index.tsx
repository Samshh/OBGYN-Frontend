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

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointment, setSelectedAppointment] =
    useState<AppointmentWithPatient | null>(null);
  const [appointmentData, setAppointmentData] = useState<
    AppointmentWithPatient[]
  >([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isRebookModalOpen, setIsRebookModalOpen] = useState(false);
  const [rebookFormData, setRebookFormData] = useState({
    StartDateTime: "",
    Note: "",
  });

  const columns = [
    {
      header: "Patient Name",
      key: "PatientName",
    },
    {
      header: "ETA",
      key: (row: AppointmentWithPatient) => {
        return new Date(row.StartDateTime).toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        });
      },
    },
    { header: "Status ID", key: "StatusID" },
    { header: "Note", key: "Note" },
  ];

  const handleRowClick = (row: AppointmentWithPatient) => {
    setSelectedAppointment(row);
    setIsModalOpen(true);
  };

  const getPatientByID = async (patientID: number) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/users/getPatient/${patientID}`
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching patient data: ", error);
    }
  };

  const updateAppointment = async (
    AppointmentID: number,
    updatedData: Partial<AppointmentWithPatient>
  ) => {
    try {
      console.log("Sending request to update appointment:", AppointmentID);
      console.log("Update data:", updatedData);

      const response = await axios.post(
        `http://localhost:3000/users/updateAppointment/${AppointmentID}`,
        updatedData
      );
      console.log("Updated appointment:", response.data);
      getAppointemntData();
    } catch (error) {
      console.error("Error updating appointment:", error);
    }
  };

  const getAppointemntData = useCallback(async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/users/getAppointments"
      );
      const appointments: Appointment[] = response.data;

      // Filter appointments for today
      const today = new Date();
      const todayStart = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000); // Add 24 hours

      const todayAppointments = appointments.filter((appointment) => {
        const appointmentStart = new Date(appointment.StartDateTime);
        return appointmentStart >= todayStart && appointmentStart < todayEnd;
      });

      // Filter out cancelled appointments
      const activeAppointments = todayAppointments.filter(
        (appointment) => appointment.StatusID !== 3
      );

      // Sort appointments by start time
      activeAppointments.sort(
        (a, b) =>
          new Date(a.StartDateTime).getTime() -
          new Date(b.StartDateTime).getTime()
      );

      const appointmentsWithPatient = await Promise.all(
        activeAppointments.map(async (appointment) => {
          const patient = await getPatientByID(appointment.PatientID);
          return {
            ...appointment,
            PatientName: `${patient.FirstName} ${patient.LastName}`,
          };
        })
      );

      setAppointmentData(appointmentsWithPatient);
    } catch (error) {
      console.error("Error fetching appointment data: ", error);
    }
  }, []);

  useEffect(() => {
    getAppointemntData();
  }, [getAppointemntData]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // Update every second

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  const handleSave = () => {
    if (selectedAppointment) {
      updateAppointment(selectedAppointment.AppointmentID, {
        StatusID: selectedAppointment.StatusID,
        Note: selectedAppointment.Note,
      });
    }
    setIsModalOpen(false);
  };

  const handleRebook = () => {
    setIsRebookModalOpen(true);
    setIsModalOpen(false);
  };

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
        `http://localhost:3000/users/createAppointment/${selectedAppointment?.PatientID}`,
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

  return (
    <div className="flex-grow flex flex-col h-auto">
      <div className="flex-col flex gap-[1rem]">
        <div className="flex justify-between items-end sticky top-0 bg-white py-[1rem]">
          <div className="flex flex-col justify-center items-start">
            <h3>
              Hello<em>!</em>
            </h3>
            <h1>
              Dr<em>.</em> Juliet
            </h1>
          </div>
          <div className="text-end">
            <p className="uppercase">{currentTime.toDateString()}</p>
            <h3>
              {currentTime.toLocaleString("en-GB", {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
                hour12: false,
              })}
            </h3>
          </div>
        </div>
        <div className="grid grid-cols-1 grid-rows-2 gap-[1rem] lg:grid-cols-2 lg:grid-rows-1">
          <DashCard className="h-full">
            <DashCard.Title>
              Appointments <p>(for today)</p>
            </DashCard.Title>
            <DashCard.Separator />
            <DashCard.Content className="overflow-x-auto">
              <DataTable<AppointmentWithPatient>
                className="w-full"
                data={appointmentData}
                columns={columns}
                onRowClick={handleRowClick}
              />
            </DashCard.Content>
          </DashCard>
          <DashCard className="items-center justify-center">
            <h2 className="text-border">
              Coming Soon<em>.</em>
            </h2>
          </DashCard>
        </div>
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
        <Modal isOpen={isRebookModalOpen} onClose={() => setIsRebookModalOpen(false)}>
          <h2>Rebook an Appointment</h2>
          <form onSubmit={handleRebookSubmit} className="flex flex-col gap-[1rem]">
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
                max={new Date(new Date().setFullYear(new Date().getFullYear() + 1))
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
    </div>
  );
}