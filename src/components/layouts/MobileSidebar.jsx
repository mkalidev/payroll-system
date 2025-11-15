import { X } from "lucide-react";
import React from "react";
import { GoRocket } from "react-icons/go";
import { IoDiceOutline } from "react-icons/io5";
import { LuHandshake } from "react-icons/lu";
import { PiHeadphones } from "react-icons/pi";
import { RiDashboardLine, RiSettingsLine } from "react-icons/ri";
import { Link, matchPath, useLocation } from "react-router-dom";
import { useUser } from "../hooks/useUser";
import { useLogout } from "../hooks/useAuth";

const data = [
  {
    id: 1,
    name: "Dashboard",
    icon: <RiDashboardLine size={22} />,
    link: "/",
  },
  {
    id: 2,
    name: "Workspace",
    icon: <GoRocket size={22} />,
    link: "workspace",
  },
  // {
  //   id: 3,
  //   name: "Payroll",
  //   icon: <IoDiceOutline size={22} />,
  //   link: "/payroll",
  // },
];

const data2 = [
  {
    id: 1,
    name: "Subscription ",
    icon: <LuHandshake size={22} />,
    link: "/subscription",
  },
  {
    id: 2,
    name: "Settings",
    icon: <RiSettingsLine size={22} />,
    link: "/settings",
  },
  {
    id: 3,
    name: "live Support",
    icon: <PiHeadphones size={22} />,
    link: "/live-support",
  },
];

export default function MobileSidebar({ setOpen }) {
  const { pathname } = useLocation();

  const { user } = useUser();
  const { logoutFn } = useLogout();

  return (
    <div className="fixed inset-0 z-50 flex h-screen">
      {/* Backdrop */}
      <div
        className="flex-1 bg-c-bg/20 backdrop-blur-xs bg-opacity-50"
        onClick={() => setOpen(false)}
      />
      <div className="md:hidden block text-white">
        <div className="bg-c-bg w-[16rem] sticky top-0 border-r border-r-white/10 h-screen">
          <div className="w-full space-y-2">
            <div className="py-4 px-3 flex items-center justify-between gap-2 border-b border-b-white/10 h-fit">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-c-color overflow-hidden">
                  <img src={user?.avatar} alt="" />
                </div>
                <div className="space-y-0">
                  <p className="text-xs font-semibold capitalize">
                    {user?.fullName}
                  </p>
                  <p className="text-[10px] text-gray-500 capitalize">
                    {user?.role}
                  </p>
                </div>
              </div>
              <div className="cursor-pointer" onClick={() => setOpen(false)}>
                <X />
              </div>
            </div>

            <div className="py-3 pr-3 flex flex-col gap-3 w-full border-b border-b-white/10">
              {data.map((item) => {
                const match = matchPath(
                  { path: item.link, end: item.link === "/" },
                  pathname
                );
                const isActive = Boolean(match);
                return (
                  <Link
                    to={item.link}
                    key={item.id}
                    className="flex"
                    onClick={() => setOpen(false)}
                  >
                    {/* left indicator only if active */}
                    <div
                      className={`w-[5px] h-[50px] ${
                        isActive && "bg-c-color"
                      } rounded-r-lg`}
                    ></div>

                    <div
                      className={`flex items-center w-full h-[50px] px-3 ml-2 text-sm font-light cursor-pointer rounded-lg hover:opacity-60
                      ${isActive ? "bg-c-color text-white" : ""}`}
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div className="py-3 pr-3 flex flex-col gap-3 w-full border-b border-b-white/10">
              {data2.map((item) => {
                const isActive = pathname === item.link;
                return (
                  <Link
                    to={item.link}
                    key={item.id}
                    className="flex"
                    onClick={() => setOpen(false)}
                  >
                    {/* left indicator only if active */}
                    <div
                      className={`w-[5px] h-[50px] ${
                        isActive && "bg-c-color"
                      } rounded-r-lg`}
                    ></div>

                    <div
                      className={`flex items-center w-full h-[50px] px-3 ml-2 text-sm font-light cursor-pointer rounded-lg hover:opacity-60
                      ${isActive ? "bg-c-color" : ""}`}
                    >
                      {item.icon}
                      <span className="ml-2">{item.name}</span>
                    </div>
                  </Link>
                );
              })}
            </div>
            <div
              className="px-5 py-2 flex flex-col gap-3 w-full"
              onClick={() => logoutFn()}
            >
              <div className="text-sm font-light text-red-500 hover:opacity-60">
                Logout
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
