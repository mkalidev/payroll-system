import React from "react";
import { GoRocket } from "react-icons/go";
import { IoDiceOutline } from "react-icons/io5";
import { LuHandshake } from "react-icons/lu";
import { PiHeadphones } from "react-icons/pi";
import { RiHome5Line, RiSettingsLine } from "react-icons/ri";
import { Link, useLocation } from "react-router-dom";

const data = [
  {
    id: 1,
    name: "Dashboard",
    icon: <RiHome5Line size={22} />,
    link: "/",
  },
  {
    id: 2,
    name: "Workspace",
    icon: <GoRocket size={22} />,
    link: "/workspace",
  },
  {
    id: 3,
    name: "Payroll",
    icon: <IoDiceOutline size={22} />,
    link: "/payroll",
  },
];

const data2 = [
  {
    id: 1,
    name: "Affiliate ",
    icon: <LuHandshake size={22} />,
    link: "/affiliate",
  },
  {
    id: 2,
    name: "Settings",
    icon: <RiSettingsLine size={22} />,
    link: "/settings",
  },
  {
    id: 3,
    name: "Live Support",
    icon: <PiHeadphones size={22} />,
    link: "/live-support",
  },
];

export default function WorkspaceLayout() {
  const { pathname } = useLocation();

  return (
    <div className="hidden md:block">
      <div className="bg-[#f4f6f8] w-[12rem] h-screen">
        <div className="w-full space-y-4">
          <div className="py-5 px-3 flex items-center gap-2 border-b border-b-black/10 h-[85.12px]">
            
          </div>

          <div className="py-3 px-2 flex flex-col gap-3 w-full border-b border-b-white/10">
            {data.map((item) => {
              const isActive = pathname === item.link;
              return (
                <Link to={item.link} key={item.id} className="flex">
                  {/* left indicator only if active */}
                  {/* <div
                    className={`w-[5px] h-[50px] ${
                      isActive && "bg-c-color"
                    } rounded-r-lg`}
                  ></div> */}

                  <div
                    className={`flex flex-col gap-2 items-center w-full py-2 px-3 text-sm font-light cursor-pointer rounded-lg hover:opacity-60
                      ${isActive ? "bg-c-color text-white" : ""}`}
                  >
                    {item.icon}
                    <span className="">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
          <div className="py-3 pr-3 flex flex-col gap-3 w-full border-b border-b-white/10">
            {data2.map((item) => {
              const isActive = pathname === item.link;
              return (
                <Link to={item.link} key={item.id} className="flex">
                  {/* left indicator only if active */}
                  {/* <div
                    className={`w-[5px] h-[50px] ${
                      isActive && "bg-c-color"
                    } rounded-r-lg`}
                  ></div> */}

                  <div
                    className={`flex flex-col gap-2 items-center w-full py-2 px-3 text-sm font-light cursor-pointer rounded-lg hover:opacity-60
                      ${isActive ? "bg-c-color" : ""}`}
                  >
                    {item.icon}
                    <span className="">{item.name}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
