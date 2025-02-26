import HomeNav from "@/navs/HomeNav";
import TitleHandler from "@/TitleHandler";
import { Outlet } from "react-router-dom";

export default function HomeLayout() {
  return (
    <>
      <TitleHandler />
      <HomeNav />
      <Outlet />
    </>
  );
}
