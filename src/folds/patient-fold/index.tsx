import Dashboard from "./dahsboard";
import usePatientStore from "./store";
import Profile from "./profile";
export default function PatientFold() {
  const currentTab = usePatientStore((state) => state.currentTab);
  return (
    <section>
      {currentTab === 1 ? <Dashboard /> : currentTab === 2 ? <Profile /> : null}
    </section>
  );
}
