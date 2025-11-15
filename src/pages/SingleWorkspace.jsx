import React from "react";
import { HiOutlineBriefcase } from "react-icons/hi2";
import { PiReceipt, PiUsersThreeLight } from "react-icons/pi";
import { RiAdminLine, RiHome5Line } from "react-icons/ri";
import Tabbar from "../components/layouts/Tabbar";
import { useParams } from "react-router-dom";
import Overview from "../components/features/workspace/Overview";
import Payroll from "../components/features/workspace/Payroll";
import Employees from "../components/features/workspace/Employees";
import { useGetSingleWorkspace } from "../components/hooks/useWorkspace";
import Admins from "../components/features/workspace/Admins";
import { ChevronLeft } from "lucide-react";

const data = [
  {
    id: 1,
    name: "Overview",
    icon: <RiHome5Line size={22} />,
    link: "overview",
    content: <Overview />,
  },
  {
    id: 2,
    name: "Payroll",
    icon: <PiReceipt size={22} />,
    link: "payroll",
    content: <Payroll />,
  },
  {
    id: 3,
    name: "Employees",
    icon: <PiUsersThreeLight size={22} />,
    link: "employees",
    content: <Employees />,
  },
  {
    id: 4,
    name: "Jobs",
    icon: <HiOutlineBriefcase size={22} />,
    link: "jobs",
    content: <Overview />,
  },
  {
    id: 5,
    name: "Admins",
    icon: <RiAdminLine size={22} />,
    link: "admins",
    content: <Admins />,
  },
];

export default function SingleWorkspace() {
  const { slug, id: activeLink } = useParams();

  const { singleWorkspace, isLoadingSingleWorkspace, error } =
    useGetSingleWorkspace(slug);

  if (isLoadingSingleWorkspace) {
    return (
      <div className="w-full h-full min-h-[70dvh] flex flex-col gap-3 items-center justify-center">
        <img src="/loading.svg" alt="" className="w-30" />
        <p className="text-gray-500">Loading workspace...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full h-full min-h-[70dvh] flex flex-col gap-3 items-center justify-center">
        <img src="/error.svg" alt="" className="w-36" />
        <p className="text-gray-500 text-center max-w-[230px]">
          {error?.message}
        </p>
      </div>
    );
  }

  // find the tab whose `link` matches the URL param
  const activeTab = data.find((tab) => tab.link === activeLink);

  return (
    <div className="w-full space-y-5">
      <div className="space-y-6 w-full">
        <div className="w-full flex flex-col gap-3">
          <div className="flex items-center gap-3">
            <div
              className="w-fit border border-gray-200 p-3 rounded-lg hover:bg-white cursor-pointer"
              onClick={() => window.history.back()}
            >
              <ChevronLeft size={20} />
            </div>
            <img
              src={singleWorkspace?.logo}
              alt=""
              className="rounded-lg w-10"
            />
            <h1 className="text-2xl font-semibold">{singleWorkspace?.name}</h1>
          </div>
          <p>{singleWorkspace?.description}</p>
          <div className="space-y-2">
            <p className="text-xs text-gray-700">Created by</p>
            <div className="flex items-center gap-2">
              <img
                src={singleWorkspace?.userId?.avatar}
                alt=""
                className="w-8 h-8 rounded-full"
              />
              <span className="text-sm font-medium">
                {singleWorkspace?.userId?.fullName}
              </span>
            </div>
          </div>
        </div>
        <Tabbar slug={slug} data={data} />

        <div className="w-full">
          <div className="w-full min-h-[calc(100vh-300px)] bg-white rounded-lg p-3 md:p-6">
            {activeTab ? (
              activeTab.content
            ) : (
              <div className="text-center text-gray-500">
                Select a tab or check the URL.
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
